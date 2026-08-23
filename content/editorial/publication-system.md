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
updated: 2026-08-24
summary: Canonical architecture for authoring, validating, compiling, distributing, revising, correcting, and deploying Ordivon publications.
evidence_status: verified
readiness: READY
applies_to:
  - ordivon-web
related:
  - web.editorial.start
  - web.information-architecture
  - web.authority
---
# Ordivon Publication System

Original baseline: `5d0f28af04787f84261c6038d3ac407bb46221e1`

## Purpose

Publish durable research and engineering arguments that remain scannable, evidence-bounded, revisable, historically legible, and independently distributable without a CMS or second fact database.

## Boundaries

Article source files own publication identity, argument, limitations, dated status, and explicit revisions. Project repositories and research records own the underlying technical and evidentiary facts. Current project summaries may point to articles, but an article cannot freeze a superseded project status as current truth.

## Components

The system consists of MDX article sources, source-bound current-project publication inputs, machine-readable design context, build-local compilers, validation, reusable article components, static Next.js output, and receipt-bound deployment. Agent observation/composition and aesthetic experiments are defined by their own authorities rather than hidden inside the article compiler.

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

The MDX file is the article authoring authority. Generated TypeScript files and generated design-token CSS are build-local and ignored; they are disposable projections of committed inputs, not review authority or independent facts.

## Source-bound current project projection

W1 introduced the first source-bound slice with Harness; W2 generalized discovery through owner authority; W3 corrected envelope membership with Game. A `*-source.json` snapshot contains `.ordivon/project.yaml` plus canonical public documents linked as dependencies from the owner's current authority section (`Current authority` or `Decision`). It records each document's lifecycle/readiness, the latest revision touching that envelope, and an aggregate digest over the manifest, authority declaration, and selected documents. The paired `*-publication.json` contains Web-owned editorial judgment reviewed against exactly that envelope. `generate-project-projections.mjs` refuses revision/digest mismatch. Harness additionally retains its H3 retired-current-claim guard; that project-specific semantic check is not treated as a universal parser.

The source snapshot is not a second project database. It exists because a reproducible static GitHub Pages build cannot assume sibling repositories are present. An Agent with local access can re-run the capture in `--check` mode against the owner repository; the static build consumes the committed source-bound snapshot. Generated project modules are disposable.

This pattern is still not a universal project schema. W2 proved transfer from an engineering Harness with `STATUS.md`/READY sources to a research Security project with no `STATUS.md` and mixed readiness. W3 then proved that Game's current authority legitimately depends on both `active` current-product/vision documents and `accepted` unregistered target specifications. The reusable contract is therefore source identity plus owner-declared authority dependency, not one shared project-document shape, lifecycle vocabulary, or product-state schema.

## Publication contract

Each article declares publication status, claim class, evidence level, at least one takeaway, at least one limitation, and temporal identity. Publications making strong empirical or reproduced claims require a canonical research record. `publishedAt` orders publication history; `revisedAt` records a substantive correction or argument change.

Status has temporal meaning:

- `current` means the article still describes the current argument within its limits;
- `historical` means the article is retained as evidence or context but no longer describes current capability or direction.

A historical article should display the reason for supersession and point to the current project or research owner. Do not silently rewrite the original argument.

## Reusable expression

Five earlier flagship publications proved three reusable MDX structures:

- `InBrief`
- `PublicationFigure`
- `ClaimBoundary`

The 2026-08-12 explanation reconstruction adds a content-level contract rather than another component: [`feynman-explanation.md`](./feynman-explanation.md). Computing EX3–EX7 found no Agent-action gain from mandatory causal cards, typed relations, or question grammars over compact owner-native causal prose on the tested surfaces. Studio R4–R6 independently supports progressive disclosure: more observable structure is not automatically more explanatory, grounded propositions should point to exact evidence, and encounter facts must be inspected at the rendered surface.

Other proposed primitives remain deleted until repeated use earns them.

## Design context in publication

`design/tokens.json` is translated into build-local CSS before Next.js compilation, and `design/context.json` identifies reusable primitives and benchmark surfaces for Agent generation and aesthetic experiments. Publication checks validate that this context still resolves to real source. The design layer may change presentation but cannot change owner facts or article claim boundaries.

## Discovery and deployment

- Atom separates `published` and `updated` and uses related links for canonical evidence.
- Article JSON-LD and independent social images derive from the same article metadata.
- Sitemap last-modified values follow real article, Project, or Question dates.
- Ordinary Web source commits do **not** imply publication. `pnpm promotion:preflight` first revalidates every source-projected owner envelope, runs the full Web verification gate, prepares the Pages artifact, then revalidates the owner read-set again at the publication-admission boundary.
- `pnpm promotion:admit` is the ordinary semantic publication entrypoint. A successful admission binds the exact Web source revision, final owner read-set, verification profile, and stable deploy-manifest facts into an experimental promotion receipt; an annotated `web-promotion-*` tag carries that receipt to GitHub only as a transport trigger. Repeating the exact same admission after response loss reconciles the existing identical tag, while a same-name tag with a different target or receipt fails closed.
- GitHub Pages verifies the promotion tag against the checked-out source, provisions the same browser equipment used by the normal Web CI baseline, reruns the full Web gate, prepares one remote static Artifact, and deploys that same workflow Artifact.
- The local receipt deliberately does not claim cross-workspace equality for the complete Next.js output tree: repeated builds can produce different chunk identities while preserving the same admitted source and publication semantics.
- `deploy-manifest.json` binds the realized live output to the full Web source commit.

## Failure modes

The system fails when generated output diverges from committed inputs, an article overstates evidence, a current selection points to superseded material without labeling it, publication metadata loses temporal identity, a projected project snapshot is no longer bound to its owner public-source revision/digest, current synthesis reasserts an explicitly retired owner concept, a project summary becomes implementation authority, or deployment cannot be bound to an exact admitted and remotely reverified source revision.

## Verification

Deterministic source, type, lint, build, browser, mobile, navigation, and serious/critical accessibility checks run before deployment. Bundle size remains advisory until real performance evidence justifies a blocking threshold.

## Deferred

CMS, comments, analytics, multilingual governance, automated repository synchronization, series pages, and full-body normalization remain deferred until actual publication or reader friction supplies a concrete consumer.
