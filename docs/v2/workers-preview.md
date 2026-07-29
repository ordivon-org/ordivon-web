# Cloudflare Workers Static Assets preview

## Identity

- Service: `ordivon-web-v2-preview`
- Account subdomain: `ordivon-lab`
- Stable URL: `https://ordivon-web-v2-preview.ordivon-lab.workers.dev`
- Source branch: `rebuild/web-v2`
- Output directory: `out`
- Runtime module: none

## Credentials

Deployment accepts standard Wrangler variables:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

On the Ordivon workstation, `scripts/deploy-workers-preview.mjs` can load the existing root-only file `/root/.config/ordivon/secrets/cloudflare.json`. The file remains outside Git, site output, logs, and evidence artifacts.

## Deployment

```bash
pnpm install --frozen-lockfile
pnpm check:release
pnpm deploy
```

`pnpm deploy` builds `out/` and uploads it to the isolated Static Assets service. It does not create a custom domain, DNS record, or Worker Route.

## Mandatory verification

```bash
pnpm verify:hosted
pnpm test:cross-browser:hosted:host
pnpm test:webkit:hosted
pnpm audit:lighthouse:hosted
```

The hosted candidate is accepted only when:

1. deployed version metadata identifies the approved Git candidate;
2. all 17 canonical routes, 30 redirects, 14 immutable assets, RSS, sitemap, robots, health JSON, social image, security headers, and 404 pass;
3. Chromium, Firefox, mobile Chromium, and WebKit pass the public-edge matrix;
4. hosted Lighthouse medians satisfy the unchanged budgets;
5. `ordivon.com`, `www`, and `lab` remain on their previous production configuration.
