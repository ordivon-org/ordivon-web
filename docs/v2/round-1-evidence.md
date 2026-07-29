# Round 1 evidence

## Frozen inputs

- Production V1 commit: `7c7021796cb3cf4894809d1a3925451050d8a7e5`.
- Complete V1 tree: `legacy-v1/`, verified against a fresh Git archive manifest.
- V1 rendering baseline: eight asserted full-page desktop/mobile screenshots under `artifacts/v1-baseline/`.
- Published acceleration essay: included in `legacy-v1/notes/the-future-will-not-wait/` from the current production commit.

## Runtime proof

- Next.js App Router 16.2.12 builds with React 19.2.8 and TypeScript 6.0.2.
- Local MDX compiles as a Server Component through the webpack production path.
- Static pages, a dynamic request-time route, metadata, an Open Graph image, redirects, and a custom 404 build together.
- OpenNext Cloudflare 1.20.2 generates `.open-next/worker.js` successfully.
- The generated bundle runs under Wrangler 4.115.0 and local `workerd`.
- `workerd` returns 200 for `/`, `/projects`, `/writing`, `/preview-mdx`, `/opengraph-image`, and `/api/health`; `/work` returns a permanent redirect.
- Desktop and mobile Playwright smoke tests pass: 12/12.
- TypeScript, ESLint, production dependency audit, Next production build, OpenNext build, and process cleanup pass.
- The production dependency audit reports no known vulnerabilities after narrow overrides to patched `postcss` and `sharp` versions inherited from Next 16.2.12.

## Build sizes

- `.next`: approximately 253 MiB.
- `.open-next`: approximately 37 MiB.
- `node_modules`: approximately 838 MiB.
- Wrangler upload measurement: approximately 6.9 MiB raw / 1.72 MiB compressed.

These sizes were accepted during validation rather than optimized away. The generated directories are excluded from Git and can be reproduced with `pnpm install`, `pnpm build`, and `pnpm build:worker`; the durable recovery evidence is committed separately.

## Cloudflare boundary

An anonymous temporary-account deployment accepted all static assets but rejected the Worker because that temporary flow applies a 1 MiB compressed-script limit. The connected Cloudflare account was separately verified as Workers Free; Cloudflare's current documented Free Worker size limit is 3 MB, above the measured 1.72 MiB bundle.

Round 1 deliberately does not authenticate the local Wrangler process to production or attach a Worker route. Local `workerd` proves runtime compatibility; an account-hosted preview belongs to the deployment/cutover round, where it can be created without changing `ordivon.com` traffic.

## Compatibility decisions

- Use webpack for Next 16 MDX builds until the Turbopack/MDX production path is independently verified.
- Keep Open Graph generation on the default runtime. Explicit Edge Runtime requires a separate OpenNext function and adds no Round 1 value.
- Pin direct dependencies and use targeted pnpm overrides for `next@16.2.12>postcss` and `next@16.2.12>sharp`.
- Declare pnpm build-script permissions for `esbuild`, `sharp`, `unrs-resolver`, and `workerd`.
