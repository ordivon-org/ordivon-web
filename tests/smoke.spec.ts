import AxeBuilder from "@axe-core/playwright";
import { articleMetadata } from "../content/articles/registry";
import { questionNodes } from "../content/graph/nodes";
import { expect, test } from "@playwright/test";

const coreRoutes = [
  "/", "/system", "/research", "/research/web-research-interface", "/research/security-adversarial-trajectory",
  "/projects", "/projects/computing", "/projects/host", "/projects/runtime", "/projects/world",
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
  for (const { slug } of articleMetadata) {
    const response = await request.get(`/writing/${slug}`);
    expect(response.status(), slug).toBe(200);
  }
});

test("all research dossiers render", async ({ request }) => {
  for (const { slug } of questionNodes) {
    const response = await request.get(`/research/${slug}`);
    expect(response.status(), slug).toBe(200);
  }
});

test("publishing endpoints render", async ({ request }) => {
  expect((await request.get("/feed.xml")).headers()["content-type"]).toContain("application/rss+xml");
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  expect((await request.get("/opengraph-image.png")).headers()["content-type"]).toContain("image/png");
});

test("internal navigation targets resolve", async ({ page, request }) => {
  const sourceRoutes = [
    "/", "/system", "/research", "/research/web-research-interface", "/projects", "/writing", "/about", "/now",
    "/projects/runtime", "/writing/the-future-will-not-wait",
  ];
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

test("research graph drives current, project, and dossier views", async ({ page }) => {
  await page.goto("/now", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Research questions became durable public dossiers" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Can the public site expose Ordivon as a changing research graph/ })).toHaveAttribute("href", "/research/web-research-interface/");

  await page.goto("/projects/runtime", { waitUntil: "domcontentloaded" });
  const runtimeQuestion = page.getByRole("link", { name: /testing Which real structured operation can complete the full Effect contract/ });
  await expect(runtimeQuestion).toHaveAttribute("href", "/research/runtime-structured-effect/");

  await page.goto("/research/web-research-interface", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Web governance displacement audit", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Return Web release checks to build, smoke, preview, and deploy", exact: true })).toBeVisible();

  await page.goto("/research/security-adversarial-trajectory", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "No experiment has earned entry into this dossier yet." })).toBeVisible();
});

test("system explorer switches perspective and inspects typed nodes", async ({ page }) => {
  await page.goto("/system", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".system-explorer")).toHaveAttribute("data-ready", "true");
  await expect(page.getByRole("button", { name: "Structure State ownership" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel("Selected graph node").getByRole("heading", { name: "Host", exact: true })).toBeVisible();
  const hostRepository = page.getByRole("button", { name: /Host repository.*Ordivon Host/ });
  await hostRepository.focus();
  await expect(page.getByLabel("Selected graph node").getByRole("heading", { name: "Ordivon Host" })).toBeVisible();
  await hostRepository.press("Enter");
  await expect(hostRepository).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Research Judgment trajectory" }).click();
  await expect(page.getByRole("button", { name: /Web question.*Can the public site expose Ordivon/ })).toBeVisible();
  await page.getByRole("button", { name: /Finding.*Release governance had become larger/ }).first().click();
  await expect(page.getByLabel("Selected graph node").getByRole("heading", { name: "Release governance had become larger than the Web interface it protected" })).toBeVisible();

  await page.getByRole("button", { name: "Execution Effect path" }).click();
  await expect(page.getByRole("button", { name: /Runtime.*Ordivon Runtime/ })).toBeVisible();
});

test("research atlas switches organization without changing its source", async ({ page }) => {
  await page.goto("/research", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".research-explorer")).toHaveAttribute("data-ready", "true");
  await expect(page.getByRole("button", { name: "Questions the active frontier" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("link", { name: /Can Host complete a general repository Goal/ })).toBeVisible();

  await page.getByRole("button", { name: "Projects where pressure accumulates" }).click();
  await expect(page.locator('[data-view="projects"]')).toBeVisible();
  await expect(page.getByRole("heading", { name: "Ordivon Host", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Timeline what changed the model" }).click();
  await expect(page.locator('[data-view="timeline"]')).toBeVisible();
  await expect(page.getByRole("heading", { name: "Research questions became durable public dossiers" })).toBeVisible();

  await page.getByRole("button", { name: "Status testing, open, resolved" }).click();
  await expect(page.locator('[data-view="status"]')).toBeVisible();
  await expect(page.getByText("testing", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("open", { exact: true }).first()).toBeVisible();
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

test("core pages have no serious accessibility violations", async ({ page }) => {
  for (const route of ["/", "/system", "/research", "/research/web-research-interface", "/projects", "/writing", "/projects/runtime"]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""));
    expect(serious, route).toEqual([]);
  }
});
