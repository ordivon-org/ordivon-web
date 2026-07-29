import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const route of ["/", "/projects", "/writing", "/writing/the-future-will-not-wait", "/projects/runtime", "/about"]) {
  test(`${route} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""));
    expect(serious).toEqual([]);
  });
}
