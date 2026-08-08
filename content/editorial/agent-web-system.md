---
schema_version: 1
id: web.agent-web-system
title: Agent-Native Web Generation and Management
type: architecture
profile: engineering
lifecycle: active
source_role: canonical
visibility: public
owners:
  - ordivon-web
audience:
  - builder
  - publisher
  - editor
  - agent
updated: 2026-08-08
summary: Architecture for letting Agents observe source authority, make public judgments, compose with design context, verify previews, and promote static Web changes without acting like human CMS operators.
evidence_status: verified
readiness: CANDIDATE
applies_to:
  - ordivon-web
related:
  - web.publication-system
  - web.authority
  - web.design-system
  - web.aesthetic-research
---
# Agent-Native Web Generation and Management

## Purpose

A Web Agent should not maintain Ordivon by pretending to be a human webmaster who opens repository pages, remembers copied facts, scans a large CSS file, edits several duplicate summaries, and then visually hopes the result is correct.

The target is a different operating model:

> **Give the Agent authoritative context, reversible generation space, observable previews, and explicit publication consequences.**

The public result remains human-facing static HTML.

## What W0–W3 already proved

The first Web experiments solved one part of the management problem: current public judgment must be bound to owner-declared public semantic dependencies rather than copied implementation facts.

That produced:

```text
Owner authority
      ↓
canonical public dependency closure
      ↓ exact revision + digest
source snapshot
      +
Web publication judgment
      ↓
disposable projection
```

Harness, Security, and Game proved that the same provenance contract survives materially different engineering, research, and product lifecycles.

But public fact projection is only one subsystem of Web generation. An Agent also needs to understand design context, compose pages, evaluate change scope, produce a preview, and decide whether a source change deserves any public consequence at all.

## New Web loop

```text
Public intent or owner change
        ↓
OBSERVE
  owner source envelopes
  publication sources
  editorial authority
  design context
        ↓
JUDGE
  public consequence?
  no-op / correction / update / new argument / design experiment
        ↓
GENERATE
  copy + structured publication data
  page composition
  reusable primitives
  bounded design changes
        ↓
PREVIEW
  static candidate built from exact source state
        ↓
VERIFY
  provenance
  publication contract
  type/lint/build
  navigation/accessibility/responsive checks
  visual or aesthetic evidence when relevant
        ↓
PROMOTE
  commit + tested deployment artifact
        ↓
HISTORICAL CONSEQUENCE
  previous dated arguments remain legible
```

The Agent does not need a CMS to perform this loop.

## Agent context

The Agent's default cognitive path should be narrow and explicit:

```text
content/editorial/agent-web-system.md
content/editorial/authority.md
content/editorial/information-architecture.md
content/editorial/publication-system.md
design/context.json
```

From `design/context.json` it can discover the token source, design authority, aesthetic method, reusable UI primitives, and benchmark surfaces without grepping the complete style tree first.

For source-projected project state, it consumes the committed source/publication pairs and verifies them against live owner repositories when those repositories are available.

## Observe does not mean mirror

A changed owner source creates a **review obligation**, not necessarily a website edit.

W3 supplied both cases:

- Security C1-G changed the active public research judgment, so Web changed;
- Harness gained an experimental Agent-owned WorkingSet transition seam, but its owner still classified that seam outside the recommended public API, so Web re-bound the source and made no new capability claim.

This distinction is central to Agent management:

```text
source changed
      ↓
review required
      ≠
public change required
```

## Generation is constrained composition, not template filling

The Agent may write new page composition when the public job requires it. It should prefer an existing primitive when that primitive already expresses the same job, but it is not forced to assemble every page from one universal component catalog.

The design context provides:

- shared tokens that already have repeated meaning;
- reusable primitives that have demonstrated repeated use;
- benchmark surfaces representing different human tasks.

This is enough context to make informed changes while leaving new visual ideas cheap.

## Candidate state

We do not introduce a permanent `WebChangeSet` database in N0.

The current candidate is already represented by:

```text
isolated Git Workspace
+ exact source revision
+ source-bound publication inputs
+ file diff
+ generated static output
+ test artifacts
```

That representation is recoverable, inspectable, and disposable. A first-class ChangeSet object should be introduced only if another consumer needs durable state that Git Workspace + Runtime/Host cannot express.

## Preview as a consequence boundary

Mature web systems increasingly separate an in-flight candidate from production through preview deployments or preview perspectives. Ordivon retains the same semantic boundary without changing production hosting yet.

For N0, a preview is the static build of the candidate revision plus its verification evidence. A later experiment may compare:

- local/static Artifact preview;
- GitHub Pages/Actions preview mechanisms;
- Cloudflare Pages branch preview;
- Vercel preview deployment.

The hosting mechanism is replaceable. The invariant is that an Agent can inspect the candidate **before promotion** and production remains bound to a tested source revision.

## Who may promote

External AI content systems commonly hard-code a human approval step. Ordivon should preserve the useful separation without making “human clicks approve” a fundamental law.

Promotion requires **publication authority**.

That authority may belong to a human, an Agent, or another admitted workflow depending on the consequence. The mechanism must make the candidate, verification evidence, and source identity inspectable before promotion.

Human evidence is specifically required when the claim being made is about human perception, preference, comprehension, or usability—not for every Web mutation.

## Management classes

An Agent managing Web work should distinguish at least these consequences in reasoning, without forcing them into a new persisted enum yet:

- **source rebind / public no-op** — owner semantics changed but current public judgment remains valid;
- **current synthesis correction** — current Project/Now/Home judgment changed;
- **publication** — a new complete dated argument or report is warranted;
- **historical correction** — old publication remains but its current-status relationship changed;
- **interface composition** — information architecture or component expression changed;
- **aesthetic experiment** — visual hypothesis is being tested and is not yet the stable language.

If repeated automation needs these classes mechanically, the workflow should then earn a schema.

## Design and aesthetic split

Design context and aesthetic research are separate because they answer different questions.

```text
Design context
= what existing language and primitives can the Agent reuse?

Aesthetic research
= should a visual alternative replace some of that language?
```

A design system that cannot be challenged becomes a fossil. An aesthetic generator with no stable context becomes random style search.

The new Web needs both.

## Verification layers

### Source truth

- owner authority and source digest;
- article metadata and claim policy;
- historical/publication temporal identity.

### Software correctness

- generation determinism;
- TypeScript and lint;
- production static build;
- navigation;
- deploy-source identity.

### Interface integrity

- semantic markup;
- accessibility;
- responsive behavior;
- reduced motion;
- visual regression when a baseline exists.

### Human-facing judgment

- comprehension;
- reading/task performance;
- aesthetic preference and qualitative facets.

Do not collapse these layers into one score.

## Relationship to external mature systems

N0 adopts patterns, not products:

- design-system registries and MCP demonstrate that Agents perform better when components/tokens/patterns are structured context;
- content Agents demonstrate the value of separating proposed changes from published content;
- preview deployments demonstrate branch/candidate isolation before production consequence;
- Storybook/visual-regression systems demonstrate that visual correctness deserves evidence distinct from functional correctness;
- design-token standards demonstrate a portable representation for repeated design decisions.

None of those products becomes an Ordivon runtime dependency merely because its pattern is useful.

## Current implementation slice

N0 adds:

- `design/tokens.json` as machine-readable root token authority;
- generated CSS translation for the existing live variables;
- `design/context.json` as the Agent navigation surface for design authority, primitives, and benchmark pages;
- the aesthetic research program;
- deterministic design generation/validation integrated with the existing static build.

It deliberately does **not** add:

- a CMS;
- a live design database;
- Storybook or Chromatic;
- Figma or Builder dependencies;
- a new production host;
- a universal page schema;
- an Agent self-score for beauty.

## Next pressure

After N0 proves that the structured design context produces the same current site, the next experiment should use it to create a bounded aesthetic variant across several benchmark surfaces.

That is where the missing equipment—browser capture, component isolation, richer tokens, or preview hosting—should be discovered by practice rather than assumed in advance.
