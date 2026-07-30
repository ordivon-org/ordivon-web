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
HOSTED_BASE_URL=https://<verified-host> pnpm check:hosted
```

All Hosted sub-gates consume the same `HOSTED_BASE_URL`. When it is omitted they use the stable `workers.dev` service URL.


When the workstation network path cannot resolve the stable `workers.dev` hostname correctly, the same deployed version may be verified through a narrowly scoped temporary custom hostname. The hostname must be independently named, mapped only to this service, recorded as verification transport, and removed immediately after the full protocol/browser/Lighthouse matrix. It must never reuse the apex, `www`, or `lab`.

The hosted candidate is accepted only when:

1. deployed version metadata identifies the approved Git candidate;
2. all content-derived canonical routes, every declared redirect, every referenced immutable asset, RSS, sitemap, robots, health JSON, social image, security headers, and 404 pass;
3. Chromium, Firefox, mobile Chromium, and WebKit pass the public-edge matrix;
4. hosted Lighthouse medians satisfy the unchanged budgets;
5. `ordivon.com`, `www`, and `lab` remain on their previous production configuration.
