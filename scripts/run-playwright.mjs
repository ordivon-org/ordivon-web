import { spawnSync } from "node:child_process";
import { constants as fsConstants } from "node:fs";
import { access, readdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import process from "node:process";

const ROOT = process.cwd();

async function isExecutable(path) {
  try {
    await access(path, fsConstants.X_OK);
    return true;
  } catch {
    return false;
  }
}

async function findProvisionedBrowser(root, depth = 0) {
  if (!root || depth > 4) return null;
  let entries;
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch {
    return null;
  }

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (entry.name !== "chrome" && entry.name !== "headless_shell") continue;
    const path = join(root, entry.name);
    if (await isExecutable(path)) return path;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const found = await findProvisionedBrowser(join(root, entry.name), depth + 1);
    if (found) return found;
  }
  return null;
}

async function resolveBrowserCacheRoot() {
  const candidates = [
    process.env.PLAYWRIGHT_BROWSERS_PATH,
    join(homedir(), ".cache", "ms-playwright"),
  ].filter(Boolean);

  for (const candidate of [...new Set(candidates.map((value) => resolve(value)))]) {
    if (await findProvisionedBrowser(candidate)) return candidate;
  }

  throw new Error(
    `No provisioned Playwright Chromium was found under ${candidates.join(", ")}. ` +
      "Provision the browser once outside disposable Workspaces or set PLAYWRIGHT_BROWSERS_PATH to an existing cache root.",
  );
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

const browserCacheRoot = await resolveBrowserCacheRoot();
const env = { ...process.env, PLAYWRIGHT_BROWSERS_PATH: browserCacheRoot };
const tempRoot = await resolveTempRoot(env);
env.TMPDIR = tempRoot;
env.TMP = tempRoot;
env.TEMP = tempRoot;

process.stderr.write(`[ordivon-web] playwright cache=${browserCacheRoot} temp=${tempRoot}\n`);
const child = spawnSync(playwrightBin, process.argv.slice(2), {
  cwd: ROOT,
  env,
  stdio: "inherit",
});

if (child.error) throw child.error;
if (child.signal) {
  process.stderr.write(`[ordivon-web] playwright terminated by ${child.signal}\n`);
  process.exit(1);
}
process.exit(child.status ?? 1);
