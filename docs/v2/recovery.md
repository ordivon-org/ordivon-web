# Recovery boundary

- Production remains `main` at V1 commit `15e3a2037512914900c51c919804f9dd5286089a` until the cutover round.
- V2 work is isolated on `rebuild/web-v2`.
- `legacy-v1/` is a byte-for-byte archive of the complete V1 tree, with `V1-SOURCE-COMMIT` recording its source.
- `artifacts/v1-baseline/` preserves asserted desktop/mobile renderings, metrics, and SHA-256 sums.
- The unpublished acceleration essay is preserved under `content-drafts/the-future-will-not-wait/source.html` and matches commit `bb57ae2534c0cd325b37ff23e398b637bc92663d`.
- No DNS, GitHub Pages, Worker route, or `ordivon.com` production setting changes in Round 1.
- Removing the V2 branch returns development to the untouched production path; production itself requires no rollback.
