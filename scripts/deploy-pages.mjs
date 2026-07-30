import { spawnSync } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = process.cwd();
const output = join(root, "out");
const redirectsPath = fileURLToPath(new URL("./legacy-redirects.json", import.meta.url));

function run(command, args, { cwd = root, capture = false } = {}) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
  });
  if (result.status !== 0) {
    const detail = capture ? `${result.stdout || ""}${result.stderr || ""}`.trim() : "";
    throw new Error(`${command} ${args.join(" ")} failed${detail ? `:\n${detail}` : ""}`);
  }
  return capture ? result.stdout.trim() : "";
}

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function redirectDocument(target) {
  const canonicalPath = target.split("#", 1)[0];
  const canonical = `https://ordivon.com${canonicalPath}`;
  const safeTarget = escapeHtml(target);
  return `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<meta http-equiv="refresh" content="0;url=${safeTarget}">\n<link rel="canonical" href="${escapeHtml(canonical)}">\n<title>Moved — Ordivon</title>\n<script>location.replace(${JSON.stringify(target)});</script>\n</head>\n<body><p>This page moved to <a href="${safeTarget}">${safeTarget}</a>.</p></body>\n</html>\n`;
}

async function assertBuild() {
  for (const path of ["index.html", "system/index.html"]) {
    try {
      await readFile(join(output, path));
    } catch {
      throw new Error(`missing static export file out/${path}; run pnpm build before deployment`);
    }
  }
}

async function clearWorktree(path) {
  for (const entry of await readdir(path)) {
    if (entry === ".git") continue;
    await rm(join(path, entry), { recursive: true, force: true });
  }
}

async function copyOutput(path) {
  for (const entry of await readdir(output)) {
    await cp(join(output, entry), join(path, entry), { recursive: true });
  }
  await writeFile(join(path, "CNAME"), "ordivon.com\n");
  await writeFile(join(path, ".nojekyll"), "");
}

async function materializeRedirects(path) {
  const redirects = JSON.parse(await readFile(redirectsPath, "utf8"));
  for (const [source, target] of Object.entries(redirects)) {
    if (!source.startsWith("/") || !target.startsWith("/")) throw new Error(`invalid redirect ${source} -> ${target}`);
    const destination = join(path, source.replace(/^\/+|\/+$/g, ""), "index.html");
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, redirectDocument(target));
  }
}

const dirty = run("git", ["status", "--porcelain"], { capture: true });
if (dirty) throw new Error("refusing to deploy a dirty Git worktree");
run("git", ["fetch", "origin", "--prune"]);
const revision = run("git", ["rev-parse", "HEAD"], { capture: true });
const mainRevision = run("git", ["rev-parse", "origin/main"], { capture: true });
if (revision !== mainRevision) throw new Error(`refusing to deploy ${revision}; origin/main is ${mainRevision}`);
await assertBuild();

const tempRoot = await mkdtemp(join(tmpdir(), "ordivon-web-pages-"));
const worktree = join(tempRoot, "site");
let worktreeAdded = false;
try {
  run("git", ["worktree", "add", "--detach", worktree, "origin/production/v1-pages"]);
  worktreeAdded = true;
  await clearWorktree(worktree);
  await copyOutput(worktree);
  await materializeRedirects(worktree);
  run("git", ["add", "-A"], { cwd: worktree });
  const changes = run("git", ["status", "--porcelain"], { cwd: worktree, capture: true });
  if (!changes) {
    console.log(`GitHub Pages already contains ${revision}.`);
  } else {
    run("git", ["commit", "-m", `deploy: publish ${revision.slice(0, 12)}`], { cwd: worktree });
    run("git", ["push", "origin", "HEAD:production/v1-pages"], { cwd: worktree });
    console.log(`Published ${revision} to production/v1-pages from ${relative(root, output)}.`);
  }
} finally {
  if (worktreeAdded) run("git", ["worktree", "remove", "--force", worktree]);
  await rm(tempRoot, { recursive: true, force: true });
}
