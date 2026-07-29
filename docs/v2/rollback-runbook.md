# V2 production rollback runbook

Rollback restores the known V1 GitHub Pages site and its prior Cloudflare routing. It must prefer exact restoration over diagnosis during an outage.

## Recovery anchors

- V1 production source: `7c7021796cb3cf4894809d1a3925451050d8a7e5`.
- Exact V1 tree: `legacy-v1/`.
- V1 visual baseline: `artifacts/v1-baseline/`.
- Round 2 OpenNext candidate, if needed for architecture comparison: `218b86a24666c7522109af85b0edf0d70d3fb77a`.
- Pre-cutover DNS, Pages, GitHub Pages, certificate, and route export captured by the cutover runbook.

## Fast rollback

1. Stop additional deployments and content changes.
2. Remove or disable the Pages custom-domain binding for `ordivon.com`.
3. Restore the exact pre-cutover apex and `www` DNS / redirect configuration.
4. Confirm GitHub Pages still publishes `main@7c70217` with the previous custom-domain state.
5. Purge Cloudflare cache only for paths whose origin changed.
6. Verify apex TLS and canonical redirect behavior.
7. Test V1 homepage, Projects, Runtime, Notes, representative article, `www`, and `lab` routes.
8. Compare production H1, word count, and screenshots against the V1 baseline.
9. Record the rollback time, trigger, restored configuration, and remaining uncertainty.

## Repository rollback

Production recovery does not require reverting the V2 branch. If the candidate branch itself must return to the Round 2 state:

```bash
git switch rebuild/web-v2
git reset --hard 218b86a24666c7522109af85b0edf0d70d3fb77a
```

Do not rewrite the remote branch during production incident response unless repository corruption is the incident. Prefer a new corrective commit or preserve the candidate for investigation.

## Verification after rollback

Mandatory checks:

- `https://ordivon.com` returns the V1 title and homepage H1;
- `/work/ordivon-runtime/` and `/notes/the-future-will-not-wait/` return V1 content;
- `www` redirects correctly;
- `lab` retains its pre-cutover policy;
- GitHub Pages and certificate status are healthy;
- no production request reaches the V2 Pages project;
- V1 archive hashes still pass.

## Post-incident rule

Do not attempt another cutover until the trigger has a reproduced cause, a bounded fix, a new hosted preview, a full release run, and explicit approval.
