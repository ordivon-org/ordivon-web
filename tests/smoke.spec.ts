import { expect, test } from "@playwright/test";

const coreRoutes = [
  "/", "/projects", "/projects/computing", "/projects/host", "/projects/runtime", "/projects/link", "/projects/edge",
  "/writing", "/writing/the-future-will-not-wait", "/writing/runtime-after-core", "/now", "/about", "/colophon",
];

for (const route of coreRoutes) {
  test(`${route} renders without overflow`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    await expect.poll(async () => {
      try { return await page.locator("html").evaluate((element) => element.scrollWidth <= element.clientWidth); }
      catch { return false; }
    }).toBe(true);
  });
}

test("all migrated writing routes render", async ({ request }) => {
  for (const slug of ["the-future-will-not-wait", "runtime-after-core", "link-edge-boundary", "host-task-continuity", "ordivon-runtime-release", "why-ordivon"]) {
    const response = await request.get(`/writing/${slug}`);
    expect(response.status(), slug).toBe(200);
  }
});

test("publishing endpoints render", async ({ request }) => {
  expect((await request.get("/api/health")).status()).toBe(200);
  expect((await request.get("/feed.xml")).headers()["content-type"]).toContain("application/rss+xml");
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  expect((await request.get("/opengraph-image")).headers()["content-type"]).toContain("image/png");
});

test("legacy routes redirect to V2", async ({ request }) => {
  const expected = new Map([
    ["/work", "/projects"], ["/work/ordivon-runtime", "/projects/runtime"], ["/notes", "/writing"],
    ["/notes/the-future-will-not-wait", "/writing/the-future-will-not-wait"], ["/contact", "/about"],
  ]);
  for (const [route, destination] of expected) {
    const response = await request.get(route, { maxRedirects: 0 });
    expect([307, 308], route).toContain(response.status());
    expect(response.headers().location, route).toContain(destination);
  }
});

test("internal navigation targets resolve", async ({ page, request }) => {
  const sourceRoutes = ["/", "/projects", "/writing", "/about", "/now", "/projects/runtime", "/writing/the-future-will-not-wait"];
  const targets = new Set<string>();
  for (const route of sourceRoutes) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    for (const href of await page.locator('a[href^="/"]').evaluateAll((links) => links.map((link) => link.getAttribute("href") || ""))) {
      const pathname = href.split("#", 1)[0];
      if (pathname) targets.add(pathname);
    }
  }
  for (const target of [...targets].sort()) {
    const response = await request.get(target);
    expect(response.status(), target).toBeLessThan(400);
  }
});

test("article navigation matches viewport", async ({ page, isMobile }) => {
  await page.goto("/writing/the-future-will-not-wait", { waitUntil: "domcontentloaded" });
  if (isMobile) {
    await expect(page.locator(".article-toc-mobile")).toBeVisible();
    await expect(page.locator(".article-rail")).toBeHidden();
  } else {
    await expect(page.locator(".article-rail")).toBeVisible();
    await expect(page.locator(".article-toc-mobile")).toBeHidden();
  }
});
