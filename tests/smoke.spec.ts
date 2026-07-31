import AxeBuilder from "@axe-core/playwright";
import { articleMetadata } from "../content/articles/registry";
import { questionNodes } from "../content/graph/nodes";
import { expect, test } from "@playwright/test";

const coreRoutes = [
  "/", "/system", "/research", "/research/web-research-interface", "/research/security-adversarial-trajectory",
  "/research/smallest-agent-native-core", "/research/harness-composition-and-completion",
  "/research/calibrated-non-action", "/research/opponent-state-transfer",
  "/projects", "/projects/computing", "/projects/host", "/projects/runtime", "/projects/world",
  "/writing", "/writing/winning-move-loses-contest", "/writing/smaller-core-strong-baselines", "/writing/the-future-will-not-wait", "/writing/runtime-after-core", "/now", "/about", "/colophon",
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
    "/projects/runtime", "/writing/winning-move-loses-contest", "/writing/smaller-core-strong-baselines", "/writing/the-future-will-not-wait",
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
  await expect(page.getByRole("heading", { name: "Strategic failure became visible across 84 adversarial Trials" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Strong-baseline evidence became a canonical public argument" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Harness H1–H3 established the current Host boundary" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Web V2 closed around one research graph and continuity thesis" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Strong baselines reduced the proposed Agent-native core" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Which Harness objects survive live provider replacement/ })).toHaveAttribute("href", "/research/harness-composition-and-completion/");

  await page.goto("/projects/runtime", { waitUntil: "domcontentloaded" });
  const runtimeQuestion = page.getByRole("link", { name: /testing Which real structured operation can complete the minimal Effect contract across a second backend/ });
  await expect(runtimeQuestion).toHaveAttribute("href", "/research/runtime-structured-effect/");

  await page.goto("/research/web-research-interface", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Web governance displacement audit", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Return Web release checks to build, smoke, preview, and deploy", exact: true })).toBeVisible();

  await page.goto("/research/security-adversarial-trajectory", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Security dynamic-opponent Round 1", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Tactical success can be strategically harmful", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Do not build a custom Ordivon cyber range", exact: true })).toBeVisible();

  await page.goto("/research/harness-composition-and-completion", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Codex App Server H3 live Harness run", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "A successful Harness process does not complete a Task", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Do not expand Runtime for Harness correlation", exact: true })).toBeVisible();
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
  await expect(network.getByText("8", { exact: true })).toBeVisible();
  await expect(network.getByText("32", { exact: true })).toBeVisible();
  await expect(network.getByText("41", { exact: true })).toBeVisible();

  const surface = isMobile ? page.locator(".writing-network-mobile") : page.locator(".writing-network-canvas");
  const securityArgument = surface.getByRole("button", { name: /Research report.*Winning the Move Can Lose the Contest/ });
  await securityArgument.click();
  const inspector = page.getByLabel("Selected writing argument");
  await expect(inspector.getByRole("heading", { name: "Winning the Move Can Lose the Contest" })).toBeVisible();
  await expect(inspector.getByRole("link", { name: /Research Question.*Can strategic adversarial trajectories be evaluated without collapsing them into one reward or success flag/ })).toHaveAttribute("href", "/research/security-adversarial-trajectory/");
  await expect(inspector.getByRole("link", { name: /Research Question.*Does compiled opponent state retain value across seeds/ })).toHaveAttribute("href", "/research/opponent-state-transfer/");
  await expect(inspector.getByRole("link", { name: /Project.*Ordivon Security/ })).toBeVisible();
});

test("flagship adversarial report preserves metric contradictions and negative results", async ({ page }) => {
  await page.goto("/writing/winning-move-loses-contest", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Winning the Move Can Lose the Contest" })).toBeVisible();
  const summary = page.locator(".security-round-summary");
  for (const value of ["84", "60", "20", "4"]) await expect(summary.getByText(value, { exact: true })).toBeVisible();
  await expect(page.locator(".outcome-divergence-rows article")).toHaveCount(3);
  await expect(page.locator(".article-data-table")).toHaveCount(3);
  await expect(page.getByText("Tactical success ≠ strategic success", { exact: true })).toBeVisible();
  await expect(page.getByText("Foothold spread ≠ mission outcome", { exact: true })).toBeVisible();
  await expect(page.getByText("Interpretation ≠ action value", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What the data does not establish" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "The next test is transfer under disruption" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Round 1 Full Experimental Report" })).toHaveAttribute("href", /8422165e83cc660e8190b07e78c472c7bff0fe59.*round1-full-experimental-report\.md/);
  await expect(page.locator(".article-anchor-grid > *")).toHaveCount(8);
  await expect(page.getByRole("link", { name: /question Can strategic adversarial trajectories be evaluated without collapsing them into one reward or success flag/ })).toHaveAttribute("href", "/research/security-adversarial-trajectory/");
  await expect(page.getByRole("heading", { name: "Do not build a custom Ordivon cyber range", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Do not promote Campaign or strategic state after Security Round 1", exact: true })).toBeVisible();
});

test("flagship strong-baseline report preserves evidence and claim boundaries", async ({ page }) => {
  await page.goto("/writing/smaller-core-strong-baselines", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "The Smaller Core That Survived Strong Baselines" })).toBeVisible();
  await expect(page.locator(".round1-summary").getByText("16", { exact: true })).toBeVisible();
  await expect(page.locator(".core-disposition-rows article")).toHaveCount(5);
  await expect(page.locator(".article-data-table")).toHaveCount(4);
  await expect(page.getByText("Provider-neutrality means the Task has an identity outside the Provider.", { exact: false })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What the numbers do not say" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Round 2 must attack the remaining boundary" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Core Work System Round 1: Strong-Baseline Experiment Report" })).toHaveAttribute("href", /ordivon-computing.*REPORT\.md/);
  await expect(page.locator(".article-anchor-grid > *")).toHaveCount(14);
  await expect(page.getByRole("link", { name: /question Which Agent-native responsibilities remain after strong classical baselines/ })).toHaveAttribute("href", "/research/smallest-agent-native-core/");
  await expect(page.getByRole("heading", { name: "Do not create a separate Ordivon Task Runtime", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Shrink Effect pending a second backend", exact: true })).toBeVisible();
});

test("article context is derived from typed document relations", async ({ page }) => {
  await page.goto("/writing/runtime-after-core", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "What this article documents in the research graph." })).toBeVisible();
  await expect(page.getByRole("link", { name: /question Which real structured operation can complete the minimal Effect contract across a second backend/ })).toHaveAttribute("href", "/research/runtime-structured-effect/");
  await expect(page.getByRole("heading", { name: "Commitment—not command execution—is Runtime's decisive abstraction" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Continue through shared research objects." })).toBeVisible();
  await expect(page.locator(".related-reading").getByRole("link", { name: /Why Task continuity belongs above execution/ })).toBeVisible();
});

test("homepage presents one continuous dark visual thesis", async ({ page, isMobile }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".home-poster-brand")).toHaveText("ORDIVON");
  await expect(page.getByRole("heading", { name: "Work should survive the intelligence that started it." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Task truth survived session loss, restart recovery, and model replacement." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Four owners. No shared fiction." })).toBeVisible();
  await expect(page.locator(".home-owner-row")).toHaveCount(4);
  await expect(page.locator(".home-frontier").getByRole("link", { name: /See the evidence and deletion condition/ })).toHaveAttribute("href", /\/research\/.+\//);
  await expect(page.locator(".home-writing-row")).toHaveCount(3);
  await expect(page.getByText("Latest change · Strategic failure became visible across 84 adversarial Trials")).toBeVisible();
  await expect(page.locator(".current-feature")).toHaveCount(0);
  await expect(page.locator(".closing-statement")).toHaveCount(0);

  const palette = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    return {
      accent: root.getPropertyValue("--accent").trim(),
      success: root.getPropertyValue("--success").trim(),
      frontier: getComputedStyle(document.querySelector(".home-frontier")!).backgroundColor,
      final: getComputedStyle(document.querySelector(".home-final")!).backgroundColor,
    };
  });
  expect(palette.accent).toBe("#9187ff");
  expect(palette.success).toBe("#70cba2");
  expect(palette.frontier).toBe("rgb(23, 29, 41)");
  expect(palette.final).toBe("rgb(17, 22, 32)");

  const poster = await page.locator(".home-poster").boundingBox();
  const header = await page.locator(".site-header").boundingBox();
  expect(poster).not.toBeNull();
  expect(header).not.toBeNull();
  expect(Math.abs((poster!.height + header!.height) - await page.evaluate(() => innerHeight))).toBeLessThan(isMobile ? 8 : 4);
});

test("article navigation matches viewport", async ({ page, isMobile }) => {
  await page.goto("/writing/winning-move-loses-contest", { waitUntil: "domcontentloaded" });
  if (isMobile) {
    await expect(page.locator(".article-toc-mobile")).toBeVisible();
    await expect(page.locator(".article-rail")).toBeHidden();
  } else {
    await expect(page.locator(".article-rail")).toBeVisible();
    await expect(page.locator(".article-toc-mobile")).toBeHidden();
  }
});

test("core pages have no serious accessibility violations", async ({ page }) => {
  for (const route of ["/", "/system", "/research", "/research/web-research-interface", "/projects", "/writing", "/writing/winning-move-loses-contest", "/writing/smaller-core-strong-baselines", "/projects/runtime"]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""));
    expect(serious, route).toEqual([]);
  }
});
