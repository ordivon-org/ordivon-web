import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import process from "node:process";

import { verifyPromotionTag } from "./verify-web-promotion-tag.mjs";

const repo = process.cwd();
const base = (process.env.SITE_BASE_URL || "https://ordivon.com").replace(/\/$/, "");
const run = (args) => execFileSync("git", args, { cwd: repo, encoding: "utf8" }).trim();
const sha256 = (value) => `sha256:${createHash("sha256").update(value).digest("hex")}`;
run(["fetch", "origin", "--tags", "--prune", "--quiet"]);
const failures = [];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchAudit(url, options = {}) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, options);
      if (response.status < 500 || attempt === 3) return response;
    } catch (error) {
      lastError = error;
      if (attempt === 3) throw error;
    }
    await sleep(250 * attempt);
  }
  throw lastError ?? new Error(`audit fetch failed without response: ${url}`);
}

async function get(path) {
  const response = await fetchAudit(`${base}${path}`, { redirect: "follow" });
  return { response, body: await response.text() };
}

function remotePromotionForSource(sourceRevision) {
  if (!/^[0-9a-f]{40,64}$/.test(sourceRevision || "")) return null;
  const tags = run(["tag", "--points-at", sourceRevision, "--list", "web-promotion-*"]).split("\n").filter(Boolean);
  for (const tagName of tags) {
    try {
      const verification = verifyPromotionTag(tagName, { cwd: repo, requireHeadMatch: false });
      if (verification.sourceRevision !== sourceRevision) continue;
      const remote = run(["ls-remote", "--tags", "--refs", "origin", `refs/tags/${tagName}`]);
      if (!remote) continue;
      const [remoteObject, remoteRef] = remote.split(/\s+/, 2);
      if (remoteRef !== `refs/tags/${tagName}` || remoteObject !== verification.tagObject) continue;
      return verification;
    } catch {
      // Ignore malformed or locally unrelated tags and keep searching for one exact remote admission.
    }
  }
  return null;
}

const manifestResult = await get("/deploy-manifest.json");
let manifest;
try { manifest = JSON.parse(manifestResult.body); }
catch { failures.push("deploy manifest is missing or invalid JSON"); }
if (!manifestResult.response.ok) failures.push(`/deploy-manifest.json: ${manifestResult.response.status}`);
if (manifest?.schemaVersion !== 1) failures.push("unsupported deploy manifest schema");
if (!Number.isInteger(manifest?.articleCount) || manifest.articleCount < 1) failures.push("deploy manifest article count is invalid");
if (!Number.isInteger(manifest?.routeCount) || manifest.routeCount < 1) failures.push("deploy manifest route count is invalid");

const promotion = remotePromotionForSource(manifest?.sourceCommit);
if (!promotion) {
  failures.push(`deployed source ${manifest?.sourceCommit || "unknown"} is not backed by an exact remote web-promotion admission tag`);
} else {
  const verification = promotion.receipt.verification;
  const liveManifestDigest = sha256(manifestResult.body);
  if (verification.deployManifestDigest !== liveManifestDigest) failures.push(`live deploy manifest digest ${liveManifestDigest} differs from promotion receipt ${verification.deployManifestDigest}`);
  if (verification.articleCount !== manifest.articleCount) failures.push(`live article count ${manifest.articleCount} differs from promotion receipt ${verification.articleCount}`);
  if (verification.routeCount !== manifest.routeCount) failures.push(`live route count ${manifest.routeCount} differs from promotion receipt ${verification.routeCount}`);
}

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
  const response = await fetchAudit(`${base}${path}`);
  if (!response.ok) failures.push(`${path}: ${response.status}`);
}
const feed = await get("/feed.xml");
if (!feed.body.includes('<feed xmlns="http://www.w3.org/2005/Atom">')) failures.push("Atom feed root missing");
if (!feed.body.includes('rel="related"')) failures.push("Atom related evidence links missing");
const missing = await fetchAudit(`${base}/this-page-does-not-exist/`);
if (missing.status !== 404) failures.push(`404 route returned ${missing.status}`);
console.log(JSON.stringify({
  base,
  manifest,
  promotion: promotion ? { tagName: promotion.tagName, sourceRevision: promotion.sourceRevision, receiptDigest: promotion.receiptDigest } : null,
  routes: routes.length,
  status: failures.length ? "failed" : "passed",
  failures,
}, null, 2));
process.exit(failures.length ? 1 : 0);
