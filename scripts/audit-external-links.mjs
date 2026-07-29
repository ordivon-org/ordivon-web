import { load } from "cheerio";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const output = "artifacts/v2-round3/external-links.json";
const timeoutMs = 15_000;
const concurrency = 4;
const restrictedStatuses = new Set([401, 403, 405, 406, 409, 418, 429, 451]);
const brokenStatuses = new Set([404, 410]);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function htmlFiles(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(full));
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

const links = new Map();
for (const file of await htmlFiles("out")) {
  const $ = load(await readFile(file, "utf8"));
  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");
    if (!href || !/^https?:\/\//i.test(href)) return;
    const url = new URL(href);
    if (url.hostname === "ordivon.com") return;
    url.hash = "";
    const key = url.toString();
    if (!links.has(key)) links.set(key, new Set());
    links.get(key).add(file.replace(/^out\//, "/"));
  });
}

async function fetchOnce(url, method) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method,
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "Ordivon-Link-Audit/1.0 (+https://ordivon.com)",
        ...(method === "GET" ? { range: "bytes=0-2047" } : {}),
      },
    });
    if (response.body) await response.body.cancel().catch(() => {});
    return { status: response.status, finalUrl: response.url, method, error: null };
  } catch (error) {
    return { status: null, finalUrl: null, method, error: error instanceof Error ? `${error.name}: ${error.message}` : String(error) };
  } finally {
    clearTimeout(timer);
  }
}

async function inspect(url) {
  const attempts = [];
  let result = await fetchOnce(url, "HEAD");
  attempts.push(result);
  if (result.error || result.status === 405 || result.status === 501 || (result.status !== null && result.status >= 500)) {
    await sleep(200);
    result = await fetchOnce(url, "GET");
    attempts.push(result);
  }
  if (result.error) {
    await sleep(500);
    const retry = await fetchOnce(url, "GET");
    attempts.push(retry);
    result = retry;
  }
  let classification;
  if (result.status !== null && result.status >= 200 && result.status < 400) classification = "ok";
  else if (result.status !== null && restrictedStatuses.has(result.status)) classification = "restricted";
  else if (result.status !== null && brokenStatuses.has(result.status)) classification = "broken";
  else if (result.status !== null && result.status >= 400 && result.status < 500) classification = "client-error";
  else if (result.status !== null && result.status >= 500) classification = "server-error";
  else classification = "unreachable";
  return { url, classification, status: result.status, finalUrl: result.finalUrl, error: result.error, attempts };
}

const queue = [...links.keys()].sort();
const results = [];
let cursor = 0;
async function worker() {
  while (cursor < queue.length) {
    const url = queue[cursor++];
    const result = await inspect(url);
    result.sources = [...links.get(url)].sort();
    results.push(result);
    console.log(`${result.classification.padEnd(12)} ${String(result.status ?? "-").padStart(3)} ${url}`);
  }
}
await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, () => worker()));
results.sort((a, b) => a.url.localeCompare(b.url));
const summary = results.reduce((acc, item) => { acc[item.classification] = (acc[item.classification] || 0) + 1; return acc; }, {});
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify({ generatedAt: new Date().toISOString(), total: results.length, summary, results }, null, 2)}\n`);
const hardFailures = results.filter((item) => ["broken", "client-error"].includes(item.classification));
if (hardFailures.length) throw new Error(`external link audit found ${hardFailures.length} hard failures: ${hardFailures.map((item) => `${item.status} ${item.url}`).join(", ")}`);
console.log(`external link audit completed: ${results.length} links, ${JSON.stringify(summary)}`);
