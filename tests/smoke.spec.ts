import { expect, test } from "@playwright/test";
for (const route of ["/", "/projects", "/writing", "/preview-mdx"]) {
  test(`${route} renders without overflow`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    const width = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    expect(width.scroll).toBeLessThanOrEqual(width.client);
  });
}
test("dynamic health route executes", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  expect((await response.json()).ok).toBe(true);
});
test("legacy routes redirect", async ({ request }) => {
  const response = await request.get("/work/ordivon-runtime", { maxRedirects: 0 });
  expect([307, 308]).toContain(response.status());
  expect(response.headers().location).toContain("/projects/ordivon-runtime");
});
