import { execFileSync } from "node:child_process";
import process from "node:process";

const repo = process.cwd();
const base = (process.env.SITE_BASE_URL || "https://ordivon.com").replace(/\/$/, "");
const run = (args) => execFileSync("git", args, { cwd: repo, encoding: "utf8" }).trim();

run(["fetch", "origin", "main", "production/v1-pages", "--prune", "--quiet"]);
const main = run(["rev-parse", "origin/main"]);
const production = run(["rev-parse", "origin/production/v1-pages"]);
const subject = run(["log", "-1", "--format=%s", "origin/production/v1-pages"]);
const publishedSource = subject.match(/^deploy: publish ([0-9a-f]+)/)?.[1];
const failures = [];
if (!publishedSource || !main.startsWith(publishedSource)) failures.push(`production source ${publishedSource || "unknown"} does not match origin/main ${main}`);

const routes = [
  ["/", "Work should survive the intelligence that started it."],
  ["/writing/", "Ideas, experiments, and decisions behind durable agent work."],
  ["/writing/from-tokens-to-work/", "From Tokens to Work"],
  ["/writing/what-h1-h5-proved/", "What Survived When Codex and Hermes Replaced Each Other Mid-Task"],
  ["/writing/smaller-core-strong-baselines/", "The Smaller Core That Survived Strong Baselines"],
  ["/writing/winning-move-loses-contest/", "Winning the Move Can Lose the Contest"],
  ["/writing/creation-judgment-recoverable-systems/", "Creation, Judgment, and Recoverable Systems"],
  ["/projects/", "Four projects preserve different parts"],
  ["/research/", "Research here exists to change what we build."],
  ["/system/", "One task can outlive the model"],
  ["/now/", "What changed, what we learned"],
];

for (const [path, marker] of routes) {
  const response = await fetch(`${base}${path}`, { redirect: "follow" });
  const body = await response.text();
  if (!response.ok || !body.includes(marker)) failures.push(`${path}: expected 200 and marker ${marker}`);
  if (!body.includes('rel="canonical"')) failures.push(`${path}: canonical link missing`);
  if (path.startsWith("/writing/") && path !== "/writing/") {
    if (!body.includes('application/ld+json')) failures.push(`${path}: Article JSON-LD missing`);
    const slug = path.split("/").filter(Boolean).at(-1);
    if (!body.includes(`/og/${slug}.png`)) failures.push(`${path}: article social image missing from metadata`);
  }
}

for (const path of ["/feed.xml", "/sitemap.xml", "/robots.txt", "/og/from-tokens-to-work.png"]) {
  const response = await fetch(`${base}${path}`);
  if (!response.ok) failures.push(`${path}: ${response.status}`);
}

const missing = await fetch(`${base}/this-page-does-not-exist/`);
if (missing.status !== 404) failures.push(`404 route returned ${missing.status}`);

console.log(JSON.stringify({ base, main, production, publishedSource, routes: routes.length, status: failures.length ? "failed" : "passed", failures }, null, 2));
process.exit(failures.length ? 1 : 0);
