import { spawn, spawnSync } from "node:child_process";
import { constants as fsConstants } from "node:fs";
import { access } from "node:fs/promises";
import { resolve } from "node:path";
import process from "node:process";
import { resolveBrowserCacheRoot, resolveBrowserExecutable } from "./browser-equipment.mjs";

const ROOT = process.cwd();

async function isExecutable(path) {
  try {
    await access(path, fsConstants.X_OK);
    return true;
  } catch {
    return false;
  }
}

async function resolveTempRoot(env) {
  const explicit = env.ORDIVON_WEB_BROWSER_TMPDIR;
  const ambient = explicit || env.TMPDIR || env.TMP || env.TEMP || "/tmp";
  const chromiumSocketSuffixBudget = 48;
  const unixSocketBudget = 100;
  if (Buffer.byteLength(ambient) + chromiumSocketSuffixBudget <= unixSocketBudget) return ambient;

  await access("/tmp", fsConstants.W_OK).catch(() => {
    throw new Error(
      `Browser temporary root is too long for Chromium Unix sockets (${ambient}); ` +
        "set ORDIVON_WEB_BROWSER_TMPDIR to a short writable path.",
    );
  });
  return "/tmp";
}

const playwrightBin = resolve(ROOT, "node_modules", ".bin", "playwright");
if (!(await isExecutable(playwrightBin))) {
  throw new Error(`Project Playwright executable is missing at ${playwrightBin}; run pnpm bootstrap first.`);
}

const { chromium } = await import("@playwright/test");
const browserExecutable = await resolveBrowserExecutable(chromium.executablePath());
const browserCacheRoot = await resolveBrowserCacheRoot(browserExecutable);
const env = { ...process.env, PLAYWRIGHT_BROWSERS_PATH: browserCacheRoot, ORDIVON_WEB_BROWSER: browserExecutable };
const tempRoot = await resolveTempRoot(env);
env.TMPDIR = tempRoot;
env.TMP = tempRoot;
env.TEMP = tempRoot;

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
  staticServer.stderr.on("data", (chunk) => { serverStderr.value += chunk.toString(); });
  await waitForStaticServer(staticServer, serverStderr);
}

process.stderr.write(`[ordivon-web] playwright browser=${browserExecutable} cache=${browserCacheRoot} temp=${tempRoot}${needsStaticServer ? " static-server=127.0.0.1:8788" : ""}\n`);
let child;
try {
  child = spawnSync(playwrightBin, playwrightArgs, {
    cwd: ROOT,
    env,
    stdio: "inherit",
  });
} finally {
  if (staticServer && staticServer.exitCode === null) staticServer.kill("SIGTERM");
}

if (child.error) throw child.error;
if (child.signal) {
  process.stderr.write(`[ordivon-web] playwright terminated by ${child.signal}\n`);
  process.exit(1);
}
process.exit(child.status ?? 1);
