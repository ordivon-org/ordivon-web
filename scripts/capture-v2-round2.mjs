import { chromium, devices } from "@playwright/test";
import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("artifacts/v2-round2");
const shots = path.join(root, "screenshots");
const previews = path.join(root, "previews");
const baseURL = process.env.BASE_URL || "http://127.0.0.1:3100";
const routes = [
  ["home", "/"],
  ["projects", "/projects"],
  ["runtime", "/projects/runtime"],
  ["writing", "/writing"],
  ["article", "/writing/the-future-will-not-wait"],
];
const modes = [
  ["desktop", { viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 }],
  ["mobile", { ...devices["Pixel 7"], locale: "en-US" }],
];
await rm(root, { recursive: true, force: true });
await mkdir(shots, { recursive: true });
await mkdir(previews, { recursive: true });
const browser = await chromium.launch({ headless: true });
const metrics = [];
try {
  for (const [mode, options] of modes) {
    const context = await browser.newContext(options);
    const page = await context.newPage();
    for (const [slug, route] of routes) {
      const response = await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle" });
      if (!response || response.status() !== 200) throw new Error(`${route}: ${response?.status()}`);
      const values = await page.evaluate(() => {
        const h1 = document.querySelector("h1");
        const style = h1 ? getComputedStyle(h1) : null;
        return {
          title: document.title,
          h1: h1?.textContent?.trim() || "",
          h1Height: h1?.getBoundingClientRect().height || 0,
          h1FontSize: style?.fontSize || "",
          scrollHeight: document.documentElement.scrollHeight,
          viewportHeight: innerHeight,
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          words: document.body.innerText.trim().split(/\s+/).filter(Boolean).length,
        };
      });
      const file = `${mode}-${slug}.jpg`;
      const previewFile = `${mode}-${slug}.jpg`;
      const preview = await page.screenshot({ fullPage: false, type: "jpeg", quality: 86 });
      if (preview.length < 10_000) throw new Error(`${route}: invalid preview screenshot (${preview.length} bytes)`);
      await writeFile(path.join(previews, previewFile), preview);
      let full = await page.screenshot({ fullPage: true, type: "jpeg", quality: 82 });
      if (full.length < 10_000) {
        const pngFile = `${mode}-${slug}.png`;
        full = await page.screenshot({ fullPage: true, type: "png" });
        if (full.length < 10_000) throw new Error(`${route}: invalid full screenshot (${full.length} bytes)`);
        await writeFile(path.join(shots, pngFile), full);
        metrics.push({ mode, slug, route, screenshot: `screenshots/${pngFile}`, preview: `previews/${previewFile}`, ...values, screens: +(values.scrollHeight / values.viewportHeight).toFixed(1), overflow: values.scrollWidth - values.clientWidth });
        continue;
      }
      await writeFile(path.join(shots, file), full);
      metrics.push({ mode, slug, route, screenshot: `screenshots/${file}`, preview: `previews/${previewFile}`, ...values, screens: +(values.scrollHeight / values.viewportHeight).toFixed(1), overflow: values.scrollWidth - values.clientWidth });
    }
    await context.close();
  }
} finally { await browser.close(); }
await writeFile(path.join(root, "metrics.json"), `${JSON.stringify(metrics, null, 2)}\n`);
const hashes = [];
for (const metric of metrics) {
  for (const relative of [metric.screenshot, metric.preview]) {
    const bytes = await readFile(path.join(root, relative));
    if (bytes.length < 10_000) throw new Error(`${relative}: invalid artifact (${bytes.length} bytes)`);
    hashes.push(`${createHash("sha256").update(bytes).digest("hex")}  ${relative}`);
  }
}
await writeFile(path.join(root, "SHA256SUMS"), `${hashes.join("\n")}\n`);
for (const row of metrics) console.log(`${row.mode.padEnd(7)} ${row.slug.padEnd(8)} ${String(row.screens).padStart(5)} screens ${String(row.words).padStart(4)} words h1=${row.h1FontSize}/${Math.round(row.h1Height)}px overflow=${row.overflow}`);
