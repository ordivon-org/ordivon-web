# Round 2 evidence — editorial and reading system

## Scope

Round 2 replaces the technical placeholder surfaces with the real Ordivon public interface while preserving the Round 1 runtime and recovery boundary.

Delivered public surfaces:

- reader-oriented homepage and system thesis;
- one portfolio map with five independent state owners;
- five differentiated project pages for Computing, Host, Runtime, Link, and Edge;
- Web repositioned as the publication colophon rather than a peer product;
- Writing index with client-side type filtering;
- one long-form reading system carrying all six V1 articles;
- Current, About, Colophon, RSS, robots, sitemap, Open Graph metadata, and permanent V1 redirects.

## Content migration

`scripts/migrate-v1-writing.mjs` reads the exact V1 archive, extracts article metadata, sections, citations, source notes, related reading, and body HTML, rewrites internal links to V2 routes, and emits `content/writing/articles.json`.

The migration is deterministic and currently produces six articles:

| Article | Sections | Stated read time |
|---|---:|---:|
| The Future Will Not Wait | 9 | 14 min |
| Ordivon Runtime after the core | 11 | 10 min |
| Separating connectivity from external execution | 10 | 8 min |
| Why Task continuity belongs above execution | 9 | 9 min |
| Ordivon Runtime: from governance platform to durable execution | 9 | 9 min |
| Why Ordivon matters in the AI era | 6 | 6 min |

Repositories remain the owner of current technical truth. The migrated writing snapshot preserves dated arguments and publication history.

## Information architecture

The public hierarchy is now explicit:

1. Computing — contracts and conformance.
2. Host — Goals, Tasks, cognition contexts, and Outcomes.
3. Runtime — Workspaces, Jobs, Attempts, process trees, and Artifacts.
4. Link — path observations, route identity, transport selection, and recovery evidence.
5. Edge — bounded hosted requests, leases, private Artifacts, and receipts.

The project directory and homepage expose this hierarchy. Each project page uses a distinct mechanism visualization and states its central question, current evidence, owned facts, hard boundary, open questions, and related writing.

## Reading geometry

The long-form system deliberately trades raw vertical compactness for a narrower measure, stronger section rhythm, visible navigation, and more readable line height.

Measured on the acceleration essay:

| Mode | Article width | Body font | Line height | Visible navigation |
|---|---:|---:|---:|---|
| Desktop 1440×1000 | 688 px | 18.88 px | 34.36 px | 240 px sticky section rail |
| Pixel 7 emulation | 388 px | 16.8 px | 29.4 px | collapsible mobile TOC |

The V1 article body was approximately 885–900 px wide on desktop. V2 is intentionally narrower rather than merely shorter.

## V1 → V2 page-length comparison

| Surface | V1 desktop | V2 desktop | V1 mobile | V2 mobile |
|---|---:|---:|---:|---:|
| Home | 6.4 viewports | 8.0 | 10.2 | 10.3 |
| Project index | 5.9 | 4.2 | 9.9 | 6.5 |
| Runtime project | 9.3 | 5.6 | 13.3 | 7.6 |
| Acceleration essay | 15.1 | 20.7 | 27.7 | 30.0 |

The project surfaces become materially shorter and more scannable. The homepage gains editorial explanation. The long essay becomes longer because its measure, line height, navigation, and related-reading system improve reading rather than maximize compression.

All measured V1 and V2 surfaces have zero horizontal overflow.

## Visual evidence

`artifacts/v2-round2/` contains:

- five desktop full-page screenshots;
- five mobile full-page screenshots;
- ten first-viewport previews;
- layout metrics;
- SHA-256 sums.

The capture script rejects screenshots below 10 KB. When Chromium returned an empty full-page JPEG for the 65,993 px mobile article, the script automatically recaptured it as an 8.4 MB PNG rather than accepting a zero-byte artifact.

## Browser and accessibility verification

Current local verification:

- 36/36 Playwright smoke and navigation tests pass across desktop and mobile projects;
- all five project routes and all six writing routes render;
- internal navigation targets resolve below HTTP 400;
- old project, article, index, and contact routes redirect permanently;
- desktop sticky article navigation and mobile collapsible navigation are both asserted;
- 12/12 axe scans pass with no serious or critical violations across representative desktop and mobile surfaces;
- accessibility scanning retries only when Next dev destroys the execution context during its first navigation; violations are not filtered or downgraded.

## Cloudflare SSG cache

Next.js prerenders the project and writing detail routes through `generateStaticParams`. These routes are represented as SSG cache entries rather than ordinary static files. Without an incremental-cache implementation, Next development and production servers worked but OpenNext/workerd returned 404 for the detail routes.

Round 2 configures the read-only Workers Static Assets incremental cache and enables cache interception in `open-next.config.ts`. The build-time SSG entries are now bundled beneath the Workers static-assets namespace. No R2 bucket, D1 database, queue, or revalidation mechanism is needed because this site does not use ISR.

Verified under local `workerd`:

- `/projects/runtime` — 200;
- `/writing/the-future-will-not-wait` — 200;
- `/feed.xml` — 200;
- `/sitemap.xml` — 200;
- `/opengraph-image` — 200;
- `/work` — permanent redirect.

## Build and upload shape

- `.next`: approximately 234 MiB;
- `.open-next`: approximately 42 MiB;
- `node_modules`: approximately 817 MiB;
- V2 visual evidence: approximately 18 MiB;
- Wrangler dry-run upload: 7,349.36 KiB raw / 1,815.86 KiB gzip;
- Workers static asset files: 98 read during dry-run.

The compressed upload remains close to the Round 1 measurement even after adding the full editorial system. SSG pages and cache entries are carried mainly as static assets.

## Deployment boundary

Round 2 does not alter DNS, GitHub Pages, Cloudflare Worker routes, or `ordivon.com` traffic. V1 remains live from `main`. The V2 branch stays in Draft PR #31 until account-hosted preview, performance budgets, full redirect validation, and explicit cutover work are completed.
