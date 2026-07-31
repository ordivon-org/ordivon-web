# Ordivon Publication System — Current Architecture

Date: 1 August 2026  
Original baseline: `5d0f28af04787f84261c6038d3ac407bb46221e1`

## Objective

Publish durable research and engineering arguments that remain scannable, evidence-bounded, revisable, and independently distributable without a CMS or second fact database.

## Current source path

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

## Acceptance boundary

Deterministic source, type, lint, build, browser, mobile, and serious/critical accessibility checks run before deployment. Bundle size remains an advisory report until real performance evidence justifies a blocking threshold.

## Deferred

CMS, comments, analytics, multilingual governance, series pages, and full-body normalization remain deferred until actual publication or reader friction supplies a concrete consumer.
