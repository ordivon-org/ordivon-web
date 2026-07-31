import { readdir, readFile } from "node:fs/promises";
import { basename, join } from "node:path";

const ROOT = process.cwd();
export const ARTICLE_DIRECTORY = join(ROOT, "content", "articles");
const METADATA_PREFIX = "export const metadata = ";

function decodeText(value) {
  return value
    .replace(/<[^>]+>/g, "")
    .replaceAll("&apos;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replace(/\s+/g, " ")
    .trim();
}

function parseMetadata(source, file) {
  const start = source.indexOf(METADATA_PREFIX);
  if (start < 0) throw new Error(`${file} does not export metadata`);
  const jsonStart = start + METADATA_PREFIX.length;
  const end = source.indexOf(";\n", jsonStart);
  if (end < 0) throw new Error(`${file} metadata export is not terminated`);
  try {
    return JSON.parse(source.slice(jsonStart, end));
  } catch (error) {
    throw new Error(`${file} metadata is not JSON: ${error.message}`);
  }
}

function parseToc(source, file) {
  const entries = [];
  const expression = /<h2\s+id="([^"]+)"(?:\s+data-toc="([^"]+)")?[^>]*>([\s\S]*?)<\/h2>/g;
  for (const match of source.matchAll(expression)) {
    entries.push({ id: match[1], label: decodeText(match[2] || match[3]) });
  }
  const ids = entries.map((entry) => entry.id);
  if (ids.length !== new Set(ids).size) throw new Error(`${file} contains duplicate h2 ids`);
  return entries;
}

export async function readArticleSources() {
  const files = (await readdir(ARTICLE_DIRECTORY)).filter((file) => file.endsWith(".mdx")).sort();
  const articles = [];
  for (const file of files) {
    const source = await readFile(join(ARTICLE_DIRECTORY, file), "utf8");
    const metadata = parseMetadata(source, file);
    const expectedSlug = basename(file, ".mdx");
    if (metadata.slug !== expectedSlug) throw new Error(`${file} exports slug ${metadata.slug}; expected ${expectedSlug}`);
    articles.push({ file, metadata: { ...metadata, toc: parseToc(source, file) } });
  }
  return articles.sort((left, right) =>
    right.metadata.publishedAt.localeCompare(left.metadata.publishedAt) || left.metadata.slug.localeCompare(right.metadata.slug)
  );
}
