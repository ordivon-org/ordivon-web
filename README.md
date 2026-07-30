# Ordivon Web

The public research and engineering interface for Ordivon.

The site is built with Next.js, React, TypeScript, and MDX, exported as static files, and published from the `production/v1-pages` branch through GitHub Pages. Cloudflare remains the authoritative DNS provider; it is not an application runtime for this site.

## Runtime shape

```text
structured content + React components
                ↓
          Next.js build
                ↓
          out/ static export
                ↓
      GitHub Pages + custom domain
```

There is no request-time application server, database, CMS, ISR cache, Worker, D1, KV, R2, Queue, or service binding.

## Commands

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm build
pnpm preview
pnpm check
pnpm deploy
```

`pnpm check` runs TypeScript, ESLint, a production build, and the Chromium desktop/mobile smoke suite.

`pnpm deploy` refuses dirty or unmerged source, rebuilds the exact `origin/main` revision, replaces the contents of `production/v1-pages`, preserves the `ordivon.com` custom-domain claim, and materializes the small set of historical route redirects. GitHub Pages then publishes that branch. Recovery is a Git revert on `main` followed by another deployment.

## Content and source of truth

- `content/` owns public structured content and research relationships.
- `app/` owns routes and page composition.
- `components/` owns reusable interfaces and visualizations.
- Project repositories remain authoritative for live source, tests, implementation state, and operational receipts.
- This site provides orientation, dated interpretation, and navigable relationships between those sources.
