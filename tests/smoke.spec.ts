import AxeBuilder from "@axe-core/playwright";
import { articleMetadata } from "../content/articles/generated-metadata";
import { questions } from "../content/model";
import { expect, test, type Page } from "@playwright/test";

async function gotoWithNetworkRetry(page: Page, route: string) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try { return await page.goto(route, { waitUntil: "domcontentloaded" }); }
    catch (error) {
      const retryable = error instanceof Error && /ERR_NETWORK_CHANGED|ERR_CONNECTION_RESET/.test(error.message);
      if (!retryable || attempt === 1) throw error;
      await page.waitForTimeout(150);
    }
  }
  return null;
}

const coreRoutes = [
  "/", "/system", "/research", "/research/web-research-interface", "/research/security-adversarial-trajectory",
  "/research/smallest-agent-native-core", "/research/harness-composition-and-completion", "/research/ordivon-harness-v0",
  "/research/calibrated-non-action", "/research/opponent-state-transfer", "/research/human-economic-autonomy",
  "/projects", "/projects/computing", "/projects/host", "/projects/harness", "/projects/runtime", "/projects/game",
  "/projects/world", "/projects/human", "/projects/security",
  "/writing", "/writing/creation-judgment-recoverable-systems", "/writing/station-zero-alpha-1",
  "/writing/thin-host-without-hidden-planner", "/writing/one-authority-thirteen-tables",
  "/writing/replay-without-second-truth-store", "/writing/transcript-not-task-database",
  "/writing/unknown-is-operational-state", "/writing/communication-is-gameplay-state",
  "/writing/from-tokens-to-work", "/writing/why-ordivon-needs-a-harness", "/writing/what-h1-h5-proved",
  "/writing/winning-move-loses-contest", "/writing/smaller-core-strong-baselines",
  "/writing/the-future-will-not-wait", "/writing/runtime-after-core", "/now", "/about", "/colophon",
];

for (const route of coreRoutes) {
  test(`${route} renders without overflow`, async ({ page }) => {
    const response = await gotoWithNetworkRetry(page, route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    await expect.poll(async () => {
      try { return await page.locator("html").evaluate((element) => element.scrollWidth <= element.clientWidth); }
      catch { return false; }
    }).toBe(true);
  });
}

test("all writing routes render", async ({ request }) => {
  for (const { slug } of articleMetadata) {
    const response = await request.get(`/writing/${slug}`);
    expect(response.status(), slug).toBe(200);
  }
});

test("all research dossiers render", async ({ request }) => {
  for (const { slug } of questions) {
    const response = await request.get(`/research/${slug}`);
    expect(response.status(), slug).toBe(200);
  }
});

test("publishing endpoints render", async ({ request }) => {
  const feed = await request.get("/feed.xml");
  expect(feed.status()).toBe(200);
  expect(feed.headers()["content-type"]).toMatch(/(?:application|text)\/(?:atom\+)?xml/);
  expect(await feed.text()).toContain(`<feed xmlns="http://www.w3.org/2005/Atom">`);
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  expect((await request.get("/opengraph-image.png")).headers()["content-type"]).toContain("image/png");
  for (const { slug } of articleMetadata) {
    const image = await request.get(`/og/${slug}.png`);
    expect(image.status(), slug).toBe(200);
    expect(image.headers()["content-type"], slug).toContain("image/png");
  }
});

test("publication metadata is visible and internally consistent", async ({ page }) => {
  for (const article of articleMetadata) {
    expect(article.publishedAt, article.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(article.takeaways.length, article.slug).toBeGreaterThanOrEqual(1);
    expect(article.limitations.length, article.slug).toBeGreaterThan(0);
    if (["E3", "E4", "E5"].includes(article.evidenceLevel)) expect(article.canonicalResearchRecord, article.slug).toMatch(/^https:\/\//);
    const revisedAt = "revisedAt" in article ? article.revisedAt : undefined;
    if (revisedAt) expect(revisedAt >= article.publishedAt, article.slug).toBe(true);
  }
  expect(articleMetadata.filter((article) => "revisedAt" in article).map((article) => article.slug).sort()).toEqual([
    "from-tokens-to-work", "link-edge-boundary", "what-h1-h5-proved", "why-ordivon-needs-a-harness",
  ].sort());
  await gotoWithNetworkRetry(page, "/writing/from-tokens-to-work");
  await expect(page.locator(".publication-brief")).toBeVisible();
  await expect(page.locator(".publication-brief-status").getByText(/E3/)).toBeVisible();
  await expect(page.locator(".publication-brief-copy li")).toHaveCount(3);
  await expect(page.locator(".publication-limitations li")).toHaveCount(2);
});

test("five flagship publications use the shared publication primitives", async ({ page }) => {
  for (const slug of ["from-tokens-to-work", "what-h1-h5-proved", "smaller-core-strong-baselines", "winning-move-loses-contest", "creation-judgment-recoverable-systems"]) {
    await gotoWithNetworkRetry(page, `/writing/${slug}`);
    await expect(page.locator(".mdx-in-brief"), slug).toBeVisible();
    await expect(page.locator(".publication-figure"), slug).toHaveCount(1);
    await expect(page.locator(".mdx-claim-boundary"), slug).toHaveCount(1);
  }
});

test("historical releases and structured discovery remain explicit", async ({ page, request }) => {
  for (const slug of ["station-zero-alpha-1", "why-ordivon-needs-a-harness", "link-edge-boundary"]) {
    await gotoWithNetworkRetry(page, `/writing/${slug}`);
    await expect(page.locator(".publication-status-notice").getByText("Historical publication", { exact: true }), slug).toBeVisible();
  }

  const articleResponse = await request.get("/writing/what-h1-h5-proved");
  const articleHtml = await articleResponse.text();
  expect(articleHtml).toContain("/og/what-h1-h5-proved.png");
  expect(articleHtml).toContain("application/ld+json");
  expect(articleHtml).toContain("harness-replacement-h5-live-76420e4-20260731.json");

  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("<lastmod>2026-07-31</lastmod>");
  expect(sitemap).not.toContain("<priority>");
  expect(sitemap).not.toContain("<changefreq>");

  const feed = await (await request.get("/feed.xml")).text();
  expect(feed).toContain('<link rel="self" href="https://ordivon.com/feed.xml"/>');
  expect(feed).toContain("<published>2026-07-31T12:00:00Z</published>");
  expect(feed).toContain("<category term=\"E4\"/>");
  expect(feed).toContain('rel="related"');
  expect(feed).not.toContain("<source");
});

test("internal navigation targets resolve", async ({ page, request }) => {
  const sourceRoutes = [
    "/", "/system", "/research", "/research/web-research-interface", "/projects", "/writing", "/about", "/now",
    "/projects/runtime", "/writing/creation-judgment-recoverable-systems", "/writing/station-zero-alpha-1",
    "/writing/thin-host-without-hidden-planner", "/writing/one-authority-thirteen-tables",
    "/writing/replay-without-second-truth-store", "/writing/from-tokens-to-work",
    "/writing/why-ordivon-needs-a-harness", "/writing/what-h1-h5-proved",
    "/writing/winning-move-loses-contest", "/writing/smaller-core-strong-baselines", "/writing/the-future-will-not-wait",
  ];
  const targets = new Set<string>();
  for (const route of sourceRoutes) {
    await gotoWithNetworkRetry(page, route);
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

test("public model is article-centered and does not expose the retired graph ledger", async ({ page }) => {
  await gotoWithNetworkRetry(page, "/now");
  await expect(page.getByRole("heading", { name: "Read the arguments and reports that changed the judgment." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Eight public projects with explicit maturity and boundaries." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Questions carrying the current architectural and research pressure." })).toBeVisible();
  await expect(page.getByRole("link", { name: /Creation, Judgment, and Recoverable Systems/ })).toBeVisible();

  await gotoWithNetworkRetry(page, "/research/web-research-interface");
  await expect(page.getByRole("heading", { name: "Complete arguments connected to this Question." })).toBeVisible();
  await expect(page.getByRole("link", { name: /Creation, Judgment, and Recoverable Systems/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "The dossier is an index, not the evidence authority." })).toBeVisible();

  await gotoWithNetworkRetry(page, "/research/security-adversarial-trajectory");
  await expect(page.getByRole("link", { name: /Winning the Move Can Lose the Contest/ })).toBeVisible();
  await expect(page.getByText("84 Trials", { exact: false })).toBeVisible();

  await gotoWithNetworkRetry(page, "/research/harness-composition-and-completion");
  await expect(page.getByText("answered", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Answered by H1–H5", { exact: false })).toBeVisible();
  await expect(page.getByRole("link", { name: /What Survived When Codex and Hermes Replaced Each Other Mid-Task/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Why Ordivon Needs a Harness/ })).toBeVisible();

  await gotoWithNetworkRetry(page, "/research/ordivon-harness-v0");
  await expect(page.getByText("testing", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Implemented and under pressure.", { exact: false })).toBeVisible();
  await expect(page.getByRole("link", { name: /From Tokens to Work/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Why Ordivon Needs a Harness/ })).toBeVisible();

  for (const route of ["/system", "/research", "/writing", "/now", "/research/web-research-interface"]) {
    await gotoWithNetworkRetry(page, route);
    const text = await page.locator("body").innerText();
    for (const retired of ["Graph ledger", "graph anchors", "centrality", "typed relations", "evidence objects"]) {
      expect(text, `${route} still exposes ${retired}`).not.toContain(retired);
    }
  }
});

test("reader orientation precedes formal models on the remaining R2 surfaces", async ({ page }) => {
  await gotoWithNetworkRetry(page, "/now");
  await expect(page.locator(".now-brief-grid > article")).toHaveCount(4);
  await expect(page.getByRole("heading", { name: "The public map now distinguishes capability from prototype, product, research, and history." })).toBeVisible();

  await gotoWithNetworkRetry(page, "/about");
  await expect(page.getByRole("heading", { name: /Ordivon began with a simple failure/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Built in public by zycxfyh." })).toBeVisible();
  await expect(page.locator(".about-principle-grid > article")).toHaveCount(4);

  await gotoWithNetworkRetry(page, "/projects");
  await expect(page.locator(".project-capability-card")).toHaveCount(8);
  await expect(page.getByText("Operational owner-trusted infrastructure", { exact: true })).toBeVisible();
  await expect(page.getByText("Operational capability carrier; shared layer rejected", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Ordivon Harness", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Ordivon Human", exact: true })).toBeVisible();

  await gotoWithNetworkRetry(page, "/projects/runtime");
  await expect(page.getByRole("heading", { name: "Ordivon Runtime", exact: true })).toBeVisible();
  await expect(page.locator(".project-use-strip > div")).toHaveCount(3);
  await expect(page.getByText("Capability evidence", { exact: true })).toBeVisible();

  await gotoWithNetworkRetry(page, "/research");
  await expect(page.locator(".research-start-grid > a")).toHaveCount(3);
  await expect(page.getByText("Most important question under test", { exact: true })).toBeVisible();
  await expect(page.getByText("Recently answered boundary", { exact: true })).toBeVisible();
  await expect(page.getByText("Experiment that most changed the architecture", { exact: true })).toBeVisible();
});

test("system explorer uses curated architecture views", async ({ page }) => {
  await gotoWithNetworkRetry(page, "/system");
  await expect(page.getByRole("heading", { name: "One Task can outlive the model Run and process that carried it." })).toBeVisible();
  await expect(page.locator(".system-trajectory li")).toHaveCount(5);
  await expect(page.locator(".system-owner-grid .system-owner-card")).toHaveCount(3);
  await expect(page.locator(".system-research-plane .system-owner-card")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Computing", exact: true })).toBeVisible();
  for (const value of ["3", "2 / 2", "256", "13"]) await expect(page.locator(".system-hero-stats").getByText(value, { exact: true })).toBeVisible();
  await expect(page.locator(".system-explorer")).toHaveAttribute("data-ready", "true", { timeout: 15_000 });
  await expect(page.getByRole("button", { name: "Structure State ownership" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel("Selected architecture object").getByRole("heading", { name: "Host", exact: true })).toBeVisible();

  const hostRepository = page.getByRole("button", { name: /Host repository.*Ordivon Host/ });
  await hostRepository.focus();
  await expect(page.getByLabel("Selected architecture object").getByRole("heading", { name: "Ordivon Host" })).toBeVisible();
  await hostRepository.press("Enter");
  await expect(hostRepository).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Research Question to publication" }).click();
  await expect(page.getByRole("button", { name: /Strong-baseline report.*The Smaller Core That Survived Strong Baselines/ })).toBeVisible();
  await page.getByRole("button", { name: /Historical Alpha.*Station Zero v0.1.0-alpha.1/ }).click();
  await expect(page.getByLabel("Selected architecture object").getByRole("heading", { name: "Station Zero v0.1.0-alpha.1 — The First Source-Playable Release" })).toBeVisible();

  await page.getByRole("button", { name: "Execution Task to evidence" }).click();
  await expect(page.getByRole("button", { name: /Runtime.*Ordivon Runtime/ })).toBeVisible();
});

test("research index switches among Questions, Projects, Publications, and Status", async ({ page }) => {
  await gotoWithNetworkRetry(page, "/research");
  await expect(page.locator(".research-explorer")).toHaveAttribute("data-ready", "true");
  await expect(page.getByRole("button", { name: "Questions the active frontier" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".research-explorer").getByRole("link", { name: /Can Host complete a broader repository Goal/ })).toBeVisible();

  await page.getByRole("button", { name: "Projects where pressure accumulates" }).click();
  await expect(page.locator('[data-view="projects"]')).toBeVisible();
  await expect(page.getByRole("heading", { name: "Ordivon Host", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Publications dated complete arguments" }).click();
  await expect(page.locator('[data-view="timeline"]')).toBeVisible();
  await expect(page.getByRole("heading", { name: "Creation, Judgment, and Recoverable Systems" })).toBeVisible();

  await page.getByRole("button", { name: "Status testing, open, resolved" }).click();
  await expect(page.locator('[data-view="status"]')).toBeVisible();
  await expect(page.getByText("testing", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("open", { exact: true }).first()).toBeVisible();
});

test("writing provides editorial entry paths before metadata-derived research navigation", async ({ page }) => {
  const expectedResearchReports = articleMetadata.filter((article) => article.type === "Research report").length;
  const engineeringTypes = new Set(["Engineering report", "Architecture report", "Architecture guide", "Architecture decision", "Architecture correction", "Release", "Release note"]);
  const expectedEngineeringRecords = articleMetadata.filter((article) => engineeringTypes.has(article.type)).length;
  const expectedEssaysAndNotes = articleMetadata.length - expectedResearchReports - expectedEngineeringRecords;
  await gotoWithNetworkRetry(page, "/writing");
  await expect(page.getByRole("heading", { name: "Ideas, experiments, and decisions behind durable agent work." })).toBeVisible();
  const summary = page.locator(".writing-summary");
  for (const value of [expectedResearchReports, expectedEngineeringRecords, expectedEssaysAndNotes]) {
    await expect(summary.getByText(String(value), { exact: true })).toBeVisible();
  }
  await expect(page.locator(".writing-featured-main").getByRole("heading", { name: "From Tokens to Work: The Complete Agent Execution Stack" })).toBeVisible();
  await expect(page.locator(".writing-featured-evidence > a")).toHaveCount(2);
  await expect(page.getByRole("heading", { name: "Choose the question you want the work to answer." })).toBeVisible();
  await expect(page.locator(".writing-path-grid > article")).toHaveCount(3);
  const smallestCoreTopic = page.locator(".writing-topic-list > article").filter({ has: page.getByRole("heading", { name: "Which Agent-native responsibilities remain after strong classical baselines?" }) });
  await expect(smallestCoreTopic).toBeVisible();
  await expect(smallestCoreTopic.getByRole("link", { name: /The Smaller Core That Survived Strong Baselines/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Every published claim remains dated." })).toBeVisible();
});

const publicationContracts = [
  { slug: "creation-judgment-recoverable-systems", title: "Creation, Judgment, and Recoverable Systems", tables: 1, phrase: "The goal is not a system that prevents every internal failure." },
  { slug: "station-zero-alpha-1", title: "Station Zero v0.1.0-alpha.1 — The First Source-Playable Release", tables: 2, phrase: "The release unit is not a screenshot or a successful local database." },
  { slug: "thin-host-without-hidden-planner", title: "A Thin Host Can Improve Strategy Without Becoming a Planner", tables: 1, phrase: "The thin Host improves the conditions of judgment." },
  { slug: "one-authority-thirteen-tables", title: "One Authority, Thirteen Tables Deleted", tables: 2, phrase: "Reusing one implementation is not automatically cheaper than reusing one contract." },
  { slug: "replay-without-second-truth-store", title: "Replay Without a Second Truth Store", tables: 2, phrase: "Replay should be a deterministic projection of retained authority" },
  { slug: "transcript-not-task-database", title: "A Transcript Is Not a Task Database", tables: 0, phrase: "A summary can preserve narrative continuity while destroying operational continuity." },
  { slug: "unknown-is-operational-state", title: "UNKNOWN Is an Operational State, Not a Model Feeling", tables: 0, phrase: "No response does not imply no commit." },
  { slug: "communication-is-gameplay-state", title: "Communication Is Gameplay State", tables: 1, phrase: "Communication is gameplay state when reachability changes" },
  { slug: "from-tokens-to-work", title: "From Tokens to Work: The Complete Agent Execution Stack", tables: 1, phrase: "The model is the source of intelligence." },
  { slug: "why-ordivon-needs-a-harness", title: "Why Ordivon Needs a Harness—but Not a Universal Harness", tables: 1, phrase: "selective ownership" },
  { slug: "what-h1-h5-proved", title: "What Survived When Codex and Hermes Replaced Each Other Mid-Task", tables: 3, phrase: "H1–H5 retained a boundary, not a platform." },
] as const;

for (const contract of publicationContracts) {
  test(`${contract.slug} preserves its public claim boundary`, async ({ page }) => {
    const metadata = articleMetadata.find((article) => article.slug === contract.slug)!;
    await gotoWithNetworkRetry(page, `/writing/${contract.slug}`);
    await expect(page.getByRole("heading", { name: contract.title, exact: true })).toBeVisible();
    await expect(page.getByText(contract.phrase, { exact: false }).first()).toBeVisible();
    await expect(page.locator(".article-anchor-grid > *")).toHaveCount(metadata.projectSlugs.length + metadata.questionSlugs.length);
    await expect(page.locator(".article-data-table")).toHaveCount(contract.tables);
    await expect(page.getByRole("heading", { name: "Where this article sits." })).toBeVisible();
  });
}

test("flagship adversarial report preserves metric contradictions and negative results", async ({ page }) => {
  await gotoWithNetworkRetry(page, "/writing/winning-move-loses-contest");
  const metadata = articleMetadata.find((article) => article.slug === "winning-move-loses-contest")!;
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
  await expect(page.locator(".article-anchor-grid > *")).toHaveCount(metadata.projectSlugs.length + metadata.questionSlugs.length);
  await expect(page.getByRole("link", { name: /Research Question.*Can strategic adversarial trajectories be evaluated/ })).toHaveAttribute("href", "/research/security-adversarial-trajectory/");
});

test("flagship strong-baseline report preserves evidence and claim boundaries", async ({ page }) => {
  await gotoWithNetworkRetry(page, "/writing/smaller-core-strong-baselines");
  const metadata = articleMetadata.find((article) => article.slug === "smaller-core-strong-baselines")!;
  await expect(page.getByRole("heading", { name: "The Smaller Core That Survived Strong Baselines" })).toBeVisible();
  await expect(page.locator(".round1-summary").getByText("16", { exact: true })).toBeVisible();
  await expect(page.locator(".core-disposition-rows article")).toHaveCount(5);
  await expect(page.locator(".article-data-table")).toHaveCount(4);
  await expect(page.getByRole("heading", { name: "What the numbers do not say" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Round 2 must attack the remaining boundary" })).toBeVisible();
  await expect(page.locator(".article-anchor-grid > *")).toHaveCount(metadata.projectSlugs.length + metadata.questionSlugs.length);
  await expect(page.getByRole("link", { name: /Research Question.*Which Agent-native responsibilities remain/ })).toHaveAttribute("href", "/research/smallest-agent-native-core/");
});

test("article context is derived from Project and Question metadata", async ({ page }) => {
  await gotoWithNetworkRetry(page, "/writing/runtime-after-core");
  await expect(page.getByRole("heading", { name: "Where this article sits." })).toBeVisible();
  await expect(page.getByRole("link", { name: /Research Question.*Which repeated physical operation deserves a dedicated structured Runtime contract/ })).toHaveAttribute("href", "/research/runtime-structured-effect/");
  await expect(page.getByRole("link", { name: /Project.*Ordivon Runtime/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Continue through shared Questions and Projects." })).toBeVisible();
  await expect(page.locator(".related-reading").getByRole("link", { name: /Why Task Continuity Belongs Above Execution/ })).toBeVisible();
});

test("homepage presents one continuous dark visual thesis", async ({ page, isMobile }) => {
  await gotoWithNetworkRetry(page, "/");
  await expect(page.locator(".home-poster-brand")).toHaveText("ORDIVON");
  await expect(page.getByRole("heading", { name: "Keep the work when the model, session, process, or provider changes." })).toBeVisible();
  await expect(page.locator(".home-current-card")).toHaveCount(4);
  await expect(page.locator(".home-project-groups > article")).toHaveCount(3);
  await expect(page.getByRole("heading", { name: "The family is organized by what it owns—not by one universal platform diagram." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "One Task survived both Codex↔Hermes replacement orders and three injected faults." })).toBeVisible();
  await expect(page.locator(".home-frontier").getByRole("link", { name: /Read the complete evidence/ })).toHaveAttribute("href", /\/writing\/.+\//);
  await expect(page.locator(".home-writing-row")).toHaveCount(3);
  await expect(page.getByRole("heading", { name: "Understand, use, research, or challenge the work." })).toBeVisible();

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
  expect(Math.abs((poster!.height + header!.height) - await page.evaluate(() => innerHeight))).toBeLessThan(isMobile ? 96 : 32);
});

test("article navigation matches viewport", async ({ page, isMobile }) => {
  await gotoWithNetworkRetry(page, "/writing/winning-move-loses-contest");
  if (isMobile) {
    await expect(page.locator(".article-toc-mobile")).toBeVisible();
    await expect(page.locator(".article-rail")).toBeHidden();
  } else {
    await expect(page.locator(".article-rail")).toBeVisible();
    await expect(page.locator(".article-toc-mobile")).toBeHidden();
  }
});

test("core pages have no serious accessibility violations", async ({ page }) => {
  test.setTimeout(90_000);
  for (const route of ["/", "/system", "/research", "/research/web-research-interface", "/projects", "/writing",
    "/writing/creation-judgment-recoverable-systems", "/writing/station-zero-alpha-1",
    "/writing/thin-host-without-hidden-planner", "/writing/one-authority-thirteen-tables",
    "/writing/replay-without-second-truth-store", "/writing/from-tokens-to-work",
    "/writing/why-ordivon-needs-a-harness", "/writing/what-h1-h5-proved",
    "/writing/winning-move-loses-contest", "/writing/smaller-core-strong-baselines",
    "/research/ordivon-harness-v0", "/research/human-economic-autonomy", "/projects/runtime", "/projects/harness",
    "/projects/game", "/projects/human", "/projects/security"]) {
    await gotoWithNetworkRetry(page, route);
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""));
    expect(serious, route).toEqual([]);
  }
});
