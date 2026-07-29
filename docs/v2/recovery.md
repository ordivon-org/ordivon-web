# Recovery boundary

- Production remains `main` at the recorded V1 commit until the cutover round.
- V2 work is isolated on `rebuild/web-v2-round1`.
- The complete V1 repository-root site is preserved under `legacy-v1/` in the V2 branch and remains available in Git history.
- The unpublished acceleration essay is preserved under `content-drafts/the-future-will-not-wait/source.html`.
- Removing the V2 branch restores the repository to the untouched production path; no DNS rollback is required.
- Cloudflare temporary deployment failed before Worker publication and created no production route.
