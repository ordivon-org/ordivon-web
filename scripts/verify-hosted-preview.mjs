import { load } from "cheerio";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const base = (process.env.HOSTED_PREVIEW_URL || "").replace(/\/$/, "");
if (!base) throw new Error("HOSTED_PREVIEW_URL is required");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function waitReady() {
  for (let i = 0; i < 60; i += 1) {
    try { if ((await fetch(base)).status === 200) return; } catch {}
    await sleep(500);
  }
  throw new Error(`${base} did not become ready`);
}
async function request(route, init = {}) { return fetch(`${base}${route}`, { redirect: "manual", ...init }); }
function assert(value, message) { if (!value) throw new Error(message); }
function canonicalPath(route) { return route === "/" ? "/" : route.replace(/\/$/, ""); }

await waitReady();
const report = { generatedAt: new Date().toISOString(), base, provider: "Cloudflare Workers Static Assets", routes: [], redirects: [], assets: [], edge: {} };
const sitemapResponse = await request("/sitemap.xml");
assert(sitemapResponse.status === 200, `sitemap ${sitemapResponse.status}`);
const sitemapText = await sitemapResponse.text();
const sitemapRoutes = [...sitemapText.matchAll(/<loc>https:\/\/ordivon\.com([^<]*)<\/loc>/g)].map((m) => m[1] || "/");
assert(sitemapRoutes.length === 17, `expected 17 sitemap routes, got ${sitemapRoutes.length}`);
const internalTargets = new Set();
const staticAssets = new Set();

for (const route of sitemapRoutes) {
  const response = await request(route);
  const type = response.headers.get("content-type") || "";
  assert(response.status === 200, `${route}: ${response.status}`);
  assert(type.includes("text/html"), `${route}: ${type}`);
  assert((response.headers.get("server") || "").toLowerCase().includes("cloudflare"), `${route}: not Cloudflare`);
  assert(response.headers.get("cf-ray"), `${route}: missing cf-ray`);
  const html = await response.text();
  const $ = load(html);
  const title = $("title").text().trim();
  const description = $('meta[name="description"]').attr("content")?.trim() || "";
  const canonical = $('link[rel="canonical"]').attr("href") || "";
  const h1 = $("h1");
  const ids = $("[id]").map((_, el) => $(el).attr("id")).get().filter(Boolean);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert(title.includes("Ordivon"), `${route}: title`);
  assert(description.length >= 40, `${route}: description`);
  const canonicalUrl = new URL(canonical);
  assert(canonicalUrl.origin === "https://ordivon.com" && canonicalUrl.pathname === canonicalPath(route), `${route}: canonical ${canonical}`);
  assert(h1.length === 1, `${route}: h1 count ${h1.length}`);
  assert(duplicates.length === 0, `${route}: duplicate ids`);
  assert($("html").attr("lang") === "en", `${route}: lang`);
  assert($('meta[property="og:image"]').attr("content") === "https://ordivon.com/opengraph-image.png", `${route}: og image`);
  assert($('meta[name="twitter:card"]').attr("content") === "summary_large_image", `${route}: twitter card`);
  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");
    if (!href || href.startsWith("mailto:") || /^https?:\/\//.test(href)) return;
    const url = new URL(href, `${base}${canonicalPath(route)}`);
    internalTargets.add(`${url.pathname}${url.search}`);
    if (url.hash && url.pathname === canonicalPath(route)) assert(ids.includes(url.hash.slice(1)), `${route}: missing anchor ${url.hash}`);
  });
  $("script[src],link[rel=stylesheet][href]").each((_, element) => {
    const href = $(element).attr("src") || $(element).attr("href");
    if (href?.startsWith("/")) staticAssets.add(href);
  });
  if (route.startsWith("/writing/")) {
    const schema = $('script[type="application/ld+json"]').text();
    assert(schema && JSON.parse(schema)["@type"] === "Article", `${route}: Article JSON-LD`);
  }
  report.routes.push({ route, status: response.status, title, canonical, cacheControl: response.headers.get("cache-control"), cfRay: response.headers.get("cf-ray") });
}

for (const target of [...internalTargets].sort()) {
  if (target === "/feed.xml") continue;
  const response = await request(target);
  assert(response.status < 400, `internal target ${target}: ${response.status}`);
}
const feed = await request("/feed.xml");
assert(feed.status === 200 && (feed.headers.get("content-type") || "").includes("application/rss+xml"), "feed endpoint");
assert(((await feed.text()).match(/<item>/g) || []).length === 6, "feed item count");
const robots = await request("/robots.txt");
const robotsText = await robots.text();
assert(robotsText.includes("Disallow: /preview-mdx") && robotsText.includes("https://ordivon.com/sitemap.xml"), "robots policy");
const health = await request("/api/health");
assert(health.status === 200, "health status");
const healthJson = await health.json();
assert(healthJson.ok && healthJson.runtime === "static-export", "health payload");
const og = await request("/opengraph-image.png");
assert(og.status === 200 && (og.headers.get("content-type") || "").includes("image/png"), "OG image");
assert((await og.arrayBuffer()).byteLength > 8_000, "OG image too small");

for (const asset of [...staticAssets].sort()) {
  const response = await request(asset);
  const cache = response.headers.get("cache-control") || "";
  assert(response.status === 200, `${asset}: ${response.status}`);
  assert(cache.includes("31536000") && cache.includes("immutable"), `${asset}: cache ${cache}`);
  report.assets.push({ asset, status: response.status, cacheControl: cache });
}
const home = await request("/");
for (const name of ["x-content-type-options", "referrer-policy", "x-frame-options", "permissions-policy", "cross-origin-opener-policy", "content-security-policy"]) assert(home.headers.get(name), `missing ${name}`);
report.edge = { server: home.headers.get("server"), cfRay: home.headers.get("cf-ray"), cfCacheStatus: home.headers.get("cf-cache-status"), altSvc: home.headers.get("alt-svc") };

const redirectsText = await readFile("public/_redirects", "utf8");
for (const line of redirectsText.split(/\r?\n/).map((x) => x.trim()).filter(Boolean)) {
  const [source, destination, code] = line.split(/\s+/);
  const response = await request(source);
  assert(response.status === Number(code), `${source}: redirect ${response.status}`);
  assert(response.headers.get("location") === destination, `${source}: location`);
  report.redirects.push({ source, destination, status: response.status });
}
const missing = await request("/definitely-not-a-route");
assert(missing.status === 404 && (missing.headers.get("content-type") || "").includes("text/html"), "custom 404");

await mkdir("artifacts/v2-round3", { recursive: true });
await writeFile("artifacts/v2-round3/hosted-platform.json", `${JSON.stringify(report, null, 2)}\n`);
console.log(`hosted preview verified: ${report.routes.length} routes, ${report.redirects.length} redirects, ${report.assets.length} immutable assets at ${base}`);
