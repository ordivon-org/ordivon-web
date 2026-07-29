# Round 1 evidence

## Proven

- Next.js App Router 16.2.12 builds with React 19 and TypeScript 6.
- Local MDX compiles as a Server Component using the webpack production path.
- Static pages, a dynamic request-time route, metadata, a generated Open Graph image, redirects, and a custom 404 build together.
- OpenNext Cloudflare 1.20.2 generates `.open-next/worker.js` successfully.
- The generated bundle runs under local Wrangler/workerd.
- `/`, `/preview-mdx`, `/opengraph-image`, and `/api/health` return successful responses in workerd.
- Desktop and mobile Playwright smoke tests passed: 12/12.
- TypeScript, ESLint, pnpm peer validation, and the Next production build pass.

## Build sizes

- `.next`: approximately 253 MiB.
- `.open-next`: approximately 37 MiB.
- `node_modules`: approximately 838 MiB.
- Temporary deploy upload: approximately 6.9 MiB raw / 1.72 MiB gzip.

These local resources are intentionally retained. Recoverability and verification coverage take priority over minimizing disk usage.

## Public preview boundary

A Cloudflare temporary-account deployment uploaded all static assets but rejected the Worker because that temporary account allows a 1 MiB compressed Worker and the OpenNext bundle is approximately 1.72 MiB compressed. The repository has no Cloudflare deployment secrets and local Wrangler is not authenticated to the production account. No production DNS, Worker, Pages project, or `ordivon.com` route was changed.

This is an external credential/plan boundary rather than a framework or runtime failure. Formal preview deployment remains the only unfinished external proof in Round 1; local workerd execution proves the generated Worker itself runs.

## Compatibility decisions

- Use webpack for Next 16 MDX builds until the Turbopack/MDX production path is verified independently.
- Keep Open Graph generation on the default Worker runtime. Explicit Edge Runtime requires separate OpenNext function configuration and is unnecessary for V2 Round 1.
- pnpm build-script permissions are declared in `pnpm-workspace.yaml` for `esbuild`, `sharp`, `unrs-resolver`, and `workerd`.
