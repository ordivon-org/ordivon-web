# V2 production cutover runbook

This document defines the production transition from the frozen V1 GitHub Pages origin to a verified V2 Workers Static Assets deployment. It is an execution specification, not authorization by itself.

## Fixed boundaries

- V1 recovery origin: `production/v1-pages@33c97c0409b370db9e8e870a591d5b93cf56b774`.
- GitHub Pages source: `production/v1-pages /`.
- V2 development branch before merge: `rebuild/web-v2`.
- V2 production source after merge: the exact merge commit on `main`.
- V2 service: `ordivon-web-v2-preview`.
- Canonical production host: `https://ordivon.com`.
- `www.ordivon.com` must redirect to the apex.
- `lab.ordivon.com` retains its existing redirect Worker unless separately approved.

## Go / no-go gate

All conditions are mandatory:

1. GitHub Pages independently serves `production/v1-pages@33c97c0`, and its production response matches the captured V1 fingerprint.
2. PR #31 is merged with a merge commit; squash and rebase are not permitted because the source and evidence commits must remain reachable.
3. The exact `main` merge commit passes required `verify` and `release` checks.
4. A clean worktree at that exact merge commit produces a byte-reproducible static export.
5. The deployed Static Assets Version metadata names that exact merge commit.
6. Hosted protocol, browser, metadata, redirect, cache, security-header, RSS, sitemap, 404, compression, and Lighthouse gates pass against the exact deployment.
7. Current apex, `www`, and `lab` DNS/proxy state, Worker routes, GitHub Pages state, settings, and certificates are exported.
8. Rollback to `production/v1-pages` is dry-run from the captured state.
9. No unrelated service, route, setting, or DNS change is included.

Any failed condition is a no-go.

## Pre-cutover capture

Record immediately before the change:

- V1 Pages branch, `main`, Worker Version, Deployment, build manifest, and CI IDs;
- apex, `www`, and `lab` DNS records and proxy state;
- GitHub Pages source and custom-domain state;
- all Worker routes matching the three hosts;
- RUM and Browser Integrity Check state;
- production headers and route matrix;
- certificate status and expiration;
- V1 homepage fingerprint and representative screenshots.

## Cutover sequence

1. Freeze `main`, the deployed Worker Version, and `production/v1-pages`.
2. Re-run all Hosted gates against the exact deployed Version using one `HOSTED_BASE_URL`.
3. Confirm the V1 Pages origin remains independently healthy.
4. Create the narrowest production route for `ordivon.com/*` pointing to the approved Static Assets service.
5. Make only the apex proxy-state adjustment required for the Worker Route; preserve DNS record targets.
6. Verify TLS, exact content identity, compression, and canonical routing before changing `www` behavior.
7. Preserve or recreate the canonical `www` redirect.
8. Leave `lab.ordivon.com` unchanged.
9. Verify every canonical route, all redirects, RSS, sitemap, robots, Open Graph, cache policy, security headers, custom 404, and multiple network paths.
10. Observe error rate, TLS, cache status, and response consistency before declaring completion.

## Immediate rollback triggers

Rollback immediately for TLS or route activation failure, mixed origins, canonical 4xx/5xx responses, redirect drift, CSP/resource failures, invalid publishing endpoints, substantial browser rendering failures, compression loss, or production content differing from the approved deployment.

## Edge transformation guard

Every canonical HTML response must include `Cache-Control: no-transform`. Immutable JavaScript and CSS must not inherit it, because doing so disables useful edge compression. Hosted verification asserts both sides of this boundary. Do not widen CSP to accommodate unexpected edge injection.
