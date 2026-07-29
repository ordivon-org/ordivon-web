# Ordivon Web V2

Recoverable rebuild of the Ordivon public narrative, research publishing, visualization, and evidence-navigation surface.

Round 1 proves the runtime and migration substrate. Production remains the V1 static site on `main` until a later cutover round.

## Commands

```bash
pnpm install
pnpm dev
pnpm check
pnpm preview
pnpm capture:v1
```

- `pnpm check` runs type checking, lint, production dependency audit, Next production build, desktop/mobile browser checks, OpenNext build, and real local `workerd` requests.
- `pnpm preview` builds through OpenNext and runs the generated Worker under Wrangler/workerd.
- `pnpm capture:v1` refreshes the asserted production rendering baseline.

## Recovery surfaces

- `legacy-v1/` is an exact archive of production commit `15e3a2037512914900c51c919804f9dd5286089a`.
- `artifacts/v1-baseline/` contains asserted desktop/mobile screenshots, metrics, and hashes.
- `content-drafts/` preserves unpublished material needed by migration.
- `docs/v2/` records route, content, deployment, and rollback decisions.
