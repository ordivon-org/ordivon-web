---
schema_version: 1
id: web.start
title: Ordivon Web
type: start
profile: organization
lifecycle: active
source_role: canonical
visibility: public
owners:
  - ordivon-web
audience:
  - reader
  - builder
  - publisher
  - agent
updated: 2026-08-08
summary: Canonical repository entry for the public Ordivon publication surface, static build, and source-of-truth boundary.
evidence_status: not_applicable
readiness: READY
applies_to:
  - ordivon-web
related:
  - web.editorial.start
  - web.publication-system
  - web.agent-web-system
  - web.design-system
  - web.aesthetic-research
  - web.authority
---
# Ordivon Web

## Purpose

The public research, engineering, and design interface for Ordivon—and the static publication target of an Agent-native Web workflow.

The site is built with Next.js, React, TypeScript, MDX, and machine-readable design context, exported as static files, and published as a tested GitHub Pages Artifact from the exact `main` commit. Cloudflare remains the authoritative DNS provider; it is not an application runtime for this site.

## Current boundary

Ordivon Web owns public navigation, presentation, dated interpretation, publication policy, and the design context used to generate the human-facing site. Project repositories remain authoritative for implementation, research evidence, releases, tests, receipts, registration, and live operational state. Agent generation may propose or compose public changes, but it cannot overwrite those owner boundaries.

## Start here

- Read [`content/editorial/agent-web-system.md`](content/editorial/agent-web-system.md) for the Agent-native observe → judge → generate → preview → verify → promote loop.
- Read [`content/editorial/README.md`](content/editorial/README.md) for editorial authority and review order.
- Read [`design/README.md`](design/README.md) for design authority and [`design/aesthetic-research.md`](design/aesthetic-research.md) for visual experiments.
- Run `pnpm agent:context` for the current machine-readable Web/design entry context.
- Use `pnpm check` before treating a source revision as publishable.

## Runtime shape

```text
owner/publication sources + design context
                ↓
        Agent judgment / composition
                ↓
     deterministic local generation
                ↓
       Next.js static candidate
                ↓
       verification + promotion
                ↓
      GitHub Pages + custom domain
```

There is no request-time application server, database, CMS, ISR cache, Worker, D1 database, KV storage, Cloudflare object storage, Queue, or service binding.

## Commands

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm build
pnpm preview
pnpm agent:context
pnpm design:check
pnpm check
pnpm pages:prepare
```

`pnpm check` runs TypeScript, ESLint, a production build, and the Chromium desktop/mobile smoke suite.

The `Deploy Pages` workflow runs the complete check, materializes historical redirects and the custom-domain files, writes `deploy-manifest.json`, uploads the static Artifact, and deploys it through the protected `github-pages` environment. Recovery is a Git revert or a workflow dispatch for a chosen source revision, followed by the same verified deployment path.

## Content and source of truth

- `content/` owns public structured content, editorial policy, source-bound publication judgment, and research relationships.
- `design/` owns machine-readable root tokens, Agent design context, benchmark surfaces, and aesthetic research method.
- `app/` owns routes and page composition.
- `components/` owns reusable interface implementation and visualizations.
- Project repositories remain authoritative for live source, tests, implementation state, registration, and operational receipts.
- Generated CSS, TypeScript projections, manifests, static pages, and Agent context reports remain rebuildable projections of those committed inputs.

## Editorial system

`content/editorial/` defines the public positioning, audiences, voice, vocabulary, publication types, claim discipline, and dated interface-copy audits. Start with [`content/editorial/README.md`](content/editorial/README.md).

The editorial layer may frame and interpret the work, but it does not replace repository source, tests, releases, receipts, or operational state.

## Project family

- [Public site](https://ordivon.com/) — current public orientation, project map, research dossiers, and dated publications.
- [Cross-project map](https://github.com/zycxfyh/ordivon-computing/blob/main/projects/README.md) — stable roles, repository links, and authority entry points for all nine repositories.
- [`content/editorial/information-architecture.md`](content/editorial/information-architecture.md) defines how Web summarizes repository facts without becoming a second implementation authority.
