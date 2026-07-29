# V1 production baseline

- Canonical production source: `main` at `15e3a2037512914900c51c919804f9dd5286089a`.
- Production URL: `https://ordivon.com`.
- Publishing system: repository-root static HTML on GitHub Pages.
- DNS authority: Cloudflare.
- Main public surfaces: Home, Projects, Notes, Now, About, Contact, five project pages, and five published records.
- Existing checks: dependency-free HTML contract, Playwright, axe, external-link sampling, and informational Lighthouse output.

Production remains unchanged during V2 development. The old implementation is retained under `legacy-v1/` and screenshots under `artifacts/v1-baseline/`.
