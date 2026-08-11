---
schema_version: 1
id: web.narrative-patterns
title: Narrative Patterns for Research Writing
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
summary: A small set of narrative shapes for evidence-heavy Ordivon writing, informed by mature engineering and research publications but subordinate to the Feynman explanation and claim-evidence contracts.
evidence_status: verified
readiness: READY
applies_to:
  - ordivon-web
related:
  - web.feynman-explanation
  - web.voice
  - web.claim-policy
---
# Narrative Patterns for Research Writing

## Why this exists

The Feynman Explanation Contract says what a reader must be able to understand. It does not require every article to use the same rhythm.

A publication system can become mechanically clear and still become monotonous: every article starts with an `InBrief`, walks through the apparatus, reports a table, and ends with limitations. That structure is useful for verification but weak as a universal narrative form.

Mature engineering writing uses several recurring shapes. OpenAI's *Harness engineering* begins with one concrete operating experiment and lets system principles emerge from what broke and compounded. Its *Core dump epidemiology* article begins with an apparently impossible failure, preserves wrong hypotheses, identifies a turning point, and only then extracts the general lesson. Stripe engineering writing commonly organizes a system around the user or operational problem, design constraints, consequential choices, and the measured result. Anthropic's agent-evaluation guidance separates objects such as task, trial, transcript, outcome, grader, and harness before giving a process for using them.

These are **writing references, not technical authorities for Ordivon**.

## Four useful narrative shapes

### 1. Mystery → wrong intuition → discriminating evidence → smaller explanation

Use when the interesting fact initially appears contradictory.

Good for:

- valid evidence that is no longer applicable;
- successful execution with an unknown external consequence;
- two failures that look identical until population or owner evidence separates them.

The reader should experience the contradiction before receiving the vocabulary that resolves it.

### 2. One real trajectory → boundary crossings → proof at each boundary

Use when one action crosses several independently authoritative systems.

Good for:

- Agent proposal → Runtime execution → external effect → domain acceptance;
- source → build → deploy → public encounter;
- research result → admission → capital effect.

Do not draw the whole architecture first. Follow one thing as it moves and ask what each boundary actually proves.

### 3. Strong claim → attack → surviving narrower claim

Use when Ordivon research falsified one of its own assumptions.

Good for:

- remote topology versus effect correctness;
- generality versus local optimality;
- richer explanation versus compact prose;
- broad World abstractions versus the minimal surviving boundary.

The failed claim must remain visible. Otherwise the article reads like a post-hoc justification rather than research.

### 4. Long campaign → anti-confirmation design → repeated corrections → provisional synthesis

Use for historical or multi-wave research.

The article should not become a chronology dump. Organize by the questions history changed:

- What did we expect?
- How did we stop ourselves from coding history to fit the theory?
- Which cases narrowed the theory?
- Which measurement instruments proved unstable?
- Which residuals recur without yet earning promotion?
- What remains unfinished?

## The narrative must not outrun the evidence

A vivid story does not weaken the claim contract.

Every narrative shape still needs:

1. an exact owner for the underlying fact;
2. a bounded evidence class;
3. visible uncertainty or disagreement where it matters;
4. a proof boundary;
5. a reopening condition when a current judgment could change.

The writer may reorder explanation. The writer may not reorder causality.

## Use technical vocabulary as compression

Technical terms are most useful after the reader has already encountered the phenomenon.

For example:

> The old receipt is authentic, but the source facts it depended on have changed.

Only then:

> Ordivon separates **integrity** from **current applicability**.

Likewise:

> The command exited zero, but the remote mutation may already have happened even though the response disappeared.

Only then:

> This is an **UNKNOWN consequential effect** that requires reconciliation rather than blind retry.

## Keep the failed route

Strong engineering stories often become understandable because the reader sees why the obvious route failed.

Ordivon articles should preserve failed routes when they materially changed the world model:

```text
we expected X
→ exact experiment attacked X
→ X failed or narrowed
→ Y is the smallest claim that survived
```

Deleting the failed hypothesis turns research into branding.

## References used as editorial exemplars

- OpenAI, *Harness engineering: leveraging Codex in an agent-first world* — concrete operating experiment → repeated friction → system principles.
- OpenAI, *Core dump epidemiology: fixing an 18-year-old bug* — mystery → wrong hypotheses → better evidence population → causal decomposition.
- Stripe Engineering — problem/constraint/design-choice/result-oriented technical explanation across infrastructure and product systems.
- Anthropic, *Demystifying evals for AI agents* — explicit separation of evaluation objects and outcome evidence before process guidance.

These references inform presentation only. Ordivon claims remain bound to Ordivon owner evidence and primary external sources where an article makes an external factual claim.
