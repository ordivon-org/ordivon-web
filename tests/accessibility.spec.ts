import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function analyzeStablePage(page: Page, route: string) {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toBeVisible();
    try {
      return await new AxeBuilder({ page }).analyze();
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : String(error);
      if (!/Execution context was destroyed|navigation/i.test(message) || attempt === 2) throw error;
      await page.waitForTimeout(250);
    }
  }
  throw lastError;
}

for (const route of ["/", "/projects", "/writing", "/writing/the-future-will-not-wait", "/projects/runtime", "/about"]) {
  test(`${route} has no serious accessibility violations`, async ({ page }) => {
    const results = await analyzeStablePage(page, route);
    const serious = results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""));
    expect(serious).toEqual([]);
  });
}
