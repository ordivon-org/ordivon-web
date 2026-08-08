---
schema_version: 1
id: web.editorial.start
title: Ordivon Editorial System
type: start
profile: organization
lifecycle: active
source_role: canonical
visibility: public
owners:
  - ordivon-web
audience:
  - writer
  - editor
  - reviewer
  - agent
updated: 2026-08-08
summary: Canonical entry to Agent-native Web management, public information architecture, positioning, publication discipline, design authority, and review boundaries.
evidence_status: not_applicable
readiness: READY
applies_to:
  - ordivon-web
related:
  - web.information-architecture
  - web.publication-system
  - web.agent-web-system
  - web.design-system
  - web.aesthetic-research
  - web.authority
---
# Ordivon Editorial System

Status: canonical editorial guidance for `ordivon-web`  
Applies to: interface copy, project summaries, metadata, articles, release notes, research reports, diagrams, feeds, social cards, and repository-facing publication copy.

## Purpose

Ordivon Web is the public orientation and publication layer for a family of infrastructure, application, capability, and research projects. It must make the whole map understandable without turning summaries into a second implementation authority.

The editorial system prevents three failures:

1. vague promotion that hides maturity and limitations;
2. technically correct internal language that makes readers reconstruct the value themselves; and
3. current pages or old articles that drift from the owning repositories.

> Bold in judgment. Precise in evidence. Plain before technical. Current status before historical detail.

## Start here

- [`agent-web-system.md`](./agent-web-system.md) — Agent-native observation, judgment, generation, preview, verification, and promotion.
- [`information-architecture.md`](./information-architecture.md) — page hierarchy, project map, maturity language, linking, and historical corrections.
- [`positioning.md`](./positioning.md) — what Ordivon is, why it matters, and the message hierarchy.
- [`audiences.md`](./audiences.md) — primary readers, their questions, and appropriate entry paths.
- [`voice.md`](./voice.md) — sentence-level tone, rhythm, calls to action, and examples.
- [`vocabulary.md`](./vocabulary.md) — current project definitions, ownership terms, capitalization, and status language.
- [`article-types.md`](./article-types.md) — publication taxonomy, required structure, and selection rules.
- [`claim-policy.md`](./claim-policy.md) — evidence obligations, limitations, corrections, and marketing boundaries.
- [`publication-system.md`](./publication-system.md) — implemented authoring, validation, distribution, and deployment architecture.
- [`authority.md`](./authority.md) — ownership of current summaries, dated articles, repository facts, research evidence, design context, and generated projections.
- [`../../design/README.md`](../../design/README.md) — machine-readable design context and reusable visual primitives.
- [`../../design/aesthetic-research.md`](../../design/aesthetic-research.md) — method for bounded human-facing visual experiments.

Dated audits and phase reports remain historical evidence. They are not part of the current reading order unless a new review explicitly needs their baseline.

## Editorial sequence

Every important public surface should answer these questions in order:

1. **What is this and why does it matter?**
2. **What exists today?**
3. **What is its actual maturity or status?**
4. **Which project owns the exact facts?**
5. **What evidence supports the public judgment?**
6. **What remains uncertain or historical?**
7. **Where should the reader go next?**

## Current boundary

Agents may observe, interpret, compose, and manage public changes. Neither their generated copy nor their design output may become a second technical authority.

- Repositories own source, tests, releases, operations, receipts, and current implementation boundaries.
- Research records own experimental setup, methods, and evidence.
- Dated articles own their argument and declared limitations at a date.
- Current Project and Question metadata own only public orientation at `siteUpdatedAt`.
- Interface copy owns hierarchy, explanation, and navigation.

## Review

Review public changes against the stable guidance above. Prefer a small accurate summary and a direct owner link over duplicated technical detail. Do not add governance, metadata, or page types unless a repeated communication failure justifies them.
