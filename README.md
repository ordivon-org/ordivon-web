# Ordivon Web V2

Recoverable rebuild of the Ordivon public narrative, project explanation, research publishing, visualization, and evidence-navigation surface.

Round 1 proved the Next.js/OpenNext/Cloudflare runtime and froze the production V1 baseline. Round 2 establishes the real editorial system: a reader-oriented homepage, project graph, five differentiated project pages, a Writing archive, and one long-form template carrying all six published V1 articles.

Production remains the V1 static site on `main` until a later preview and cutover round.

## Commands

```bash
pnpm install
pnpm dev
pnpm check
pnpm preview
pnpm migrate:v1
pnpm capture:v1
pnpm capture:v2
pnpm measure:v2
```

- `pnpm check` regenerates the writing snapshot, then runs type checking, explicit-source linting, production dependency audit, Next production build, desktop/mobile browser checks, accessibility checks, OpenNext build, and real local `workerd` requests.
- `pnpm migrate:v1` deterministically converts the six preserved V1 articles into the V2 content snapshot.
- `pnpm capture:v1` refreshes the asserted production rendering baseline.
- `pnpm capture:v2` captures full-page and first-viewport evidence for the Round 2 surfaces with byte and overflow assertions.
- `pnpm measure:v2` records layout geometry such as hero occupation, article measure, line height, and visible TOC dimensions.
- `pnpm preview` builds through OpenNext and runs the generated Worker under Wrangler/workerd.

## Recovery surfaces

- `legacy-v1/` is an exact archive of production commit `7c7021796cb3cf4894809d1a3925451050d8a7e5`.
- `artifacts/v1-baseline/` contains asserted desktop/mobile V1 screenshots, metrics, and hashes.
- `artifacts/v2-round2/` contains asserted V2 screenshots, first-viewport previews, metrics, and hashes.
- `docs/v2/` records route, content, deployment, design, and rollback decisions.
- The branch `rebuild/web-v2` and Draft PR #31 remain isolated from production.
