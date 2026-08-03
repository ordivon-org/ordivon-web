---
schema_version: 1
id: web.authority
title: Web Content Authority
type: decision
profile: engineering
lifecycle: active
source_role: canonical
visibility: public
owners:
  - ordivon-web
audience:
  - maintainer
  - editor
  - builder
  - agent
updated: 2026-08-03
summary: Decision separating Web publication authority from project, research, generated, and historical sources.
evidence_status: not_applicable
readiness: READY
applies_to:
  - ordivon-web
related:
  - web.start
  - web.editorial.start
  - web.publication-system
---
# Web Content Authority

## Context

Ordivon Web contains current editorial guidance, dated interface audits, article sources, generated metadata, route code, and public projections of external project records. These layers must not collapse into one source of truth.

## Decision

[`../../README.md`](../../README.md) is the canonical repository entry. [`README.md`](README.md) owns the editorial entry and review order. [`publication-system.md`](publication-system.md) owns the publication architecture. Positioning, audiences, voice, vocabulary, article types, and claim policy are canonical editorial policies within their declared scope.

Each article MDX source owns its published argument, publication status, claim class, evidence level, takeaways, limitations, and revision identity. `content/articles/the-future-will-not-wait.mdx` is the first explicitly identified P1 flagship derived publication. Its `canonicalResearchRecord` points to the Computing research record; the article does not redefine that record.

Generated metadata, manifests, feeds, JSON-LD, social cards, sitemap data, static output, and deployment manifests are derived or generated projections. Project repositories own implementation and release facts. Research records own experimental setup and evidence. Dated audits and phase reports are historical evidence unless a current canonical policy explicitly incorporates them.

## Consequences

Strict content management begins with the repository entry, editorial entry, publication architecture, and this authority decision. Existing article metadata remains the article publication contract; P1 does not add a second YAML front matter system to MDX. New stable editorial architecture must use stable paths rather than dates or round codes.

## Status

Accepted and active. Reopen when the article source format changes, a CMS or external publication owner is introduced, or generated output begins to carry facts not reconstructable from source.
