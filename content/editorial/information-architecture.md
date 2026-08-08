---
schema_version: 1
id: web.information-architecture
title: Public Information Architecture
type: architecture
profile: publication
lifecycle: active
source_role: canonical
visibility: public
owners:
  - ordivon-web
audience:
  - editor
  - writer
  - builder
  - agent
updated: 2026-08-08
summary: Canonical public hierarchy for explaining the Ordivon project family, current maturity, research status, and next destinations without copying repository authority.
evidence_status: verified
readiness: READY
applies_to:
  - ordivon-web
related:
  - web.editorial.start
  - web.authority
  - web.publication-system
---
# Public Information Architecture

## Purpose

A first-time visitor should be able to answer five questions without reading repository internals:

1. What is Ordivon and which failure does it address?
2. Which project owns each responsibility?
3. What can be used, played, or inspected now?
4. What remains an engineering prototype, bounded research, or historical evidence?
5. Where should the reader go next for explanation, evidence, source, or participation?

The website supplies orientation and editorial synthesis. It does not copy the complete technical documents or become a live product database.

## Public hierarchy

The primary hierarchy is:

1. **Ordivon narrative** — durable work with replaceable intelligence.
2. **Current capability** — what is operational, implemented, playable, or retained.
3. **Project map** — core work system, applications and capability, research and specification.
4. **How it works** — Host, Harness, and Runtime ownership across one work trajectory.
5. **Research** — questions whose evidence can still change scope or architecture.
6. **Writing** — dated arguments, reports, decisions, corrections, and historical publications.
7. **Source and participation** — repositories, authority documents, issues, and pull requests.

## Project map

### Core work system

- **Host** preserves generic Task continuity, commitments, verification, and outcomes.
- **Harness** owns caller-neutral Agent Run execution: immutable Run attempts, Provider and Tool continuity, recovery, receipts, and completion proposals. Caller Task meaning, domain commitments, and final verification remain outside Harness.
- **Runtime** owns physical local execution, Workspaces, Jobs, process trees, Artifacts, cancellation, and reconciliation.

These are distinct owners, not three names for one platform. Applications may use them selectively.

### Applications and capability

- **Game** owns Station Zero and its domain World, rules, player interventions, replay, and comparison.
- **World** retains a Cloudflare adapter and private network operator tools. The broader shared World service, database, router, and semantic layer were rejected.

### Research and specification

- **Computing** owns shared theory, research synthesis, promoted protocol, and conformance.
- **Human** owns bounded human research, practical paths, methods, conditions, and privacy boundaries.
- **Security** owns bounded strategic adversarial experiments and multidimensional evaluation, not a production attack platform.

### Publication

- **Web** explains, organizes, and distributes the work. It owns neither implementation truth nor experimental evidence.

## Maturity language

Project pages must distinguish at least these states:

- **Usable now** — an operational capability with a current run or operations contract.
- **Implemented prototype** — executable and tested, but not a general production product.
- **Playable now** — a current application that can be run as documented.
- **Research** — a bounded question, method, path, or experiment whose conclusions remain conditional.
- **Historical** — retained evidence or argument that no longer describes current capability or direction.

Do not use one word such as `active` to imply maturity, stability, priority, adoption, or production readiness.

## Page responsibilities

| Page | Primary reader question |
| --- | --- |
| Home | What is Ordivon, what exists today, and where should I begin? |
| How it works | How do Host, Harness, Runtime, and the owning domain divide responsibility? |
| Projects | Which repository should I inspect, use, or contribute to, and what is its current maturity? |
| Research | Which questions remain open or testing, and what evidence could change the judgment? |
| Writing | Which complete argument, report, correction, or historical record should I read? |
| Now | What is usable, implemented, playable, research, removed, or historical at this date? |
| About | Why does the work exist, who maintains it, and how should claims be evaluated? |
| Colophon | How is the publication built, validated, and kept separate from technical authority? |

## Linking rule

A public summary should normally link to:

- the project page for orientation;
- the repository for current implementation and operations;
- a research dossier for current uncertainty;
- a dated publication for the complete argument;
- exact evidence or authority only when a reader needs technical verification.

Repository links should identify the actual owner. Do not route all source traffic through one umbrella page when the fact belongs to a specific project.

## Historical correction rule

A publication remains a record of its date. When later work changes a material forward-looking statement or project boundary:

1. retain the original argument;
2. mark the publication historical when it no longer describes current status;
3. add a visible editorial update pointing to the current project page or repository;
4. use `revisedAt` only when the article itself is substantively corrected;
5. never silently rewrite old evidence as though the later state was known at publication.

## Authority

Current project summaries are public projections at `siteUpdatedAt`. Some remain directly authored; the Harness slice is compiled from a source-bound owner snapshot plus Web editorial judgment. The owning repositories remain authoritative for code, tests, releases, operations, and current technical boundaries. Research records remain authoritative for setup and evidence. Articles remain authoritative for their dated argument. Generated modules, manifests, and pages remain rebuildable projections.
