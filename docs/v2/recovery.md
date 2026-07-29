# Recovery boundary

- Production remains V1 on `main`; the current production commit is `33c97c0409b370db9e8e870a591d5b93cf56b774` until the cutover round.
- V2 work is isolated on `rebuild/web-v2`.
- `legacy-v1/` preserves the original Round 1 V1 tree at `7c70217`. `legacy-v1-current/` preserves the exact current V1 tree at `33c97c0`, after World replaced Link and Edge.
- `artifacts/v1-baseline/` preserves asserted desktop/mobile renderings, metrics, and SHA-256 sums.
- The newly published acceleration essay and its corrected research link are included in the current V1 archive.
- Production DNS, GitHub Pages, `ordivon.com`, `www`, and `lab` remain unchanged. Round 3 creates only an isolated `workers.dev` preview identity; a temporary diagnostic `preview.ordivon.com` record and route were removed before closeout.
- Removing the V2 branch returns development to the untouched production path; production itself requires no rollback.

- Round 3 static-export plus Workers Static Assets state is the active V2 candidate; the Round 2 OpenNext state remains recoverable at `218b86a24666c7522109af85b0edf0d70d3fb77a`.
- Production cutover and rollback procedures are frozen in `cutover-runbook.md` and `rollback-runbook.md`; neither runbook authorizes execution by itself.
