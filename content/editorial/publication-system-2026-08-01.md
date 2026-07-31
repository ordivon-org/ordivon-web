# Ordivon Publication System — Implementation Record

Date: 1 August 2026  
Baseline: `origin/main@5d0f28af04787f84261c6038d3ac407bb46221e1`

## Objective

Turn durable research and engineering results into publications that remain scannable, evidence-bounded, revisable, and independently distributable without introducing a CMS or a second fact database.

## Implemented layers

1. **Publication schema** — status, claim class, evidence level, takeaways, limitations, canonical record, and optional supersession.
2. **Editorial manifest** — one explicit source for Home proof, Writing entry paths, Research priorities, and canonical statements.
3. **Publication primitives** — three proven MDX structures: an in-brief contract, a visible claim boundary, and an accessible explanatory figure.
4. **Flagship packages** — five high-value articles now include shared briefs, claim boundaries, and mechanism/evidence figures.
5. **Validation** — all 19 articles and every editorial selection are checked before build.
6. **Discovery** — Article JSON-LD, independent social images, RSS evidence/status categories, and trustworthy sitemap last-modified dates.
7. **Production audit** — one command compares origin/main, the production branch, deployment source, and live public contracts.

## Design constraints

- Repositories and retained evidence remain authoritative.
- Article metadata is consumed by pages, validation, RSS, JSON-LD, or editorial selection; unused fields are not admitted.
- Historical articles remain dated rather than being silently rewritten.
- One article shell serves every type; type-specific profiles were not admitted because the five flagship migrations did not require them.
- Figures explain mechanisms and evidence; they are not decorative dashboard surfaces.
- Existing articles remain valid without bespoke per-article application code.
- Four speculative primitives were deleted after the global publication brief made them redundant.

## Acceptance contract

- `pnpm publication:check`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- full Chromium desktop/mobile checks
- serious/critical axe scan
- deterministic article social images
- production audit after deployment

## Deferred by evidence

- Series pages until at least three publications require an order that reading paths cannot express.
- Analytics until external traffic creates a real decision.
- Full migration of the remaining fourteen bodies until the five flagship packages demonstrate clear reuse and reading value.
- CMS, comments, and multilingual publication governance.
