import { spawn } from "node:child_process";
import { constants as fsConstants } from "node:fs";
import { access } from "node:fs/promises";
import { resolve } from "node:path";
import process from "node:process";
import { resolveBrowserCacheRoot, resolveBrowserExecutable } from "./browser-equipment.mjs";
import { configureBrowserTempEnvironment } from "./browser-runtime.mjs";

const ROOT = process.cwd();

async function isExecutable(path) {
  try {
    await access(path, fsConstants.X_OK);
    return true;
  } catch {
    return false;
  }
}

const playwrightBin = resolve(ROOT, "node_modules", ".bin", "playwright");
if (!(await isExecutable(playwrightBin))) {
  throw new Error(`Project Playwright executable is missing at ${playwrightBin}; run pnpm bootstrap first.`);
}

const { chromium } = await import("@playwright/test");
const browserExecutable = await resolveBrowserExecutable(chromium.executablePath());
const browserCacheRoot = await resolveBrowserCacheRoot(browserExecutable);
const env = { ...process.env, PLAYWRIGHT_BROWSERS_PATH: browserCacheRoot, ORDIVON_WEB_BROWSER: browserExecutable };
const tempRoot = await configureBrowserTempEnvironment(env);

async function waitForStaticServer(server, stderr) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Static browser server exited before readiness: ${stderr.value.trim()}`);
    }
    try {
      const response = await fetch("http://127.0.0.1:8788/", { signal: AbortSignal.timeout(500) });
      if (response.ok) return;
    } catch {}
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 100));
  }
  throw new Error(`Static browser server did not become ready: ${stderr.value.trim()}`);
}

const playwrightArgs = process.argv.slice(2);
const needsStaticServer = playwrightArgs[0] === "test" && !playwrightArgs.includes("--list");
const serverStderr = { value: "" };
let staticServer = null;
if (needsStaticServer) {
  staticServer = spawn("/usr/bin/python3", ["-m", "http.server", "8788", "--bind", "127.0.0.1", "--directory", "out", "--protocol", "HTTP/1.1"], {
    cwd: ROOT,
    env,
    stdio: ["ignore", "ignore", "pipe"],
  });
  staticServer.stderr.on("data", (chunk) => {
    serverStderr.value = (serverStderr.value + chunk.toString()).slice(-16_384);
  });
  await waitForStaticServer(staticServer, serverStderr);
}

process.stderr.write(`[ordivon-web] playwright browser=${browserExecutable} cache=${browserCacheRoot} temp=${tempRoot}${needsStaticServer ? " static-server=127.0.0.1:8788" : ""}\n`);
let result;
try {
  result = await new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(playwrightBin, playwrightArgs, {
      cwd: ROOT,
      env,
      stdio: "inherit",
    });
    child.once("error", rejectPromise);
    child.once("exit", (code, signal) => resolvePromise({ code, signal }));
  });
} finally {
  if (staticServer && staticServer.exitCode === null) staticServer.kill("SIGTERM");
}

if (result.signal) {
  process.stderr.write(`[ordivon-web] playwright terminated by ${result.signal}\n`);
  process.exit(1);
}
process.exit(result.code ?? 1);
