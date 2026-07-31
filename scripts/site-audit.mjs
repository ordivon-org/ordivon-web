import { execFileSync } from "node:child_process";
import process from "node:process";

const repo = process.cwd();
const base = (process.env.SITE_BASE_URL || "https://ordivon.com").replace(/\/$/, "");
const run = (args) => execFileSync("git", args, { cwd: repo, encoding: "utf8" }).trim();
run(["fetch", "origin", "main", "--prune", "--quiet"]);
const main = run(["rev-parse", "origin/main"]);
const failures = [];

async function get(path) {
  const response = await fetch(`${base}${path}`, { redirect: "follow" });
  return { response, body: await response.text() };
}

const manifestResult = await get("/deploy-manifest.json");
let manifest;
try { manifest = JSON.parse(manifestResult.body); }
catch { failures.push("deploy manifest is missing or invalid JSON"); }
if (!manifestResult.response.ok) failures.push(`/deploy-manifest.json: ${manifestResult.response.status}`);
if (manifest?.sourceCommit !== main) failures.push(`deployed source ${manifest?.sourceCommit || "unknown"} does not match origin/main ${main}`);
if (manifest?.schemaVersion !== 1) failures.push("unsupported deploy manifest schema");
if (!Number.isInteger(manifest?.articleCount) || manifest.articleCount < 1) failures.push("deploy manifest article count is invalid");
if (!Number.isInteger(manifest?.routeCount) || manifest.routeCount < 1) failures.push("deploy manifest route count is invalid");

const routes = ["/", "/writing/", "/writing/from-tokens-to-work/", "/writing/what-h1-h5-proved/", "/writing/smaller-core-strong-baselines/", "/writing/winning-move-loses-contest/", "/writing/creation-judgment-recoverable-systems/", "/projects/", "/research/", "/system/", "/now/"];
for (const path of routes) {
  const { response, body } = await get(path);
  if (!response.ok) failures.push(`${path}: ${response.status}`);
  if (!body.includes('rel="canonical"')) failures.push(`${path}: canonical link missing`);
  if (path.startsWith("/writing/") && path !== "/writing/") {
    if (!body.includes('application/ld+json')) failures.push(`${path}: Article JSON-LD missing`);
    const slug = path.split("/").filter(Boolean).at(-1);
    if (!body.includes(`/og/${slug}.png`)) failures.push(`${path}: article social image missing`);
  }
}
for (const path of ["/feed.xml", "/sitemap.xml", "/robots.txt", "/og/from-tokens-to-work.png"]) {
  const response = await fetch(`${base}${path}`);
  if (!response.ok) failures.push(`${path}: ${response.status}`);
}
const feed = await get("/feed.xml");
if (!feed.body.includes('<feed xmlns="http://www.w3.org/2005/Atom">')) failures.push("Atom feed root missing");
if (!feed.body.includes('rel="related"')) failures.push("Atom related evidence links missing");
const missing = await fetch(`${base}/this-page-does-not-exist/`);
if (missing.status !== 404) failures.push(`404 route returned ${missing.status}`);
console.log(JSON.stringify({ base, main, manifest, routes: routes.length, status: failures.length ? "failed" : "passed", failures }, null, 2));
process.exit(failures.length ? 1 : 0);
