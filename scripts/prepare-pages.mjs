import { execFileSync } from "node:child_process";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { articleMetadata } from "../content/articles/generated-metadata.ts";

const root = process.cwd();
const output = join(root, "out");
const redirectsPath = fileURLToPath(new URL("./legacy-redirects.json", import.meta.url));
const revision = process.env.GITHUB_SHA || execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
function redirectDocument(target) {
  const canonicalPath = target.split("#", 1)[0];
  const canonical = `https://ordivon.com${canonicalPath}`;
  const safeTarget = escapeHtml(target);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=${safeTarget}"><link rel="canonical" href="${escapeHtml(canonical)}"><title>Moved — Ordivon</title><script>location.replace(${JSON.stringify(target)});</script></head><body><p>This page moved to <a href="${safeTarget}">${safeTarget}</a>.</p></body></html>`;
}
async function collectRoutes(path, prefix = "") {
  const routes = [];
  for (const entry of await readdir(path, { withFileTypes: true })) {
    if (entry.isDirectory()) routes.push(...await collectRoutes(join(path, entry.name), join(prefix, entry.name)));
    else if (entry.name === "index.html") routes.push(`/${prefix}`.replaceAll("\\", "/").replace(/\/$/, "") || "/");
  }
  return routes;
}

await readFile(join(output, "index.html"));
await readFile(join(output, "system", "index.html"));
const redirects = JSON.parse(await readFile(redirectsPath, "utf8"));
for (const [source, target] of Object.entries(redirects)) {
  if (!source.startsWith("/") || !target.startsWith("/")) throw new Error(`invalid redirect ${source} -> ${target}`);
  const destination = join(output, source.replace(/^\/+|\/+$/g, ""), "index.html");
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, redirectDocument(target));
}
await writeFile(join(output, "CNAME"), "ordivon.com\n");
await writeFile(join(output, ".nojekyll"), "");
const routes = await collectRoutes(output);
await writeFile(join(output, "deploy-manifest.json"), JSON.stringify({
  schemaVersion: 1,
  sourceCommit: revision,
  articleCount: articleMetadata.length,
  routeCount: routes.length,
}, null, 2) + "\n");
console.log(`pages_artifact=prepared source=${revision} articles=${articleMetadata.length} routes=${routes.length}`);
