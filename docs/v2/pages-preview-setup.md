# Cloudflare Pages preview setup

The V2 build is ready for account-hosted preview, but the currently connected Cloudflare credential is read-only for Pages. It can list the account and Pages projects, but project creation returns Cloudflare error `10000`.

## Minimum external input

Provide a credential with:

- Account — Cloudflare Pages — Edit;
- access to the account that owns `ordivon.com`;
- no DNS Edit permission required for Round 3.

Either reconnect Cloudflare Control with Pages Edit or expose the standard Wrangler variables only to the deployment process:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

The token should not be committed, written to artifacts, or added to the site bundle.

## Deployment command

From the exact approved candidate commit:

```bash
pnpm install --frozen-lockfile
pnpm check:release
pnpm deploy
```

`pnpm deploy` builds the static export and uploads `out/` to project `ordivon-web-v2-preview` on branch `rebuild/web-v2`.

## Project settings

For Git-integrated Pages, use:

- repository: `zycxfyh/ordivon-web`;
- production branch: `rebuild/web-v2`;
- build command: `pnpm build`;
- output directory: `out`;
- Node version: `.node-version` (`22`);
- no Pages Functions;
- no D1, KV, R2, Queue, or Worker bindings;
- no custom domain during Round 3.

## Mandatory hosted verification

Before recording the preview as complete:

1. deployment commit equals the approved Git head;
2. root, Projects, Runtime, Writing, longest article, RSS, sitemap, robots, health JSON, social image, redirects, and custom 404 pass;
3. `_headers` security and cache policies are present;
4. hosted Lighthouse budgets pass;
5. no `ordivon.com`, `www`, or `lab` DNS or custom-domain setting changes.

The hosted URL and deployment ID belong in `artifacts/v2-round3/hosted-preview.json` only after these checks succeed.
