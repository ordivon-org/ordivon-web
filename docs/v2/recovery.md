# Recovery boundary

- Production remains V1 on `main`; the current production commit is `33c97c0409b370db9e8e870a591d5b93cf56b774` until the cutover round.
- V2 work is isolated on `rebuild/web-v2`.
- `legacy-v1/` preserves the original Round 1 V1 tree at `7c70217`. `legacy-v1-current/` preserves the exact current V1 tree at `33c97c0`, after World replaced Link and Edge.
- `artifacts/v1-baseline/` preserves asserted desktop/mobile renderings, metrics, and SHA-256 sums.
- The newly published acceleration essay and its corrected research link are included in the current V1 archive.
- Production currently remains on GitHub Pages at `main@33c97c0`. A later cutover rehearsal briefly attached V2, then restored the captured apex, `www`, `lab`, GitHub Pages, Cloudflare RUM, and Browser Integrity Check baseline before release approval.
- The stable candidate remains isolated on its `workers.dev` service. Temporary diagnostic and verification hostnames (`preview.ordivon.com` and `v2-verify-20260730.ordivon.com`) were removed with zero DNS records and Worker Routes remaining.
- Removing the V2 branch returns development to the restored production path; the private raw rehearsal archive and sanitized receipt preserve the rollback evidence.

- Round 3 static-export plus Workers Static Assets state is the active V2 candidate; the Round 2 OpenNext state remains recoverable at `218b86a24666c7522109af85b0edf0d70d3fb77a`.
- Production cutover and rollback procedures are frozen in `cutover-runbook.md` and `rollback-runbook.md`; neither runbook authorizes execution by itself.
