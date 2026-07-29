# Ordivon Web V2

Round 1 rebuild branch for the Ordivon public narrative, research publishing, visualization, and evidence-navigation surface.

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm test:smoke
```

`pnpm preview` builds through OpenNext and runs in Cloudflare's `workerd`-compatible local environment. Production remains served from `main` until the V2 cutover round.

- `legacy-v1/` preserves the current static production implementation.
- `content-drafts/` preserves unpublished content needed by migration.
- `docs/v2/` records route, content, deployment, and rollback baselines.
