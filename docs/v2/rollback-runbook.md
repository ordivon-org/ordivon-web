# V2 production rollback runbook

Rollback removes the apex V2 Worker Route and returns traffic to the independently frozen V1 GitHub Pages origin. Restoration takes priority over diagnosis.

## Recovery anchors

- V1 production source: `production/v1-pages@33c97c0409b370db9e8e870a591d5b93cf56b774`.
- GitHub Pages source: `production/v1-pages /`.
- Exact V1 tree: `legacy-v1-current/`.
- V1 visual baseline: `artifacts/v1-baseline/`.
- Current approved V2 identity: `artifacts/v2-round3/hosted-preview.json` and the latest release manifest.
- Pre-cutover DNS, route, Pages, settings, certificate, and header export.

## Fast rollback

1. Stop additional deployments and content changes.
2. Remove or disable the `ordivon.com/*` route to the V2 Static Assets service.
3. Restore the exact pre-cutover apex proxy state and `www` redirect configuration.
4. Confirm GitHub Pages still publishes `production/v1-pages@33c97c0` with its approved custom domain.
5. Purge only paths whose delivery route changed.
6. Verify apex TLS and canonical redirect behavior.
7. Test the V1 homepage, Projects, Runtime, Notes, representative article, `www`, and `lab`.
8. Compare production H1, byte fingerprint, and screenshots with the V1 baseline.
9. Record rollback time, trigger, restored configuration, and remaining uncertainty.

## Verification after rollback

- `https://ordivon.com` returns the captured V1 fingerprint;
- representative V1 Work and Notes routes return expected content;
- `www` redirects correctly;
- `lab` retains its prior policy;
- no production request reaches the V2 service;
- GitHub Pages source remains `production/v1-pages /`;
- certificate status is healthy;
- V1 archive hashes pass.

Do not attempt another cutover until the trigger is reproduced, fixed, deployed to a fresh Version, fully reverified, and explicitly accepted.
