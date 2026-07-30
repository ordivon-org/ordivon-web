# Ordivon Web V2

Recoverable rebuild of the Ordivon public narrative, project explanation, research publishing, visualization, and evidence-navigation surface.

- **Round 1** froze the production V1 baseline and proved a modern Next.js build path.
- **Round 2** established the reader-facing homepage, initial project graph, later corrected from separate Link and Edge projects to Ordivon World, differentiated project pages, Writing archive, and long-form reading system.
- **Round 3** removes the unnecessary request-time Next runtime and publishes the complete site as a deterministic static export through Cloudflare Workers Static Assets, with release-grade browser, accessibility, performance, metadata, redirect, cache, link, and hosted-edge verification.

Production remains the V1 GitHub Pages site on `production/v1-pages@33c97c0409b370db9e8e870a591d5b93cf56b774` until a separate, explicit cutover. The development mainline is no longer the rollback origin.

## Runtime shape

```text
Next.js build
    ↓
out/ static export
    ↓
Cloudflare Workers Static Assets
```

All public project and article routes are known at build time. RSS, sitemap, robots, health metadata, social images, redirects, headers, and the custom 404 are emitted as static files or static-asset configuration. There is no request-time application module, database, ISR cache, Pages Function, D1, KV, R2, Queue, or service binding.

The previously verified OpenNext application-Worker path remains recoverable from commit `218b86a24666c7522109af85b0edf0d70d3fb77a`; it is deliberately absent from the current dependency graph.

## Hosted preview

The account-hosted release candidate is available at:

```text
https://ordivon-web-v2-preview.ordivon-lab.workers.dev
```

It is isolated from `ordivon.com`, `www.ordivon.com`, and `lab.ordivon.com`. The preview service is named `ordivon-web-v2-preview`. Exact source, Version, Deployment, traffic, Hosted verification, and production-boundary identities are recorded once in `artifacts/v2-round3/hosted-preview.json`; README does not duplicate mutable deployment identifiers.

## Commands

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm build
pnpm preview
pnpm check
pnpm check:release
pnpm check:hosted
```

Core gates:

- `pnpm check` regenerates the article snapshot, then runs TypeScript, explicit-source ESLint, production dependency audit, static build, desktop/mobile smoke tests, axe scans, and the complete local Workers Static Assets protocol audit.
- `pnpm check:release` adds byte-reproducibility verification, Chromium, Firefox, WebKit, mobile Chromium, Lighthouse budgets, and all external-link checks. It is intended for Ubuntu CI with all Playwright browser dependencies installed.
- `pnpm check:release:local` runs the same release boundary on the Arch WSL host, using the official Playwright Noble container for WebKit ABI isolation.
- `pnpm check:hosted` validates the actual `workers.dev` deployment through the complete hosted protocol matrix, Chromium, Firefox, mobile Chromium, containerized WebKit, and 60 hosted Lighthouse runs.
- `pnpm verify:static` validates canonical pages, metadata, JSON-LD, internal links, anchors, RSS, robots, health, security headers, cache policy, all V1 redirects, immutable assets, and the custom 404 through `wrangler dev`.
- `pnpm verify:hosted` repeats that protocol boundary against the public Cloudflare edge and additionally asserts Cloudflare response identity.
- `pnpm audit:lighthouse` runs five baseline measurements per route/device in a fresh Chrome. If and only if the aggregate fails solely on timing-sensitive Performance, LCP, or TBT budgets, it runs one complete confirmation batch in another fresh Chrome; deterministic accessibility, best-practice, SEO, CLS, or transfer failures never retry.
- `pnpm audit:links` uses direct HTTP, GitHub REST API fallback, and an expiring explicit restriction allowlist; new unreachable, server-error, client-error, or unapproved restricted references fail the gate.
- `pnpm deploy` builds and uploads `out/` to the non-production Static Assets service. It reads `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, or the existing root-only Ordivon secret file; credentials are never included in the bundle or artifacts.

## Recovery surfaces

- `legacy-v1/` is the original Round 1 production archive at `7c7021796cb3cf4894809d1a3925451050d8a7e5`.
- `production/v1-pages` is the live, independently frozen V1 GitHub Pages source at `33c97c0409b370db9e8e870a591d5b93cf56b774`; `legacy-v1-current/` is its in-tree archive, including the Ordivon World correction.
- `artifacts/v1-baseline/` contains asserted V1 screenshots, metrics, and hashes.
- `artifacts/v2-round2/` contains V2 editorial screenshots, first-viewport previews, metrics, and hashes.
- `artifacts/v2-round3/` contains local platform, hosted platform, Lighthouse, external-link, deployment, and release evidence.
- `docs/v2/` records route, deployment, cutover, rollback, and architectural decisions.
- Draft PR #31 remains isolated from production until the cutover gate is explicitly approved.
