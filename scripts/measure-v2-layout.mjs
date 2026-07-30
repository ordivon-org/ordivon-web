import { chromium, devices } from "@playwright/test";
const base = process.env.BASE_URL || "http://127.0.0.1:3100";
const cases = [
  ["desktop-home", "/", { viewport: { width: 1440, height: 1000 } }],
  ["mobile-home", "/", { ...devices["Pixel 7"] }],
  ["desktop-article", "/writing/the-future-will-not-wait", { viewport: { width: 1440, height: 1000 } }],
  ["mobile-article", "/writing/the-future-will-not-wait", { ...devices["Pixel 7"] }],
];
const browser = await chromium.launch({ headless: true });
try {
  for (const [name, route, options] of cases) {
    const context = await browser.newContext(options);
    const page = await context.newPage();
    await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
    const data = await page.evaluate(() => {
      const box = (selector) => {
        const element = [...document.querySelectorAll(selector)].find((candidate) => {
          const style = getComputedStyle(candidate);
          const rect = candidate.getBoundingClientRect();
          return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
        });
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return { top: Math.round(rect.top + scrollY), width: Math.round(rect.width), height: Math.round(rect.height), fontSize: style.fontSize, lineHeight: style.lineHeight };
      };
      return {
        viewport: [innerWidth, innerHeight],
        documentHeight: document.documentElement.scrollHeight,
        header: box(".site-header"),
        h1: box("h1"),
        lede: box(".hero-lede, .article-deck"),
        firstFollowingSection: box(".map-section, .article-layout"),
        articleColumn: box(".article-column"),
        articleBody: box(".article-body"),
        toc: box(".article-rail, .article-toc-mobile"),
      };
    });
    console.log(name, JSON.stringify(data));
    await context.close();
  }
} finally { await browser.close(); }
