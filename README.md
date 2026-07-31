# Ordivon Web

The public research and engineering interface for Ordivon.

The site is built with Next.js, React, TypeScript, and MDX, exported as static files, and published as a tested GitHub Pages Artifact from the exact `main` commit. Cloudflare remains the authoritative DNS provider; it is not an application runtime for this site.

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
pnpm pages:prepare
```

`pnpm check` runs TypeScript, ESLint, a production build, and the Chromium desktop/mobile smoke suite.

The `Deploy Pages` workflow runs the complete check, materializes historical redirects and the custom-domain files, writes `deploy-manifest.json`, uploads the static Artifact, and deploys it through the protected `github-pages` environment. Recovery is a Git revert or a workflow dispatch for a chosen source revision, followed by the same verified deployment path.

## Content and source of truth

- `content/` owns public structured content and research relationships.
- `app/` owns routes and page composition.
- `components/` owns reusable interfaces and visualizations.
- Project repositories remain authoritative for live source, tests, implementation state, and operational receipts.
- This site provides orientation, dated interpretation, and navigable relationships between those sources.

## Editorial system

`content/editorial/` defines the public positioning, audiences, voice, vocabulary, publication types, claim discipline, and dated interface-copy audits. Start with [`content/editorial/README.md`](content/editorial/README.md).

The editorial layer may frame and interpret the work, but it does not replace repository source, tests, releases, receipts, or operational state.
