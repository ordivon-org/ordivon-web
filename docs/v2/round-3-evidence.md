# Round 3 evidence — static edge release boundary

## Decision

Round 3 replaces the OpenNext request-time application Worker with a complete Next.js static export delivered by Cloudflare Workers Static Assets.

The decision follows the workload:

- every project and article route has a finite build-time parameter set;
- Writing filtering is client-side;
- RSS, sitemap, robots, health metadata, Open Graph media, redirects, headers, and the custom 404 are deterministic;
- the site has no request-time data source, mutation, authentication, ISR requirement, database, server action, or application module.

Keeping a full Next server bundle added a second cache model, script-size constraints, approximately 218 transitive packages, and a runtime failure surface without adding a public capability. The exact Round 2 OpenNext implementation remains recoverable at `218b86a24666c7522109af85b0edf0d70d3fb77a`.

Workers Static Assets uses a Worker service as the Cloudflare publication identity, but the deployed version contains static assets and no request-time module or service binding.

## Ordivon World correction

While Round 3 was closing, production main merged the architectural correction that retired Link and Edge as independent projects and unified their proven slices under Ordivon World. V2 now presents four maintained state owners, preserves the dated Link/Edge article as migration history, and redirects retired project routes to `/projects/world`. The exact corrected V1 production tree is archived in `legacy-v1-current/`.

## Static output

`pnpm build` produces `out/` with:

- 23 generated routes and support documents;
- 16 canonical public pages listed in the sitemap;
- four project detail pages;
- six article detail pages;
- RSS, sitemap, robots, health JSON, social image, favicon, and custom 404;
- Cloudflare `_redirects` and `_headers` policies.

The output is approximately 3.1 MiB before transport compression.

## Local static-edge verification

`scripts/verify-static-platform.mjs` runs the export through `wrangler dev` and validates:

- 16/16 canonical pages return HTML 200;
- exact canonical URL, description, Open Graph, Twitter, language, H1, IDs, and Article JSON-LD;
- all internal paths and same-page anchors resolve;
- RSS contains six articles and uses `application/rss+xml`;
- robots references the sitemap and excludes the MDX proof route;
- health JSON identifies the `static-export` runtime;
- the static social image is valid PNG evidence;
- 14 hashed JS/CSS assets use one-year immutable caching and explicitly exclude `no-transform`;
- every canonical HTML response uses `max-age=0, must-revalidate, no-transform`;
- global CSP, frame, MIME, referrer, permissions, and opener policies are present;
- 36/36 legacy and migration routes return exact permanent redirects;
- an unknown route returns the custom HTML 404.

Machine-readable result: `artifacts/v2-round3/static-platform.json`.

## Hosted deployment

The existing root-only account token at `/root/.config/ordivon/secrets/cloudflare.json` was correctly reused. It is an active account token with Workers write access. It can read Pages state but cannot create a Pages project; rather than request broader permissions, Round 3 deploys the same static output through the already-authorized Workers Static Assets API.

Hosted identity:

```text
service: ordivon-web-v2-preview
URL: https://ordivon-web-v2-preview.ordivon-lab.workers.dev
```

The final hosted World candidate is `adcb315905a4a42424a27fbe6525d909d29b4021`. Worker version `ec011abc-000b-434b-a76a-e31bff7effb8` is deployed at 100% through deployment `2e7fa67f-eb51-4c49-bda4-5b38cf602ab1`; the full identity is frozen in `artifacts/v2-round3/hosted-preview.json`.

The stable `workers.dev` host has a Cloudflare-managed certificate covering `ordivon-lab.workers.dev` and `*.ordivon-lab.workers.dev`. A temporary `preview.ordivon.com` DNS record and Worker Route used during diagnosis were deleted after `workers.dev` became ready. No production host or route remains changed.

`scripts/verify-hosted-preview.mjs` repeats the complete protocol matrix at the public edge and additionally asserts Cloudflare server identity, `cf-ray`, edge cache behavior, and TLS-backed HTTPS delivery. Result: `artifacts/v2-round3/hosted-platform.json`.

## Cross-browser verification

Representative pages and interactions are exercised on Chromium, Firefox, mobile Chromium, and WebKit.

| Runtime | Local result |
|---|---:|
| Chromium desktop | 11/11 |
| Firefox desktop | 11/11 |
| Chromium Pixel 7 emulation | 11/11 |
| WebKit desktop | 11/11 |

Total: **44/44 local release-browser checks passed**.

The hosted matrix repeats the same 36 checks against the public `workers.dev` deployment. Final result: **44/44 hosted browser checks passed**. On Arch, WebKit runs in the official `mcr.microsoft.com/playwright:v1.62.0-noble` container rather than installing obsolete Ubuntu ABI compatibility libraries into the host.

Checks assert HTTP status, visible content, no horizontal overflow, no console errors, no real request failures, Writing filtering, article navigation, anchors, and permanent redirects. Chromium's cancelled same-origin `HEAD` prefetch requests are separated from real resource failures.

## Lighthouse budgets

Twelve route/device audits cover the homepage, project index, Runtime page, Writing index, and longest article on mobile and desktop. Each audit runs five times, uses an independent Chrome profile for every route/device group, and enforces the median of every score and metric.

Local minimum and worst-case medians:

| Measure | Result |
|---|---:|
| Performance | 99 minimum |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| Largest Contentful Paint | 2,032 ms maximum |
| Total Blocking Time | 25 ms maximum |
| Cumulative Layout Shift | 0 |
| Transfer weight | 153–187 KiB |

The same unchanged budgets are enforced against the hosted edge using independent route/device Chrome profiles. Final hosted medians: Performance 97 minimum, Accessibility/Best Practices/SEO 100/100/100, LCP 1,479 ms maximum, TBT 113 ms maximum, CLS 0, and transfer weight up to 193 KiB. Evidence: `artifacts/v2-round3/lighthouse-hosted.json`.

## External references

The built site contains 33 distinct external URLs:

- 20 returned HTTP 200 through the direct WSL network path;
- 9 first-party GitHub repositories, files, and directories were independently verified through the authenticated GitHub REST API after the direct route became unavailable;
- IAEA, LawAI, OECD, and UNEP returned anti-automation HTTP 403;
- none were broken or missing.

Results: `artifacts/v2-round3/external-links.json` and `artifacts/v2-round3/external-links-first-party.json`.

## Security and cache policy

Workers Static Assets applies:

- restrictive Content Security Policy;
- frame denial;
- MIME sniffing protection;
- strict-origin referrer behavior;
- empty camera, microphone, geolocation, payment, and USB permissions;
- same-origin opener isolation;
- immutable hashed assets;
- bounded revalidation for HTML, feeds, metadata, health, icons, and social media.

`upgrade-insecure-requests` remains omitted because every site-owned URL is relative and the hosted edge is already HTTPS; retaining it creates false upgrades against local HTTP verification.

## Production boundary

Production remains on GitHub Pages from `main@33c97c0409b370db9e8e870a591d5b93cf56b774`, which already carries the World correction. The initial Round 3 release-candidate freeze did not change production.

A later cutover rehearsal briefly proxied the apex and attached V2, proved semantic parity between production and the approved Preview, and then restored the pre-cutover GitHub Pages path before release approval. The current apex records are DNS-only GitHub Pages records, `www` remains the GitHub Pages alias, `lab` retains its redirect Worker, and no apex Worker Route remains. RUM and Browser Integrity Check were restored to their pre-rehearsal values. Account-level and DNS-level raw evidence is retained in a root-only archive; the repository keeps only `artifacts/v2-round3/cutover-rehearsal.json`, a sanitized receipt.

## Edge transformation boundary

Canonical HTML responses declare `Cache-Control: public,max-age=0,must-revalidate,no-transform`. The directive prevents Cloudflare JavaScript Detections and Web Analytics from rewriting approved HTML at the edge, so the strict CSP and zero-console-error browser gate remain valid on custom domains.

The directive is deliberately absent from immutable JavaScript and CSS. Cloudflare does not apply gzip, Brotli, or other edge compression to uncompressed responses carrying `no-transform`; applying it through the global `/*` rule increased hosted transfer weight from roughly 193 KiB to 524–597 KiB. Static and hosted protocol verifiers therefore assert both requirements: every canonical HTML route includes `no-transform`, and every immutable asset excludes it.
