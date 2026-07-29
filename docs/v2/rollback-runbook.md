# V2 production rollback runbook

Rollback restores the known V1 GitHub Pages path and exact pre-cutover Cloudflare configuration. During an outage, restoration takes priority over diagnosis.

## Recovery anchors

- V1 production source: `7c7021796cb3cf4894809d1a3925451050d8a7e5`.
- Exact V1 tree: `legacy-v1/`.
- V1 visual baseline: `artifacts/v1-baseline/`.
- Round 2 OpenNext comparison point: `218b86a24666c7522109af85b0edf0d70d3fb77a`.
- Round 3 Worker versions and deployment IDs: `artifacts/v2-round3/hosted-preview.json`.
- Pre-cutover DNS, route, GitHub Pages, certificate, and header export.

## Fast rollback

1. Stop additional deployments and content changes.
2. Remove or disable the `ordivon.com/*` route to the V2 Static Assets service.
3. Restore the exact pre-cutover proxy state and apex/`www` redirect configuration.
4. Confirm GitHub Pages still publishes `main@7c70217` with its previous custom-domain state.
5. Purge only paths whose delivery route changed.
6. Verify apex TLS and canonical redirect behavior.
7. Test V1 homepage, Projects, Runtime, Notes, representative article, `www`, and `lab`.
8. Compare production H1, word count, and screenshots with the V1 baseline.
9. Record rollback time, trigger, restored configuration, and remaining uncertainty.

## Repository rollback

Production recovery does not require changing the V2 branch. To restore the Round 2 development state for investigation:

```bash
git switch rebuild/web-v2
git reset --hard 218b86a24666c7522109af85b0edf0d70d3fb77a
```

Do not rewrite the remote branch during incident response unless repository corruption is itself the incident.

## Verification after rollback

- `https://ordivon.com` returns the V1 title and homepage H1;
- `/work/ordivon-runtime/` and `/notes/the-future-will-not-wait/` return V1 content;
- `www` redirects correctly;
- `lab` retains its prior policy;
- no production request reaches `ordivon-web-v2-preview`;
- GitHub Pages and certificate status are healthy;
- V1 archive hashes pass.

Do not attempt another cutover until the trigger is reproduced, fixed, deployed to a fresh hosted version, fully reverified, and explicitly approved.
