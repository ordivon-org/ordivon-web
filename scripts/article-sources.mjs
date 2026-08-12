import { readdir, readFile } from "node:fs/promises";
import { basename, join } from "node:path";

const ROOT = process.cwd();
export const ARTICLE_DIRECTORY = join(ROOT, "content", "articles");
const METADATA_PREFIX = "export const metadata = ";
const TECHNICAL_READING_WPM = 180;
const HERO_CODE_PATTERN = /\b[A-Z]{1,4}\d+(?:[a-z])?(?:\.\d+)?(?:-[A-Z])?(?:[–-](?:[A-Z]{1,4})?\d+(?:[a-z])?(?:\.\d+)?)?\b/g;

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

function metadataBounds(source, file) {
  const start = source.indexOf(METADATA_PREFIX);
  if (start < 0) throw new Error(`${file} does not export metadata`);
  const jsonStart = start + METADATA_PREFIX.length;
  const end = source.indexOf(";\n", jsonStart);
  if (end < 0) throw new Error(`${file} metadata export is not terminated`);
  return { jsonStart, end };
}

function parseMetadata(source, file) {
  const { jsonStart, end } = metadataBounds(source, file);
  try {
    return JSON.parse(source.slice(jsonStart, end));
  } catch (error) {
    throw new Error(`${file} metadata is not JSON: ${error.message}`);
  }
}

function estimateReadMinutes(source, file) {
  const { end } = metadataBounds(source, file);
  const visible = source.slice(end + 2)
    .replace(/<[^>]+>/g, " ")
    .replace(/\{[^{}]*\}/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[`*_>#|\[\]()~-]/g, " ");
  const words = decodeText(visible).match(/[A-Za-z0-9][A-Za-z0-9'’.-]*/g)?.length || 0;
  return Math.max(2, Math.ceil(words / TECHNICAL_READING_WPM));
}

function heroCodes(metadata) {
  const text = [metadata.title, metadata.deck, metadata.description, metadata.lead].filter(Boolean).join(" ");
  return [...new Set((text.match(HERO_CODE_PATTERN) || []).filter((code) => !/^E[0-5]$/.test(code)))];
}

function validateReaderCodes(metadata, file) {
  const used = heroCodes(metadata);
  if (!used.length) return;
  const declared = new Set((metadata.readerCodes || []).flatMap((entry) => (entry.code.match(HERO_CODE_PATTERN) || []).filter((code) => !/^E[0-5]$/.test(code))));
  const missing = used.filter((code) => !declared.has(code));
  if (missing.length) throw new Error(`${file} uses first-screen round code(s) ${missing.join(", ")} without readerCodes definitions`);
  for (const entry of metadata.readerCodes || []) {
    if (!entry.code?.trim() || !entry.meaning?.trim()) throw new Error(`${file} contains an empty readerCodes definition`);
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
    const estimatedReadMinutes = estimateReadMinutes(source, file);
    if (metadata.readMinutes !== estimatedReadMinutes) throw new Error(`${file} readMinutes=${metadata.readMinutes}; expected ${estimatedReadMinutes} from the shared ${TECHNICAL_READING_WPM} WPM publication rule`);
    validateReaderCodes(metadata, file);
    articles.push({ file, metadata: { ...metadata, toc: parseToc(source, file) } });
  }
  return articles.sort((left, right) =>
    right.metadata.publishedAt.localeCompare(left.metadata.publishedAt) || left.metadata.slug.localeCompare(right.metadata.slug)
  );
}
