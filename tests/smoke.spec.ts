import { expect, test } from "@playwright/test";

for (const route of ["/", "/projects", "/writing", "/preview-mdx"]) {
  test(`${route} renders without overflow`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    await expect.poll(async () => {
      try {
        return await page.locator("html").evaluate(
          (element) => element.scrollWidth <= element.clientWidth
        );
      } catch {
        return false;
      }
    }).toBe(true);
  });
}

test("dynamic health route executes", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.status()).toBe(200);
  expect((await response.json()).ok).toBe(true);
});

test("legacy routes redirect", async ({ request }) => {
  const response = await request.get("/work", { maxRedirects: 0 });
  expect([307, 308]).toContain(response.status());
  expect(response.headers().location).toContain("/projects");
});
