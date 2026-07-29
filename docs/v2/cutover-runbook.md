# V2 production cutover runbook

This document defines a future cutover from V1 GitHub Pages to the verified V2 Workers Static Assets service. It is a rehearsal specification, not authorization to change production.

## Fixed identities

- Current production source: `main@7c7021796cb3cf4894809d1a3925451050d8a7e5`.
- V2 candidate branch: `rebuild/web-v2`.
- V2 service: `ordivon-web-v2-preview`.
- Hosted proof: `https://ordivon-web-v2-preview.ordivon-lab.workers.dev`.
- Canonical production host: `https://ordivon.com`.
- `www.ordivon.com` must continue redirecting to the apex.
- `lab.ordivon.com` retains its existing redirect Worker unless separately approved.

## Go / no-go gate

All conditions are mandatory:

1. Candidate commit equals the successful GitHub Actions head.
2. `pnpm check:release` passes in Ubuntu CI.
3. Deployed Static Assets version is built from the candidate content.
4. Hosted protocol, browser, metadata, redirect, cache, security-header, RSS, sitemap, 404, and Lighthouse gates pass.
5. V1 archive and all evidence hashes verify.
6. Current apex, `www`, and `lab` DNS/proxy state, Worker routes, GitHub Pages state, and certificates are exported.
7. Rollback is dry-run from the captured state.
8. No unrelated service, route, or DNS change is included.
9. A human explicitly approves the production switch.

Any failed condition is a no-go.

## Pre-cutover capture

Record immediately before the change:

- `main`, candidate, Worker version, deployment, and CI IDs;
- apex, `www`, and `lab` DNS records and proxy state;
- GitHub Pages custom-domain state;
- all Cloudflare Worker routes matching the three hosts;
- production headers and route matrix;
- certificate status and expiration;
- V1 homepage and representative article screenshots.

## Cutover sequence

1. Freeze changes to `main` and `rebuild/web-v2`.
2. Re-run all hosted gates against the exact `workers.dev` deployment.
3. Create the narrowest production route for `ordivon.com/*` pointing to the approved Static Assets service.
4. Make only the DNS proxy-state adjustment required for the Worker Route; preserve record targets until the route is proven.
5. Verify TLS and apex routing before modifying `www` behavior.
6. Preserve or recreate the canonical `www` redirect.
7. Leave `lab.ordivon.com` unchanged.
8. Verify every canonical route, all V1 redirects, RSS, sitemap, robots, Open Graph, cache policy, security headers, and custom 404 from multiple networks.
9. Observe error rates, TLS, cache status, and response consistency before unfreezing changes.

## Immediate rollback triggers

Rollback immediately for:

- TLS or route activation failure;
- inconsistent apex resolution or mixed origins;
- any canonical public page returning 4xx/5xx;
- V1 redirects becoming incorrect;
- first-party resources blocked by CSP;
- invalid RSS, sitemap, robots, Open Graph, or 404 behavior;
- substantial browser-specific rendering failure;
- production content differing from the approved deployment.

## Success criteria

Cutover is complete only when all canonical routes serve the approved V2 deployment, V1 redirects remain exact, `www` remains canonical, `lab` remains unchanged, production hosted gates pass, and the rollback snapshot remains intact.
