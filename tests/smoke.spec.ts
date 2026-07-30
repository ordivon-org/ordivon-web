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
  const feed = await request.get("/feed.xml");
  expect(feed.status()).toBe(200);
  expect(feed.headers()["content-type"]).toMatch(/(?:application|text)\/xml/);
  expect(await feed.text()).toMatch(/<rss version="2\.0"><channel>/);
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

test("writing network reveals graph-derived argument context", async ({ page, isMobile }) => {
  await page.goto("/writing", { waitUntil: "domcontentloaded" });
  const network = page.locator(".writing-network");
  await expect(network).toHaveAttribute("data-ready", "true");
  await expect(network.getByText("19", { exact: true })).toBeVisible();

  const surface = isMobile ? page.locator(".writing-network-mobile") : page.locator(".writing-network-canvas");
  const hostArgument = surface.getByRole("button", { name: /Architecture report.*Why Task continuity belongs above execution/ });
  await hostArgument.click();
  await expect(page.getByLabel("Selected writing argument").getByRole("heading", { name: "Why Task continuity belongs above execution" })).toBeVisible();
  await expect(page.getByLabel("Selected writing argument").getByRole("link", { name: /Research Question.*Can Host complete a general repository Goal/ })).toHaveAttribute("href", "/research/host-general-repository-goal/");
  await expect(page.getByLabel("Selected writing argument").getByRole("link", { name: /Ordivon Runtime after the core/ })).toBeVisible();
});

test("article context is derived from typed document relations", async ({ page }) => {
  await page.goto("/writing/runtime-after-core", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "What this article documents in the research graph." })).toBeVisible();
  await expect(page.getByRole("link", { name: /question Which real structured operation can complete the full Effect contract/ })).toHaveAttribute("href", "/research/runtime-structured-effect/");
  await expect(page.getByRole("heading", { name: "Commitment—not command execution—is Runtime's decisive abstraction" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Continue through shared research objects." })).toBeVisible();
  await expect(page.locator(".related-reading").getByRole("link", { name: /Why Task continuity belongs above execution/ })).toBeVisible();
});

test("homepage snapshot and features derive from the graph", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const snapshot = page.getByLabel("Current graph status");
  await expect(snapshot.getByText("4 independent system layers")).toBeVisible();
  await expect(snapshot.getByText("11 Questions · 6 currently under test")).toBeVisible();
  await expect(snapshot.getByText("19 typed document relations")).toBeVisible();
  await expect(page.getByText("Latest model change · Writing became an explorable argument network")).toBeVisible();
  await expect(page.locator(".current-feature").getByRole("link", { name: "Open the Question dossier ↗" })).toHaveAttribute("href", /\/research\/.+\//);
  await expect(page.getByRole("heading", { name: "Arguments are selected by connection, not recency alone." })).toBeVisible();
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
