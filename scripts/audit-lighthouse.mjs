import lighthouse from "lighthouse";
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import net from "node:net";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";

const previewPort = 8788;
const base = `http://127.0.0.1:${previewPort}`;
const server = spawn("pnpm", ["exec", "wrangler", "pages", "dev", "out", "--port", String(previewPort), "--compatibility-date", "2026-07-29"], { stdio: ["ignore", "pipe", "pipe"], detached: true });
let serverLog = "";
server.stdout.on("data", (chunk) => { serverLog += chunk; });
server.stderr.on("data", (chunk) => { serverLog += chunk; });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function waitReady() {
  for (let i = 0; i < 120; i += 1) {
    try { if ((await fetch(base)).status === 200) return; } catch {}
    await sleep(100);
  }
  throw new Error(`preview failed to start\n${serverLog}`);
}
function score(result, category) { return Math.round((result.lhr.categories[category]?.score || 0) * 100); }
function metric(result, id) { return result.lhr.audits[id]?.numericValue ?? null; }
function assert(value, message) { if (!value) throw new Error(message); }


async function getFreePort() {
  return new Promise((resolve, reject) => {
    const listener = net.createServer();
    listener.unref();
    listener.once("error", reject);
    listener.listen(0, "127.0.0.1", () => {
      const address = listener.address();
      const port = typeof address === "object" && address ? address.port : 0;
      listener.close((error) => error ? reject(error) : resolve(port));
    });
  });
}

async function launchChrome() {
  const port = await getFreePort();
  const profile = await mkdtemp("/tmp/olh-");
  const args = [
    "--headless=new",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "about:blank",
  ];
  const process = spawn(chromium.executablePath(), args, { stdio: ["ignore", "ignore", "pipe"], detached: true, env: { ...globalThis.process.env, TMPDIR: "/tmp" } });
  let stderr = "";
  process.stderr.on("data", (chunk) => { stderr += chunk; });
  for (let i = 0; i < 150; i += 1) {
    if (process.exitCode !== null) throw new Error(`Chrome exited before CDP was ready (${process.exitCode})\n${stderr}`);
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) {
        return {
          port,
          async kill() {
            try { globalThis.process.kill(-process.pid, "SIGTERM"); } catch {}
            await sleep(200);
            try { globalThis.process.kill(-process.pid, "SIGKILL"); } catch {}
            await rm(profile, { recursive: true, force: true });
          },
        };
      }
    } catch {}
    await sleep(100);
  }
  try { globalThis.process.kill(-process.pid, "SIGKILL"); } catch {}
  await rm(profile, { recursive: true, force: true });
  throw new Error(`Chrome CDP did not become ready on port ${port}\n${stderr}`);
}

const routes = [
  ["home", "/"],
  ["projects", "/projects"],
  ["runtime", "/projects/runtime"],
  ["writing", "/writing"],
  ["article", "/writing/the-future-will-not-wait"],
];
const modes = ["mobile", "desktop"];
const report = { generatedAt: new Date().toISOString(), environment: "wrangler-pages-dev", results: [] };
let chrome;
try {
  await waitReady();
  chrome = await launchChrome();
  for (const mode of modes) {
    for (const [slug, route] of routes) {
      const flags = {
        port: chrome.port,
        output: "json",
        logLevel: "error",
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
        throttlingMethod: "simulate",
        preset: mode === "desktop" ? "desktop" : undefined,
      };
      const result = await lighthouse(`${base}${route}`, flags);
      if (!result) throw new Error(`${mode} ${route}: no Lighthouse result`);
      const row = {
        mode, slug, route,
        scores: {
          performance: score(result, "performance"),
          accessibility: score(result, "accessibility"),
          bestPractices: score(result, "best-practices"),
          seo: score(result, "seo"),
        },
        metrics: {
          firstContentfulPaintMs: Math.round(metric(result, "first-contentful-paint") || 0),
          largestContentfulPaintMs: Math.round(metric(result, "largest-contentful-paint") || 0),
          totalBlockingTimeMs: Math.round(metric(result, "total-blocking-time") || 0),
          cumulativeLayoutShift: +(metric(result, "cumulative-layout-shift") || 0).toFixed(4),
          speedIndexMs: Math.round(metric(result, "speed-index") || 0),
          interactiveMs: Math.round(metric(result, "interactive") || 0),
          totalByteWeight: Math.round(metric(result, "total-byte-weight") || 0),
          unusedJavaScriptBytes: Math.round(metric(result, "unused-javascript") || 0),
        },
      };
      report.results.push(row);
      const minPerformance = mode === "desktop" ? 90 : 85;
      assert(row.scores.performance >= minPerformance, `${mode} ${route}: performance ${row.scores.performance} < ${minPerformance}`);
      assert(row.scores.accessibility === 100, `${mode} ${route}: accessibility ${row.scores.accessibility}`);
      assert(row.scores.bestPractices >= 95, `${mode} ${route}: best practices ${row.scores.bestPractices}`);
      assert(row.scores.seo === 100, `${mode} ${route}: SEO ${row.scores.seo}`);
      assert(row.metrics.largestContentfulPaintMs <= 2500, `${mode} ${route}: LCP ${row.metrics.largestContentfulPaintMs}`);
      assert(row.metrics.totalBlockingTimeMs <= 200, `${mode} ${route}: TBT ${row.metrics.totalBlockingTimeMs}`);
      assert(row.metrics.cumulativeLayoutShift <= 0.1, `${mode} ${route}: CLS ${row.metrics.cumulativeLayoutShift}`);
      assert(row.metrics.totalByteWeight <= 700_000, `${mode} ${route}: bytes ${row.metrics.totalByteWeight}`);
      console.log(`${mode.padEnd(7)} ${slug.padEnd(8)} P${row.scores.performance} A${row.scores.accessibility} B${row.scores.bestPractices} S${row.scores.seo} LCP=${row.metrics.largestContentfulPaintMs}ms TBT=${row.metrics.totalBlockingTimeMs}ms CLS=${row.metrics.cumulativeLayoutShift} bytes=${row.metrics.totalByteWeight}`);
    }
  }
  await mkdir("artifacts/v2-round3", { recursive: true });
  await writeFile("artifacts/v2-round3/lighthouse.json", `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Lighthouse budgets passed for ${report.results.length} audits`);
} finally {
  if (chrome) await chrome.kill();
  try { process.kill(-server.pid, "SIGTERM"); } catch {}
  await sleep(500);
}
