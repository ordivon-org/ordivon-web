# Ordivon Web V2

Recoverable rebuild of the Ordivon public narrative, project explanation, research publishing, visualization, and evidence-navigation surface.

- **Round 1** froze the production V1 baseline and proved a modern Next.js build path.
- **Round 2** established the reader-facing homepage, five-project graph, differentiated project pages, Writing archive, and long-form reading system.
- **Round 3** removes the unnecessary request-time Worker and ships the complete site as a deterministic static export for Cloudflare Pages, with release-grade browser, accessibility, performance, metadata, redirect, cache, and link verification.

Production remains the V1 GitHub Pages site on `main` until a separate, explicit cutover.

## Runtime shape

```text
Next.js build
    ↓
out/ static export
    ↓
Cloudflare Pages static assets
```

All public project and article routes are known at build time. RSS, sitemap, robots, health metadata, social images, redirects, headers, and the custom 404 are also emitted as static files or Pages configuration. The current architecture uses no database, ISR cache, Pages Function, or application Worker.

The previously verified OpenNext Worker path remains recoverable from commit `218b86a24666c7522109af85b0edf0d70d3fb77a`; it is deliberately absent from the current dependency graph.

## Commands

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm build
pnpm preview
pnpm check
pnpm check:release
```

Core gates:

- `pnpm check` regenerates the six-article snapshot, then runs TypeScript, explicit-source ESLint, production dependency audit, static build, desktop/mobile smoke tests, axe scans, and the complete Pages protocol audit.
- `pnpm check:release` adds Chromium, Firefox, WebKit, mobile Chromium, Lighthouse budgets, and all external-link checks. It is intended for Ubuntu CI with all Playwright browser dependencies installed.
- `pnpm check:release:local` runs the same release boundary on the Arch WSL host, using the official Playwright Noble container for WebKit ABI isolation.
- `pnpm verify:static` validates canonical pages, metadata, JSON-LD, internal links, anchors, RSS, robots, health, security headers, cache policy, all V1 redirects, immutable assets, and the custom 404 through `wrangler pages dev`.
- `pnpm audit:lighthouse` runs each route/device audit three times and enforces the median against the mobile and desktop performance budgets, preserving strict thresholds without making one shared-runner CPU spike decisive.
- `pnpm audit:links` distinguishes reachable, access-restricted, and broken external references.
- `pnpm deploy` builds and uploads `out/` to the non-production Cloudflare Pages project. It does not attach `ordivon.com`.

Evidence utilities:

- `pnpm migrate:v1`
- `pnpm capture:v1`
- `pnpm capture:v2`
- `pnpm measure:v2`

## Recovery surfaces

- `legacy-v1/` is an exact archive of production commit `7c7021796cb3cf4894809d1a3925451050d8a7e5`.
- `artifacts/v1-baseline/` contains asserted V1 screenshots, metrics, and hashes.
- `artifacts/v2-round2/` contains V2 editorial screenshots, first-viewport previews, metrics, and hashes.
- `artifacts/v2-round3/` contains static-platform, Lighthouse, external-link, hosted-preview, and release evidence.
- `docs/v2/` records route, deployment, cutover, rollback, and architectural decisions.
- Draft PR #31 remains isolated from production until the cutover gate is explicitly approved.
