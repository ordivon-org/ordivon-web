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
updated: 2026-08-08
summary: Decision separating current Web orientation from project implementation, research evidence, dated publications, generated projections, and historical records.
evidence_status: not_applicable
readiness: READY
applies_to:
  - ordivon-web
related:
  - web.start
  - web.editorial.start
  - web.information-architecture
  - web.publication-system
---
# Web Content Authority

## Context

Ordivon Web contains current editorial guidance, a public project map, research dossiers, dated article sources, generated metadata, route code, and projections of external repository facts. These layers must not collapse into one source of truth.

## Decision

[`../../README.md`](../../README.md) is the canonical repository entry. [`README.md`](README.md) owns the editorial entry and review order. [`information-architecture.md`](information-architecture.md) owns the public hierarchy, project classification, maturity language, linking rules, and historical-correction policy. [`publication-system.md`](publication-system.md) owns the article pipeline.

`content/model.ts` owns Web-authored current orientation that is not source-projected: research Question judgment, remaining editorial project records, and navigation relationships. For a source-projected project, committed inputs under `content/projects/` separate a derived owner snapshot from Web publication judgment. The generated module is build-local and disposable. None of these Web files is authoritative for exact code, tests, release identity, operations, research setup, or raw evidence.

Each article MDX source owns its published argument, publication status, claim class, evidence level, takeaways, limitations, and revision identity. A historical article may preserve a superseded judgment when it displays a visible update and links to the current owner.

Generated metadata, manifests, project modules, feeds, JSON-LD, social cards, sitemap data, static output, and deployment manifests are derived projections. A committed owner snapshot is also derived: it is acceptable only when it records the project manifest plus the canonical public documents declared as dependencies by the owner's current authority map, together with the latest revision touching that envelope and its aggregate digest. Document `lifecycle` and `readiness` remain captured semantics, not generic admission gates: a current authority may intentionally depend on an `accepted` target specification, an `EXPERIMENTAL` architecture, or another non-current document whose relation matters to the current public judgment. The snapshot must remain reproducible from those owner sources. Project repositories own implementation, current boundaries, operations, registration, and release facts. Research records own methods and evidence. Dated audits and phase reports are historical unless a current canonical policy incorporates them.

## Consequences

- Public summaries stay short and link to the actual owner.
- Maturity words cannot substitute for repository evidence.
- Current Project pages may change with the repositories; dated articles retain temporal identity.
- A deleted or rejected layer may remain visible as historical research but cannot appear in the current execution stack.
- Generated output must remain reconstructable from committed source.
- Updating a projected owner snapshot without re-binding the Web publication judgment to its exact revision and digest must fail generation.
- Historical or removal language may name retired concepts; current capability and ownership claims may not silently reassert them.

## Status

Accepted and active. Harness, Security, and Game are source-bound project projections with materially different owner document and lifecycle shapes. Reopen when another project breaks the authority-dependency model, a CMS or external publication owner is introduced, or generated output begins to carry facts not reconstructable from its committed inputs and owner binding.
