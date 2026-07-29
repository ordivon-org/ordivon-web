import { expect, test } from "@playwright/test";

const routes = ["/", "/projects", "/projects/runtime", "/writing", "/writing/the-future-will-not-wait", "/about"];

for (const route of routes) {
  test(`${route} renders cleanly`, async ({ page }) => {
    const consoleErrors: string[] = [];
    const requestFailures: string[] = [];
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
    page.on("requestfailed", (request) => {
      const error = request.failure()?.errorText || "";
      const url = new URL(request.url());
      const benignPrefetchAbort = request.method() === "HEAD" && url.origin === "http://127.0.0.1:8788" && /ERR_ABORTED|NS_BINDING_ABORTED/i.test(error);
      if (!benignPrefetchAbort) requestFailures.push(`${request.method()} ${request.url()} ${error}`);
    });
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    await page.waitForTimeout(250);
    const geometry = await page.locator("html").evaluate((element) => ({ scrollWidth: element.scrollWidth, clientWidth: element.clientWidth }));
    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth);
    expect(consoleErrors).toEqual([]);
    expect(requestFailures).toEqual([]);
  });
}

test("writing filter remains interactive", async ({ page }) => {
  await page.goto("/writing", { waitUntil: "domcontentloaded" });
  const allRows = await page.locator(".writing-row").count();
  expect(allRows).toBe(6);
  const reportButton = page.getByRole("button", { name: /Engineering report/i });
  if (await reportButton.count()) {
    await expect(reportButton).toBeEnabled();
    await reportButton.click();
    await expect(reportButton).toHaveClass(/active/);
    await expect(page.locator(".writing-row")).toHaveCount(1);
  }
});

test("article navigation and anchors work", async ({ page, isMobile }) => {
  await page.goto("/writing/the-future-will-not-wait", { waitUntil: "domcontentloaded" });
  if (isMobile) {
    const toc = page.locator(".article-toc-mobile");
    await expect(toc).toBeVisible();
    await toc.locator("summary").click();
    const first = toc.locator("a").first();
    const href = await first.getAttribute("href");
    await first.click();
    expect(new URL(page.url()).hash).toBe(href);
  } else {
    const toc = page.locator(".article-rail");
    await expect(toc).toBeVisible();
    const first = toc.locator("a").first();
    const href = await first.getAttribute("href");
    await first.click();
    expect(new URL(page.url()).hash).toBe(href);
  }
});

test("legacy route redirects permanently", async ({ request }) => {
  const response = await request.get("/notes/runtime-after-core", { maxRedirects: 0 });
  expect(response.status()).toBe(301);
  expect(response.headers().location).toBe("/writing/runtime-after-core");
});
