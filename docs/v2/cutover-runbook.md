# V2 production cutover runbook

This document defines the future cutover from the V1 GitHub Pages site to the verified V2 Cloudflare Pages project. It is a rehearsal specification, not authorization to change production.

## Fixed identities

- Current production source: `main@7c7021796cb3cf4894809d1a3925451050d8a7e5`.
- V2 candidate branch: `rebuild/web-v2`.
- V2 hosting project: `ordivon-web-v2-preview`.
- Canonical production host: `https://ordivon.com`.
- `www.ordivon.com` must continue redirecting to the canonical host.
- `lab.ordivon.com` retains its current redirect policy unless separately approved.

## Go / no-go gate

All conditions are mandatory:

1. Candidate commit equals the successful GitHub Actions head.
2. `pnpm check:release` passes in Ubuntu CI.
3. Account-hosted Pages deployment equals the candidate commit.
4. Hosted route, metadata, redirect, cache, security-header, RSS, sitemap, and 404 checks pass.
5. Hosted Lighthouse budgets pass on the project domain.
6. V1 source archive and all artifact hashes verify.
7. Current Cloudflare DNS, Pages custom domains, GitHub Pages settings, and redirect Worker state are exported.
8. Rollback has been dry-run from the captured state.
9. No unrelated repository or DNS change is included.
10. A human explicitly approves the production switch.

Any failed condition is a no-go.

## Pre-cutover capture

Record immediately before the change:

- `main`, candidate, deployment, and CI commit IDs;
- current apex, `www`, and `lab` DNS records and proxy state;
- current GitHub Pages custom-domain state;
- current Cloudflare Worker routes and Pages custom domains;
- production headers and route matrix;
- certificate status and expiration;
- current V1 homepage and representative article screenshots.

## Cutover sequence

1. Freeze content changes to `main` and `rebuild/web-v2`.
2. Re-run the hosted release audit against the exact Pages deployment URL.
3. Add `ordivon.com` to the Pages project without removing the existing production path yet.
4. Wait for Cloudflare custom-domain verification and certificate readiness.
5. Switch only the authoritative apex delivery path to the Pages project.
6. Preserve or recreate the canonical `www` redirect.
7. Leave `lab.ordivon.com` unchanged.
8. Verify the full route matrix from multiple networks and a clean browser profile.
9. Verify canonical, social image, RSS, sitemap, robots, redirect status, cache policy, and custom 404 on the production domain.
10. Observe error rates, TLS, cache status, and response consistency before unfreezing changes.

## Immediate rollback triggers

Rollback without further optimization if any of these appear:

- TLS or custom-domain verification failure;
- apex or `www` intermittently resolves to different origins;
- any canonical public page returns 4xx/5xx;
- V1 routes stop redirecting correctly;
- CSP blocks required first-party scripts or styles;
- RSS, sitemap, robots, Open Graph, or custom 404 becomes invalid;
- substantial browser-specific rendering failure;
- production content differs from the approved deployment.

## Success criteria

Cutover is complete only when:

- all canonical routes serve V2 from Cloudflare Pages;
- V1 redirects remain permanent and exact;
- `www` resolves to the canonical apex behavior;
- `lab` remains on its approved policy;
- release checks pass against `https://ordivon.com`;
- the rollback snapshot and V1 source remain intact.
