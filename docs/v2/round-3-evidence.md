# Round 3 evidence — static Pages release boundary

## Decision

Round 3 replaces the OpenNext request-time Worker with a complete Next.js static export delivered by Cloudflare Pages.

The decision follows the actual workload:

- every project and article route has a finite build-time parameter set;
- Writing filtering is client-side;
- RSS, sitemap, robots, health metadata, Open Graph media, redirects, headers, and the custom 404 are deterministic;
- the site has no request-time data source, mutation, authentication, ISR requirement, database, or server action.

Keeping a full Next server bundle for this workload added a second cache model, Worker deployment limits, approximately 218 transitive packages, and a runtime failure surface without adding a public capability. The exact Round 2 Worker implementation remains recoverable at commit `218b86a24666c7522109af85b0edf0d70d3fb77a`.

## Static output

`pnpm build` produces `out/` with:

- 24 generated routes and support documents;
- 17 canonical public pages listed in the sitemap;
- five project detail pages;
- six article detail pages;
- RSS, sitemap, robots, health JSON, social image, favicon, and custom 404;
- Cloudflare `_redirects` and `_headers` policies.

The output is approximately 3.1 MiB before transport compression. No application Worker bundle is deployed.

## Pages protocol verification

`scripts/verify-static-platform.mjs` runs the export through `wrangler pages dev` and validates:

- 17/17 canonical pages return HTML 200;
- exact canonical URL, description, Open Graph, Twitter, language, H1, IDs, and article JSON-LD;
- all internal paths and same-page anchors resolve;
- RSS contains six articles and uses `application/rss+xml`;
- robots references the sitemap and excludes the MDX proof route;
- health JSON identifies the `static-export` runtime;
- the static social image is valid PNG evidence;
- 14 hashed JS/CSS assets use one-year immutable caching;
- HTML uses `max-age=0, must-revalidate`;
- global CSP, frame, MIME, referrer, permissions, and opener policies are present;
- 30/30 V1 routes return exact permanent redirects;
- an unknown route returns the custom HTML 404.

The current machine-readable result is `artifacts/v2-round3/static-platform.json`.

## Cross-browser verification

Representative pages and interactions were exercised against the Pages surface:

| Runtime | Result |
|---|---:|
| Chromium desktop | 9/9 |
| Firefox desktop | 9/9 |
| Chromium Pixel 7 emulation | 9/9 |
| WebKit desktop | 9/9 |

Total: **36/36 release-browser checks passed**.

The Arch host can run Chromium and Firefox directly. Playwright's fallback WebKit build targets Ubuntu Noble ABIs, so WebKit is run inside the official `mcr.microsoft.com/playwright:v1.62.0-noble` container instead of installing old ICU and WebKitGTK compatibility libraries into the host.

The checks assert HTTP status, visible content, no horizontal overflow, no console errors, no real request failures, Writing filtering, article navigation, anchors, and permanent redirects. Chromium's cancelled same-origin `HEAD` link-prefetch requests are classified separately from real resource failures.

## Lighthouse budgets

Ten Lighthouse audits cover the homepage, project index, Runtime page, Writing index, and longest article on mobile and desktop.

Minimum and worst-case results:

| Measure | Result |
|---|---:|
| Performance | 97 minimum |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| Largest Contentful Paint | 2,038 ms maximum |
| Total Blocking Time | 178 ms maximum |
| Cumulative Layout Shift | 0 across all audits |
| Transfer weight | 156–190 KiB |

The enforced budgets remain in `scripts/audit-lighthouse.mjs`; the current evidence is `artifacts/v2-round3/lighthouse.json`.

## External references

The built site contains 34 distinct external URLs.

- 31 returned HTTP 200;
- three sources returned anti-automation HTTP 403: LawAI, OECD, and UNEP;
- no URL returned 404 or 410;
- no DNS, TLS, or connection failure remained after retry.

Access restrictions are retained as evidence rather than misclassified as broken references. Results are stored in `artifacts/v2-round3/external-links.json`.

## Security and cache policy

Pages applies:

- restrictive Content Security Policy;
- frame denial;
- MIME sniffing protection;
- strict-origin referrer behavior;
- empty camera, microphone, geolocation, payment, and USB permissions;
- same-origin opener isolation;
- immutable hashed assets;
- bounded revalidation for HTML, feeds, metadata, health, icons, and social media.

`upgrade-insecure-requests` was removed because every site-owned URL is already relative and production Pages is HTTPS; retaining it created false HTTPS upgrades against the local HTTP verification surface.

## Hosted preview boundary

The account-hosted Cloudflare Pages preview is created only after the branch commit and CI gates pass. It must remain on the `pages.dev` project domain during Round 3. No `ordivon.com`, `www.ordivon.com`, or `lab.ordivon.com` route, certificate, DNS record, or redirect policy is changed.

## Production boundary

Production remains V1 on GitHub Pages from `main@7c7021796cb3cf4894809d1a3925451050d8a7e5`. Round 3 establishes a release candidate and rehearses cutover and rollback; it does not execute production migration.
