import { chromium, devices } from "@playwright/test";
import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const outputRoot = path.resolve("artifacts/v1-baseline");
const screenshotRoot = path.join(outputRoot, "screenshots");
const routes = [
  ["home", "/"],
  ["projects", "/work/"],
  ["runtime", "/work/ordivon-runtime/"],
  ["article", "/notes/runtime-after-core/"],
  ["acceleration", "/notes/the-future-will-not-wait/"],
];
const modes = [
  ["desktop", { viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 }],
  ["mobile", { ...devices["Pixel 7"], locale: "en-US" }],
];

await rm(outputRoot, { recursive: true, force: true });
await mkdir(screenshotRoot, { recursive: true });
const browser = await chromium.launch({ headless: true });
const metrics = [];
try {
  for (const [mode, contextOptions] of modes) {
    const context = await browser.newContext(contextOptions);
    const page = await context.newPage();
    for (const [slug, route] of routes) {
      const response = await page.goto(`https://ordivon.com${route}`, { waitUntil: "networkidle" });
      if (!response || response.status() !== 200) throw new Error(`${route} returned ${response?.status()}`);
      const rendered = await page.evaluate(() => ({
        title: document.title,
        h1: document.querySelector("h1")?.textContent?.trim() ?? "",
        words: document.body.innerText.trim().split(/\s+/).filter(Boolean).length,
        scrollHeight: document.documentElement.scrollHeight,
        viewportHeight: window.innerHeight,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }));
      if (!rendered.title.includes("Ordivon") || !rendered.h1 || rendered.words < 100) {
        throw new Error(`Invalid production capture for ${route}: ${JSON.stringify(rendered)}`);
      }
      const screenshotPath = path.join(screenshotRoot, `${mode}-${slug}.jpg`);
      await page.screenshot({ path: screenshotPath, fullPage: true, type: "jpeg", quality: 80 });
      metrics.push({ mode, slug, path: route, ...rendered, screens: +(rendered.scrollHeight / rendered.viewportHeight).toFixed(1) });
    }
    await context.close();
  }
} finally {
  await browser.close();
}
await writeFile(path.join(outputRoot, "metrics.json"), `${JSON.stringify(metrics, null, 2)}\n`);
await writeFile(path.join(outputRoot, "source-commit.txt"), "7c7021796cb3cf4894809d1a3925451050d8a7e5\n");
const sums = [];
for (const metric of metrics) {
  const name = `${metric.mode}-${metric.slug}.jpg`;
  const bytes = await readFile(path.join(screenshotRoot, name));
  sums.push(`${createHash("sha256").update(bytes).digest("hex")}  screenshots/${name}`);
}
await writeFile(path.join(outputRoot, "SHA256SUMS"), `${sums.join("\n")}\n`);
for (const row of metrics) console.log(`${row.mode.padEnd(7)} ${row.slug.padEnd(8)} ${String(row.screens).padStart(4)} screens ${String(row.words).padStart(4)} words overflow=${row.overflow}`);
