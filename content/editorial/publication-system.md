---
schema_version: 1
id: web.publication-system
title: Ordivon Publication System
type: architecture
profile: engineering
lifecycle: active
source_role: canonical
visibility: public
owners:
  - ordivon-web
audience:
  - writer
  - editor
  - builder
  - agent
updated: 2026-08-03
summary: Canonical architecture for authoring, validating, compiling, distributing, revising, and deploying Ordivon publications.
evidence_status: verified
readiness: READY
applies_to:
  - ordivon-web
related:
  - web.editorial.start
  - web.article.the-future-will-not-wait
  - web.authority
---
# Ordivon Publication System

Date: 1 August 2026  
Original baseline: `5d0f28af04787f84261c6038d3ac407bb46221e1`

## Purpose

Publish durable research and engineering arguments that remain scannable, evidence-bounded, revisable, and independently distributable without a CMS or second fact database.

## Boundaries

Article source files own publication identity, argument, limitations, and dated status. Project repositories and research records own the underlying technical and evidentiary facts. Generated manifests, feeds, cards, and page metadata are projections and may not become independent authorities.

## Components

The system consists of MDX article sources, exported publication metadata, the build-local metadata compiler, generated TypeScript review surfaces, validation, reusable article components, static Next.js output, and receipt-bound deployment.

## Data flow

```text
content/articles/<slug>.mdx
├─ exported JSON metadata
├─ complete article body
└─ h2 headings with optional data-toc labels
        ↓ build-local compiler
 generated-metadata.ts + generated-manifest.ts
        ↓
 pages, Atom, sitemap, JSON-LD, social cards, validation
```

The MDX file is the authoring authority. Generated TypeScript files are committed review surfaces and build inputs, not independent facts.

## Publication contract

Each article declares publication status, claim class, evidence level, at least one takeaway, at least one limitation, and temporal identity. E3–E5 publications require a canonical research record. `publishedAt` orders publication history; `revisedAt` records only substantive argument changes.

## Reusable expression

Five flagship publications proved three reusable MDX structures:

- `InBrief`
- `PublicationFigure`
- `ClaimBoundary`

Other proposed primitives remain deleted until repeated use earns them.

## Discovery and deployment

- Atom separates `published` and `updated` and uses related links for canonical evidence.
- Article JSON-LD and independent social images derive from the same article metadata.
- Sitemap last-modified values follow real article or Question dates.
- GitHub Pages receives a tested static Artifact rather than a generated production branch.
- `deploy-manifest.json` binds live output to the full source commit.

## Failure modes

The system fails when generated output diverges from article source, an article overstates its evidence, a current selection points to superseded material, publication metadata loses temporal identity, a public argument becomes a second technical authority, or deployment cannot be bound to an exact tested source revision.

## Verification

Deterministic source, type, lint, build, browser, mobile, and serious/critical accessibility checks run before deployment. Bundle size remains an advisory report until real performance evidence justifies a blocking threshold.

## Deferred

CMS, comments, analytics, multilingual governance, series pages, and full-body normalization remain deferred until actual publication or reader friction supplies a concrete consumer.
