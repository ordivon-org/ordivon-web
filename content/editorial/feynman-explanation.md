---
schema_version: 1
id: web.feynman-explanation
title: Feynman Explanation Contract
type: editorial-method
profile: publication
lifecycle: active
source_role: canonical
visibility: public
owners:
  - ordivon-web
audience:
  - writer
  - editor
  - agent
updated: 2026-08-12
summary: Default explanation method for turning Ordivon research into public prose: concrete consequence first, minimal causal mechanism second, exact evidence third, formal vocabulary only when it adds compression.
evidence_status: verified
readiness: READY
applies_to:
  - ordivon-web
related:
  - web.editorial.start
  - web.voice
  - web.claim-policy
  - web.publication-system
---
# Feynman Explanation Contract

## Why this exists

Ordivon has become easier to build than to explain. A mature project can accumulate exact types, receipts, state machines, experiments, and historical distinctions until a technically correct article forces a new reader to reconstruct the system before understanding why any of it matters.

Recent Ordivon experiments give a better default.

Computing EX3–EX7 compared compact owner-native causal prose with richer causal cards, typed relations, and four- or seven-question scaffolds across 1,326 accepted Agent decisions. All treatments reached the same exact action ceiling on the bounded test surfaces. The richer representations used more Provider tokens. The preregistered smallest-non-inferior rule selected compact causal prose.

Studio R4–R6 independently tightened the human-facing side of the same problem. More observable features did not automatically produce more explanatory power. Evidence-addressed propositions were more stable than fine semantic labels. A creative result became meaningful only after the exact artifact, encounter, search history, consequence type, and holdout boundary were visible.

The public default is therefore simple:

> Explain the causal distinction a reader needs for the next judgment. Add structure only when the simpler explanation fails.

## Default reading sequence

Every consequential public explanation should normally move through six layers.

### 1. Start with one concrete situation

Give the reader something that could actually happen.

Instead of:

> Runtime owns physical execution truth while Host owns semantic Task continuity.

Start with:

> An Agent starts a test run, the browser disconnects, and a different Agent returns five minutes later. The new Agent needs two different answers: did the process run, and is the larger task actually finished?

### 2. State the one-sentence distinction

The reader should be able to repeat the central mechanism without Ordivon vocabulary.

> The machine needs one owner for what physically happened and another owner for what the work means.

### 3. Show the smallest causal mechanism

Use actors and verbs before object names.

```text
Agent proposes
→ executor changes something real
→ evidence records what happened
→ task owner decides what that evidence means
```

Only include branches that change the conclusion.

### 4. Point every strong claim back to evidence

A plausible explanation is not enough. The article should identify the experiment, release, receipt, exact repository revision, or owned artifact that supports the claim.

Studio R5 is the useful warning: a model could tell a coherent recovery story after the decisive recovery evidence had been removed. The story sounded right. The cited evidence did not establish it. Grounding must beat plausibility.

### 5. Introduce formal language only when it compresses

After the reader understands the mechanism, formal terms become useful shorthand.

> Ordivon calls the durable work owner **Host**, the bounded Agent episode **Harness**, and the physical execution owner **Runtime**.

If removing a formal term makes the explanation collapse, the prose is probably depending on vocabulary rather than understanding.

### 6. End with the proof boundary

A good Ordivon article states both:

- what the evidence supports;
- what it does **not** imply.

The latter is not defensive boilerplate. Many important Ordivon failures came from silently extending one true fact into a stronger false one.

Examples:

```text
local execution        does not imply external consequence
historical validity    does not imply current applicability
visibility             does not imply authority
Run completion         does not imply domain completion
Agent-observer success does not imply human comprehension
```

## The five-question editing test

Before publication, a writer or Agent should be able to answer:

1. **What happened in ordinary language?**
2. **Why did the previous/simple approach fail?**
3. **What is the smallest mechanism that explains the difference?**
4. **Which exact evidence supports that mechanism?**
5. **What would make this explanation wrong, obsolete, or too broad?**

If an article cannot answer these questions, adding more diagrams or terminology will usually make the problem harder to see.

## What Studio changes about writing

Studio's creative research adds three constraints to the editorial method.

### Perception bandwidth is not understanding

R4 found that richer article mechanics could expose real local structure while making a pooled global prediction worse. Public writing should therefore avoid equating "more detail" with "more explanation." Detail earns space only when it changes interpretation or makes a claim falsifiable.

### Evidence-addressed meaning beats forced ontology

R5 found near-perfect grounding on several tasks while fine relation labels moved between neighboring categories. Public prose should prefer a grounded proposition in ordinary language over a brittle taxonomy when the taxonomy adds no decision value.

### Encounter is part of the artifact

R6 showed that reveal order and initial viewport changed downstream Agent-observer consequences even when the underlying fact blocks were the same. Web review must therefore inspect the real rendered encounter, not only MDX source, component structure, or a passing build.

None of these results establishes human comprehension. Human-response claims still require appropriate human evidence.

## Compression is not simplification by deletion

Feynman-style explanation does not mean removing every technical detail. It means placing detail at the layer where the reader needs it.

A useful article can have three depths:

1. **orientation** — the consequence and one-sentence mechanism;
2. **mechanism** — causal path, comparison, and evidence;
3. **verification** — exact terms, numbers, revisions, receipts, and source links.

The reader should not have to read depth three to understand depth one.

## Historical articles

Do not rewrite history to make an old article look prescient.

When later work changes the boundary:

1. preserve the dated result;
2. add a visible editorial update;
3. point to the newer explanation or current project page;
4. mark the article historical when its central current-state claim no longer holds.

A historical article can remain useful evidence. It should not compete with current explanation for the first-time reader.

## Publication consequence

The expected result of this contract is not shorter articles everywhere. It is a shorter **cognitive path**.

A reader should be able to leave an Ordivon article knowing:

> what problem occurred, what distinction solved it, what evidence earned that distinction, and where the distinction stops.
