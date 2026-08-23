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
updated: 2026-08-12
summary: Canonical entry for source-bound public orientation, editorial judgment, static publication, and the boundary between encounter evidence and human understanding.
evidence_status: not_applicable
readiness: READY
applies_to:
  - ordivon-web
related:
  - web.editorial.start
  - web.publication-system
  - web.agent-web-system
  - web.authority
---
# Ordivon Web

An owner repository changes. Must the public page change too?

No. The change creates a **review obligation**, not an automatic copy mutation. Web may correct, rebind, add context, or make a deliberate public no-op when nothing changed that a public reader should believe or do.

**Ordivon Web is the public orientation, encounter, and publication layer for Ordivon.** Owner repositories keep technical and research truth; Web decides how source-bound facts and dated arguments should be encountered publicly.

## Purpose

Exact repository documentation is not automatically a good first encounter. A visitor does not arrive knowing which project matters, what exists now, which historical result changed the system, or where exact proof lives.

```text
owner-native facts + dated arguments
→ judge public consequence
→ explain and navigate
→ static candidate
→ publication + browser verification
→ publish / correct / rebind / no-op
```

**Exposure is not comprehension.** Rendering, viewport coverage, accessibility checks, or an encounter receipt can prove that information was available. They cannot prove that a person understood, remembered, trusted, preferred, or agreed with it.

## Current boundary

Web owns public navigation, source-bound orientation, dated arguments, editorial public-consequence judgment, design context, static publication, and correction policy. Owner repositories keep implementation/research/live-state authority; Web may summarize them but cannot replace them.

## One publication journey

For one owner change:

1. bind the exact owner revision/envelope relevant to the public judgment;
2. decide whether the change has a public consequence;
3. update or deliberately preserve the short public explanation while linking exact detail back to the owner;
4. generate and verify the static candidate;
5. separate mechanical encounter evidence from factual and human-response claims;
6. admit publication only after final owner-envelope revalidation, then let the remote deployment workflow rebuild, verify, and deploy that exact admitted Web revision—or record a public no-op.

Dated articles may retain older judgments when their temporal context is explicit. Current Project pages must rebind or correct when a relevant owner fact changes.

## Start here

- [`content/editorial/README.md`](content/editorial/README.md) — editorial entry and review order;
- [`content/editorial/feynman-explanation.md`](content/editorial/feynman-explanation.md) — causal explanation contract;
- [`content/editorial/narrative-patterns.md`](content/editorial/narrative-patterns.md) — alternative story forms;
- [`content/editorial/agent-web-system.md`](content/editorial/agent-web-system.md) — observe → judge → generate → preview → verify → promote;
- [`content/editorial/information-architecture.md`](content/editorial/information-architecture.md) — hierarchy, owner linking, maturity language, corrections;
- [`content/editorial/authority.md`](content/editorial/authority.md) — source snapshots, current summaries, dated articles, and generated projections;
- [`content/editorial/publication-system.md`](content/editorial/publication-system.md) — exact authoring/validation/deployment mechanics;
- [`design/README.md`](design/README.md) — design authority and machine-readable context.

## Runtime shape

Web is a deterministic static publication system: committed sources → Agent composition → Next.js static candidate → verification → GitHub Pages. There is no request-time application server, CMS, database, Worker, D1, KV, Queue, or service binding. Cloudflare owns DNS, not site runtime.

## Commands

```bash
pnpm install --frozen-lockfile
pnpm agent:context
pnpm agent:context:currentness
pnpm check
pnpm pages:prepare
pnpm promotion:preflight
pnpm promotion:admit --dry-run
```

## Content and source of truth

`content/` owns public content/judgment, `design/` owns design context, and `app/`/`components/` own the rendered interface. Generated projections are rebuildable. An owner snapshot records one exact observed source envelope, not floating latest truth. `pnpm agent:context` reports that captured publication snapshot; `pnpm agent:context:currentness` re-probes each owner's admitted canonical public-document envelope. A changed envelope creates a Web review obligation, not proof that the published explanation is semantically stale or must be mutated. Ordinary source admission is not publication: `pnpm promotion:preflight` revalidates owner envelopes before and after the full Web gate, and `pnpm promotion:admit` is the semantic publication entrypoint that may create an annotated `web-promotion-*` transport tag only after that boundary passes.

## Editorial system

> **Bold in judgment. Precise in evidence. Plain before technical. Current status before historical detail.**

A page that renders correctly can still leave human understanding unknown. Human-facing comprehension, trust, recall, or preference claims require appropriately scoped human evidence when they materially matter.

## License

Apache License 2.0.
