# Ordivon Web

The public research and engineering interface for Ordivon.

The site is built with Next.js, React, TypeScript, and MDX, exported as static assets, and deployed through Cloudflare Workers Static Assets. The runtime remains intentionally simple; the browser experience is free to become visual, interactive, and exploratory.

## Runtime shape

```text
structured content + React components
                ↓
          Next.js build
                ↓
          out/ static export
                ↓
 Cloudflare Workers Static Assets
```

There is no request-time application server, database, CMS, ISR cache, D1, KV, R2, Queue, or service binding.

## Commands

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm build
pnpm preview
pnpm check
pnpm deploy
```

`pnpm check` runs TypeScript, ESLint, a production build, and the Chromium desktop/mobile smoke suite. Release recovery is Git-based: revert to a known commit and redeploy rather than maintaining a second governance system inside the repository.

## Content and source of truth

- `content/` owns public structured content and research relationships.
- `app/` owns routes and page composition.
- `components/` owns reusable interfaces and visualizations.
- Project repositories remain authoritative for live source, tests, implementation state, and operational receipts.
- This site provides orientation, dated interpretation, and navigable relationships between those sources.
