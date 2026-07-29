# V1 production baseline

- Canonical production source: `main` at `15e3a2037512914900c51c919804f9dd5286089a`.
- Production URL: `https://ordivon.com`.
- Publishing system: repository-root static HTML on GitHub Pages.
- DNS authority: Cloudflare.
- Browser: Playwright Chromium.
- Viewports: 1440×1000 desktop; Pixel 7 mobile emulation.
- Validity gate: HTTP 200, Ordivon title, visible H1, and at least 100 rendered words.

| Mode | Route | Page length | Words | Overflow |
|---|---|---:|---:|---:|
| desktop | `/` | 6.4 viewports | 620 | 0px |
| desktop | `/work/` | 5.9 viewports | 667 | 0px |
| desktop | `/work/ordivon-runtime/` | 9.3 viewports | 816 | 0px |
| desktop | `/notes/runtime-after-core/` | 6.8 viewports | 1158 | 0px |
| mobile | `/` | 10.2 viewports | 615 | 0px |
| mobile | `/work/` | 9.9 viewports | 662 | 0px |
| mobile | `/work/ordivon-runtime/` | 13.3 viewports | 811 | 0px |
| mobile | `/notes/runtime-after-core/` | 10.5 viewports | 1153 | 0px |

The complete V1 tree is stored under `legacy-v1/`; full-page screenshots and SHA-256 sums are stored under `artifacts/v1-baseline/`.
