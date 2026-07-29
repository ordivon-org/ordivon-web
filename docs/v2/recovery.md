# Recovery boundary

- Production remains `main` at V1 commit `7c7021796cb3cf4894809d1a3925451050d8a7e5` until the cutover round.
- V2 work is isolated on `rebuild/web-v2`.
- `legacy-v1/` is a byte-for-byte archive of the complete V1 tree, with `V1-SOURCE-COMMIT` recording its source.
- `artifacts/v1-baseline/` preserves asserted desktop/mobile renderings, metrics, and SHA-256 sums.
- The newly published acceleration essay and its corrected research link are included in the current V1 archive.
- No DNS, GitHub Pages, Pages custom domain, Worker route, or `ordivon.com` production setting changes in Rounds 1–3.
- Removing the V2 branch returns development to the untouched production path; production itself requires no rollback.

- Round 3 static-export state is the active V2 candidate; the Round 2 OpenNext state remains recoverable at `218b86a24666c7522109af85b0edf0d70d3fb77a`.
- Production cutover and rollback procedures are frozen in `cutover-runbook.md` and `rollback-runbook.md`; neither runbook authorizes execution by itself.
