import { load } from "cheerio";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const sourceRoot = path.resolve("legacy-v1/notes");
const outputPath = path.resolve("content/writing/articles.json");
const oldOrigin = "https://ordivon.com";

const routeMap = new Map([
  ["/", "/"],
  ["/notes/", "/writing"],
  ["/work/", "/projects"],
  ["/work/computing/", "/projects/computing"],
  ["/work/ordivon-host/", "/projects/host"],
  ["/work/ordivon-runtime/", "/projects/runtime"],
  ["/work/ordivon-link/", "/projects/link"],
  ["/work/ordivon-edge/", "/projects/edge"],
  ["/work/ordivon-web/", "/colophon"],
  ["/about/", "/about"],
  ["/contact/", "/about#contact"],
  ["/now/", "/now"],
]);

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72) || "section";
}

function mapPathname(pathname) {
  if (routeMap.has(pathname)) return routeMap.get(pathname);
  const note = pathname.match(/^\/notes\/([^/]+)\/?$/);
  if (note) return `/writing/${note[1]}`;
  return pathname;
}

function rewriteLinks($, slug) {
  const base = `${oldOrigin}/notes/${slug}/`;
  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");
    if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    if (href === "#main") {
      $(element).attr("href", "#top");
      return;
    }
    let url;
    try { url = new URL(href, base); } catch { return; }
    if (url.origin !== oldOrigin) return;
    const mapped = mapPathname(url.pathname);
    const current = `/writing/${slug}`;
    const normalized = mapped.replace(/\/$/, "") || "/";
    $(element).attr("href", normalized === current && url.hash ? url.hash : `${normalized}${url.hash}`);
  });
}

const entries = await readdir(sourceRoot, { withFileTypes: true });
const articles = [];
for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const slug = entry.name;
  const file = path.join(sourceRoot, slug, "index.html");
  let html;
  try { html = await readFile(file, "utf8"); } catch { continue; }
  const $ = load(html);
  const header = $(".article-header");
  if (!header.length) continue;

  const title = header.find("h1").first().text().trim();
  const kicker = header.find(".eyebrow").first().text().trim();
  const deck = header.find(".article-deck").first().text().trim();
  const meta = header.find(".note-meta").first().text().replace(/\s+/g, " ").trim();
  const description = $("meta[name=description]").attr("content")?.trim() || deck;
  const date = header.find("time").first().attr("datetime") || "2026-07-29";
  const parts = meta.split("·").map((part) => part.trim()).filter(Boolean);
  const type = parts[0] || "Note";
  const project = parts[1] || "Ordivon";
  const readTimePart = parts.find((part) => /min read/i.test(part)) || "6 min read";
  const readMinutes = Number.parseInt(readTimePart, 10) || 6;
  const authorPart = parts.find((part) => /^By /i.test(part)) || "By zycxfyh";
  const author = authorPart.replace(/^By\s+/i, "");

  const body = $(".article-body").first();
  const lead = body.find(".article-lead").first().text().replace(/\s+/g, " ").trim();
  body.find(".article-lead, .article-toc").remove();

  const used = new Set();
  body.find("h2").each((index, element) => {
    const heading = $(element);
    let id = heading.attr("id") || slugify(heading.text());
    const baseId = id;
    let suffix = 2;
    while (used.has(id)) id = `${baseId}-${suffix++}`;
    used.add(id);
    heading.attr("id", id);
  });

  rewriteLinks($, slug);
  const toc = body.find("h2").map((_, element) => ({
    id: $(element).attr("id"),
    label: $(element).text().replace(/\s+/g, " ").trim(),
  })).get();

  const related = $(".related-reading a").map((_, element) => ({
    href: $(element).attr("href") || "/writing",
    title: $(element).clone().children().remove().end().text().replace(/\s+/g, " ").trim(),
  })).get();
  const relatedHeading = $(".related-reading h2").first().text().replace(/\s+/g, " ").trim();

  articles.push({
    slug, title, kicker, deck, description, meta, type, project, date,
    readMinutes, author, lead, toc, bodyHtml: body.html()?.trim() || "",
    footerHtml: $(".article-footer").first().html()?.trim() || "",
    relatedHeading, related,
  });
}
articles.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(articles, null, 2)}\n`);
console.log(`Migrated ${articles.length} articles to ${path.relative(process.cwd(), outputPath)}`);
for (const article of articles) console.log(`${article.slug}: ${article.toc.length} sections, ${article.readMinutes} min`);
