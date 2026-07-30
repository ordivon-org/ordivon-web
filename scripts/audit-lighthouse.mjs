import lighthouse from "lighthouse";
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import net from "node:net";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";

const previewPort = 8788;
const hostedMode = process.env.LIGHTHOUSE_HOSTED === "1";
const externalBase = (process.env.HOSTED_BASE_URL || process.env.LIGHTHOUSE_BASE_URL || (hostedMode ? "https://ordivon-web-v2-preview.ordivon-lab.workers.dev" : ""))?.replace(/\/$/, "");
const base = externalBase || `http://127.0.0.1:${previewPort}`;
const server = externalBase ? null : spawn("pnpm", ["exec", "wrangler", "dev", "--port", String(previewPort)], { stdio: ["ignore", "pipe", "pipe"], detached: true });
let serverLog = "";
server?.stdout.on("data", (chunk) => { serverLog += chunk; });
server?.stderr.on("data", (chunk) => { serverLog += chunk; });
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
  const chromeProcess = spawn(chromium.executablePath(), args, { stdio: ["ignore", "ignore", "pipe"], detached: true, env: { ...process.env, TMPDIR: "/tmp" } });
  let stderr = "";
  chromeProcess.stderr.on("data", (chunk) => { stderr += chunk; });
  for (let i = 0; i < 150; i += 1) {
    if (chromeProcess.exitCode !== null) throw new Error(`Chrome exited before CDP was ready (${chromeProcess.exitCode})\n${stderr}`);
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) {
        return {
          port,
          async kill() {
            try { process.kill(-chromeProcess.pid, "SIGTERM"); } catch {}
            await sleep(200);
            try { process.kill(-chromeProcess.pid, "SIGKILL"); } catch {}
            await rm(profile, { recursive: true, force: true });
          },
        };
      }
    } catch {}
    await sleep(100);
  }
  try { process.kill(-chromeProcess.pid, "SIGKILL"); } catch {}
  await rm(profile, { recursive: true, force: true });
  throw new Error(`Chrome CDP did not become ready on port ${port}\n${stderr}`);
}

const routes = [
  ["home", "/"],
  ["projects", "/projects"],
  ["runtime", "/projects/runtime"],
  ["world", "/projects/world"],
  ["writing", "/writing"],
  ["article", "/writing/the-future-will-not-wait"],
];
const modes = ["mobile", "desktop"];
const runsPerAudit = 5;
const maxPassesPerAudit = 2;
const maxTransferBytes = externalBase ? 350_000 : 300_000;
const output = externalBase ? "artifacts/v2-round3/lighthouse-hosted.json" : "artifacts/v2-round3/lighthouse.json";
const report = {
  generatedAt: new Date().toISOString(),
  environment: externalBase ? `hosted:${externalBase}` : "wrangler-workers-static-assets",
  aggregation: "median-of-five",
  runsPerAudit,
  maxPassesPerAudit,
  confirmationPolicy: "one fresh-browser confirmation pass only when every failure is a timing-sensitive performance, LCP, or TBT budget",
  budgets: { maxTransferBytes },
  results: [],
};

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function extractResult(result, attempt) {
  return {
    attempt,
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
}

function aggregateAttempts(attempts) {
  const scoreKeys = Object.keys(attempts[0].scores);
  const metricKeys = Object.keys(attempts[0].metrics);
  return {
    scores: Object.fromEntries(scoreKeys.map((key) => [key, median(attempts.map((item) => item.scores[key]))])),
    metrics: Object.fromEntries(metricKeys.map((key) => [key, median(attempts.map((item) => item.metrics[key]))])),
  };
}

function budgetFailures(row, mode, route) {
  const minPerformance = mode === "desktop" ? 90 : 85;
  const failures = [];
  const add = (kind, retryable, condition, message) => { if (!condition) failures.push({ kind, retryable, message: `${mode} ${route}: ${message}` }); };
  add("performance", true, row.scores.performance >= minPerformance, `median performance ${row.scores.performance} < ${minPerformance}`);
  add("accessibility", false, row.scores.accessibility === 100, `median accessibility ${row.scores.accessibility}`);
  add("best-practices", false, row.scores.bestPractices >= 95, `median best practices ${row.scores.bestPractices}`);
  add("seo", false, row.scores.seo === 100, `median SEO ${row.scores.seo}`);
  add("lcp", true, row.metrics.largestContentfulPaintMs <= 2500, `median LCP ${row.metrics.largestContentfulPaintMs}`);
  add("tbt", true, row.metrics.totalBlockingTimeMs <= 200, `median TBT ${row.metrics.totalBlockingTimeMs}`);
  add("cls", false, row.metrics.cumulativeLayoutShift <= 0.1, `median CLS ${row.metrics.cumulativeLayoutShift}`);
  add("bytes", false, row.metrics.totalByteWeight <= maxTransferBytes, `median bytes ${row.metrics.totalByteWeight} > ${maxTransferBytes}`);
  return failures;
}

async function runPass(mode, slug, route, pass) {
  const chrome = await launchChrome();
  try {
    const flags = {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      throttlingMethod: "simulate",
      preset: mode === "desktop" ? "desktop" : undefined,
    };
    const attempts = [];
    for (let attempt = 1; attempt <= runsPerAudit; attempt += 1) {
      const result = await lighthouse(`${base}${route}`, flags);
      if (!result) throw new Error(`${mode} ${route} pass ${pass} attempt ${attempt}: no Lighthouse result`);
      attempts.push(extractResult(result, attempt));
    }
    const aggregate = aggregateAttempts(attempts);
    return {
      pass,
      runs: runsPerAudit,
      browserIsolation: "fresh-browser-per-pass",
      ...aggregate,
      attempts,
      failures: budgetFailures(aggregate, mode, route),
    };
  } finally {
    await chrome.kill();
  }
}

async function writeReport() {
  await mkdir("artifacts/v2-round3", { recursive: true });
  report.totalRuns = report.results.reduce((sum, row) => sum + row.passes.reduce((passSum, pass) => passSum + pass.runs, 0), 0);
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
}

function printPass(mode, slug, pass, suffix = "") {
  const tbtRuns = pass.attempts.map((item) => item.metrics.totalBlockingTimeMs).join("/");
  console.log(`${mode.padEnd(7)} ${slug.padEnd(8)} P${pass.scores.performance} A${pass.scores.accessibility} B${pass.scores.bestPractices} S${pass.scores.seo} LCP=${pass.metrics.largestContentfulPaintMs}ms TBT=${pass.metrics.totalBlockingTimeMs}ms [${tbtRuns}] CLS=${pass.metrics.cumulativeLayoutShift} bytes=${pass.metrics.totalByteWeight}${suffix}`);
}

try {
  await waitReady();
  for (const mode of modes) {
    for (const [slug, route] of routes) {
      const passes = [await runPass(mode, slug, route, 1)];
      printPass(mode, slug, passes[0]);
      const firstFailures = passes[0].failures;
      if (firstFailures.length && firstFailures.every((failure) => failure.retryable)) {
        console.warn(`confirmation pass required for ${mode} ${route}: ${firstFailures.map((failure) => failure.message).join("; ")}`);
        await sleep(1_000);
        passes.push(await runPass(mode, slug, route, 2));
        printPass(mode, slug, passes[1], " confirmation");
      }
      const accepted = passes.at(-1);
      const row = {
        mode,
        slug,
        route,
        runs: runsPerAudit,
        aggregation: "median",
        browserIsolation: "fresh-browser-per-pass",
        confirmationUsed: passes.length > 1,
        acceptedPass: accepted.pass,
        scores: accepted.scores,
        metrics: accepted.metrics,
        attempts: accepted.attempts,
        passes,
      };
      report.results.push(row);
      await writeReport();
      if (accepted.failures.length) {
        const history = passes.map((pass) => `pass ${pass.pass}: ${pass.failures.map((failure) => failure.message).join("; ") || "passed"}`).join(" | ");
        throw new Error(`Lighthouse budget failure after ${passes.length} pass(es): ${history}`);
      }
    }
  }
  await writeReport();
  console.log(`Lighthouse budgets passed for ${report.results.length} route/device audits (${report.totalRuns} total runs; ${runsPerAudit} baseline runs per audit; strict fresh-browser confirmation only for timing-sensitive failures)`);
} finally {
  if (server) {
    try { process.kill(-server.pid, "SIGTERM"); } catch {}
    await sleep(500);
  }
}
