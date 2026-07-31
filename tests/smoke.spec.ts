import AxeBuilder from "@axe-core/playwright";
import { articleMetadata } from "../content/articles/registry";
import { questions } from "../content/model";
import { expect, test } from "@playwright/test";

const coreRoutes = [
  "/", "/system", "/research", "/research/web-research-interface", "/research/security-adversarial-trajectory",
  "/research/smallest-agent-native-core", "/research/harness-composition-and-completion",
  "/research/calibrated-non-action", "/research/opponent-state-transfer",
  "/projects", "/projects/computing", "/projects/host", "/projects/runtime", "/projects/world",
  "/writing", "/writing/creation-judgment-recoverable-systems", "/writing/station-zero-alpha-1",
  "/writing/thin-host-without-hidden-planner", "/writing/one-authority-thirteen-tables",
  "/writing/replay-without-second-truth-store", "/writing/transcript-not-task-database",
  "/writing/unknown-is-operational-state", "/writing/communication-is-gameplay-state",
  "/writing/winning-move-loses-contest", "/writing/smaller-core-strong-baselines",
  "/writing/the-future-will-not-wait", "/writing/runtime-after-core", "/now", "/about", "/colophon",
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
  expect(feed.headers()["content-type"]).toMatch(/(?:application|text)\/xml/);
  expect(await feed.text()).toMatch(/<rss version="2\.0"><channel>/);
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  expect((await request.get("/opengraph-image.png")).headers()["content-type"]).toContain("image/png");
});

test("internal navigation targets resolve", async ({ page, request }) => {
  const sourceRoutes = [
    "/", "/system", "/research", "/research/web-research-interface", "/projects", "/writing", "/about", "/now",
    "/projects/runtime", "/writing/creation-judgment-recoverable-systems", "/writing/station-zero-alpha-1",
    "/writing/thin-host-without-hidden-planner", "/writing/one-authority-thirteen-tables",
    "/writing/replay-without-second-truth-store", "/writing/winning-move-loses-contest",
    "/writing/smaller-core-strong-baselines", "/writing/the-future-will-not-wait",
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

test("public model is article-centered and does not expose the retired graph ledger", async ({ page }) => {
  await page.goto("/now", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "The newest complete public arguments." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What each public project owns now." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Recently revised Question dossiers." })).toBeVisible();
  await expect(page.getByRole("link", { name: /Creation, Judgment, and Recoverable Systems/ })).toBeVisible();

  await page.goto("/research/web-research-interface", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Complete arguments connected to this Question." })).toBeVisible();
  await expect(page.getByRole("link", { name: /Creation, Judgment, and Recoverable Systems/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "The dossier is an index, not the evidence authority." })).toBeVisible();

  await page.goto("/research/security-adversarial-trajectory", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("link", { name: /Winning the Move Can Lose the Contest/ })).toBeVisible();
  await expect(page.getByText("84 Trials", { exact: false })).toBeVisible();

  await page.goto("/research/harness-composition-and-completion", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("answered", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Answered within Harness Stage 1", { exact: false })).toBeVisible();
  await expect(page.getByText("No publication has earned attachment to this Question yet.", { exact: false })).toBeVisible();

  for (const route of ["/system", "/research", "/writing", "/now", "/research/web-research-interface"]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const text = await page.locator("body").innerText();
    for (const retired of ["Graph ledger", "graph anchors", "centrality", "typed relations", "evidence objects"]) {
      expect(text, `${route} still exposes ${retired}`).not.toContain(retired);
    }
  }
});

test("system explorer uses curated architecture views", async ({ page }) => {
  await page.goto("/system", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Ordivon has a small public model and richer source repositories." })).toBeVisible();
  await expect(page.getByText("4", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("16", { exact: true }).first()).toBeVisible();
  await expect(page.locator(".system-explorer")).toHaveAttribute("data-ready", "true");
  await expect(page.getByRole("button", { name: "Structure State ownership" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel("Selected architecture object").getByRole("heading", { name: "Host", exact: true })).toBeVisible();

  const hostRepository = page.getByRole("button", { name: /Host repository.*Ordivon Host/ });
  await hostRepository.focus();
  await expect(page.getByLabel("Selected architecture object").getByRole("heading", { name: "Ordivon Host" })).toBeVisible();
  await hostRepository.press("Enter");
  await expect(hostRepository).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Research Question to publication" }).click();
  await expect(page.getByRole("button", { name: /Strong-baseline report.*The Smaller Core That Survived Strong Baselines/ })).toBeVisible();
  await page.getByRole("button", { name: /Station Zero Alpha.*Station Zero v0.1.0-alpha.1/ }).click();
  await expect(page.getByLabel("Selected architecture object").getByRole("heading", { name: "Station Zero v0.1.0-alpha.1" })).toBeVisible();

  await page.getByRole("button", { name: "Execution Effect path" }).click();
  await expect(page.getByRole("button", { name: /Runtime.*Ordivon Runtime/ })).toBeVisible();
});

test("research index switches among Questions, Projects, Publications, and Status", async ({ page }) => {
  await page.goto("/research", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".research-explorer")).toHaveAttribute("data-ready", "true");
  await expect(page.getByRole("button", { name: "Questions the active frontier" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("link", { name: /Can Host complete a general repository Goal/ })).toBeVisible();

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

test("writing is organized by metadata-derived Questions and chronology", async ({ page }) => {
  const expectedProjects = new Set(articleMetadata.flatMap((article) => article.projectSlugs)).size;
  const expectedQuestions = new Set(articleMetadata.flatMap((article) => article.questionSlugs)).size;
  await page.goto("/writing", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Dated arguments, not a second fact database." })).toBeVisible();
  const summary = page.locator(".writing-summary");
  await expect(summary.getByText(String(articleMetadata.length), { exact: true })).toBeVisible();
  await expect(summary.getByText(String(expectedProjects), { exact: true })).toBeVisible();
  await expect(summary.getByText(String(expectedQuestions), { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Start from the uncertainty, then read the complete arguments." })).toBeVisible();
  const smallestCoreTopic = page.locator(".writing-topic-list > article").filter({ has: page.getByRole("heading", { name: "Which Agent-native responsibilities remain after strong classical baselines?" }) });
  await expect(smallestCoreTopic).toBeVisible();
  await expect(smallestCoreTopic.getByRole("link", { name: /The Smaller Core That Survived Strong Baselines/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Publication history remains explicit." })).toBeVisible();
});

const publicationContracts = [
  { slug: "creation-judgment-recoverable-systems", title: "Creation, Judgment, and Recoverable Systems", tables: 1, phrase: "The goal is not a system that prevents every internal failure." },
  { slug: "station-zero-alpha-1", title: "Station Zero v0.1.0-alpha.1", tables: 2, phrase: "The release unit is not a screenshot or a successful local database." },
  { slug: "thin-host-without-hidden-planner", title: "A Thin Host Can Improve Strategy Without Becoming a Planner", tables: 1, phrase: "The thin Host improves the conditions of judgment." },
  { slug: "one-authority-thirteen-tables", title: "One Authority, Thirteen Tables Deleted", tables: 2, phrase: "Reusing one implementation is not automatically cheaper than reusing one contract." },
  { slug: "replay-without-second-truth-store", title: "Replay Without a Second Truth Store", tables: 2, phrase: "Replay should be a deterministic projection of retained authority" },
  { slug: "transcript-not-task-database", title: "A Transcript Is Not a Task Database", tables: 0, phrase: "A summary can preserve narrative continuity while destroying operational continuity." },
  { slug: "unknown-is-operational-state", title: "UNKNOWN Is an Operational State, Not a Model Feeling", tables: 0, phrase: "No response does not imply no commit." },
  { slug: "communication-is-gameplay-state", title: "Communication Is Gameplay State", tables: 1, phrase: "Communication is gameplay state when reachability changes" },
] as const;

for (const contract of publicationContracts) {
  test(`${contract.slug} preserves its public claim boundary`, async ({ page }) => {
    const metadata = articleMetadata.find((article) => article.slug === contract.slug)!;
    await page.goto(`/writing/${contract.slug}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: contract.title, exact: true })).toBeVisible();
    await expect(page.getByText(contract.phrase, { exact: false }).first()).toBeVisible();
    await expect(page.locator(".article-anchor-grid > *")).toHaveCount(metadata.projectSlugs.length + metadata.questionSlugs.length);
    await expect(page.locator(".article-data-table")).toHaveCount(contract.tables);
    await expect(page.getByRole("heading", { name: "Where this article sits." })).toBeVisible();
  });
}

test("flagship adversarial report preserves metric contradictions and negative results", async ({ page }) => {
  await page.goto("/writing/winning-move-loses-contest", { waitUntil: "domcontentloaded" });
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
  await page.goto("/writing/smaller-core-strong-baselines", { waitUntil: "domcontentloaded" });
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
  await page.goto("/writing/runtime-after-core", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Where this article sits." })).toBeVisible();
  await expect(page.getByRole("link", { name: /Research Question.*Which real structured operation can complete the minimal Effect contract/ })).toHaveAttribute("href", "/research/runtime-structured-effect/");
  await expect(page.getByRole("link", { name: /Project.*Ordivon Runtime/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Continue through shared Questions and Projects." })).toBeVisible();
  await expect(page.locator(".related-reading").getByRole("link", { name: /Why Task continuity belongs above execution/ })).toBeVisible();
});

test("homepage presents one continuous dark visual thesis", async ({ page, isMobile }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".home-poster-brand")).toHaveText("ORDIVON");
  await expect(page.getByRole("heading", { name: "Work should survive the intelligence that started it." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Task truth survived session loss, restart recovery, and model replacement." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Four owners. No shared fiction." })).toBeVisible();
  await expect(page.locator(".home-owner-row")).toHaveCount(4);
  await expect(page.locator(".home-frontier").getByRole("link", { name: /See the publications and deletion condition/ })).toHaveAttribute("href", /\/research\/.+\//);
  await expect(page.locator(".home-writing-row")).toHaveCount(3);
  await expect(page.getByText("Latest publication · Creation, Judgment, and Recoverable Systems")).toBeVisible();

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
  for (const route of ["/", "/system", "/research", "/research/web-research-interface", "/projects", "/writing",
    "/writing/creation-judgment-recoverable-systems", "/writing/station-zero-alpha-1",
    "/writing/thin-host-without-hidden-planner", "/writing/one-authority-thirteen-tables",
    "/writing/replay-without-second-truth-store", "/writing/winning-move-loses-contest",
    "/writing/smaller-core-strong-baselines", "/projects/runtime"]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""));
    expect(serious, route).toEqual([]);
  }
});
