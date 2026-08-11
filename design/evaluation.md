---
schema_version: 1
id: web.design-evaluation
title: Ordivon Web Design Evaluation Contract
profile: research
lifecycle: active
source_role: canonical
visibility: public
owners:
  - ordivon-web
updated: 2026-08-08
summary: Layered evaluation contract separating correctness, diagnostics, task UX, Agent creative judgment, optional human-preference calibration, and calibrated multimodal judges.
evidence_status: verified
readiness: READY
applies_to:
  - ordivon-web
related:
  - web.aesthetic-research
  - web.design-system
---
# Ordivon Web Design Evaluation Contract

## Why this exists

Aesthetic evaluation should be quantitative without pretending that beauty has one objective scalar ground truth.

The current evidence base points in the same direction:

- UI-Bench evaluates AI-generated websites with blinded expert pairwise preference rather than FID/CLIP-style image proxies as the primary aesthetic endpoint.
- Design Arena uses anonymous pairwise comparisons and Bradley–Terry ranking over large-scale community preference.
- the Visual Aesthetic Benchmark reports that direct comparative judgments are more reliable than converting absolute aesthetic scores into rankings, and current multimodal judges remain well below expert consensus on aesthetic comparison.
- VisAWI decomposes perceived website aesthetics into simplicity, diversity, colorfulness, and craftsmanship.
- UEQ separates attractiveness from perspicuity, efficiency, dependability, stimulation, and novelty.
- WCAG provides normative accessibility constraints that are not aesthetic preferences.

The contract therefore uses **several evidence layers with different authority**. Direct human comparison is the strongest direct evidence for a claim about human comparative preference; it is not a mandatory approval mechanism for every visual decision.

## Evaluation stack

### Layer 0 — correctness gates

A candidate is ineligible for aesthetic promotion if it fails a requirement that should not be traded for taste:

- owner/publication provenance;
- build and runtime correctness;
- route/content integrity;
- keyboard and semantic accessibility;
- WCAG 2.2 AA requirements relevant to the changed interface;
- responsive/reflow integrity;
- reduced-motion behavior where applicable;
- required task behavior.

A beautiful broken candidate loses before aesthetic comparison begins.

### Layer 1 — objective design diagnostics

Mechanical measurements may describe the manipulation and expose regressions:

- contrast;
- alignment and spacing consistency;
- visual density / complexity;
- symmetry / balance where meaningful;
- typography consistency;
- component/token reuse;
- overflow and target sizing;
- visual change outside the intended experiment boundary.

These metrics are **diagnostics, not beauty scores**. HCI work can model factors such as symmetry, complexity, balance, and colorfulness, but there is no accepted universal formula or weighting that turns them into aesthetic truth.

### Layer 2 — task and UX evidence

For interfaces with concrete user goals, record task evidence separately from aesthetics:

- completion / success rate;
- errors;
- time or interaction cost when meaningful;
- comprehension of current state and next action;
- UEQ/UEQ-S dimensions when a questionnaire is justified.

Ordivon benchmark surfaces should use task-specific questions. For example, a Project page should be tested on whether a reader can distinguish current product truth, target state, evidence, and ownership.

### Layer 3 — blinded human-preference calibration

This is the **primary direct endpoint when the claim is specifically comparative human preference**. It is a calibration instrument, not the default creative-control loop.

When that evidence is needed, compare the same content/state and same benchmark surface anonymously and ask a forced-choice question. Recommended default:

> Which version is more publication-ready for Ordivon?

Protocol:

1. keep content and task semantics fixed;
2. require the evaluator to inspect the full relevant surface rather than only a hero crop;
3. hide variant names and generation method;
4. randomize left/right placement;
5. use forced choice with no numeric rating as the primary response;
6. record evaluator class separately (`expert`, `lay`, `agent`);
7. aggregate preferences with Bradley–Terry ranking, direct head-to-head results, and empirical win rates;
8. report Wilson 95% uncertainty and surface-specific/evaluator-class results instead of one context-free number.

When the claim is specifically professional visual craft, expert UI/UX evaluators carry more evidential weight than a convenience sample. Lay users remain valuable for audience preference and comprehension, but should not be silently pooled with expert judgment.

### Layer 4 — evidence-informed creative judgment and facet explanation

Most routine design decisions stop here rather than opening a human ballot. The Agent should state the intended experiential outcomes, relevant tension profile from [`expression-profile.md`](./expression-profile.md), mature research/craft priors used, and whether the rendered result actually implements them. A design judgment may be promoted without a population-preference claim when correctness/task obligations hold and the change is bounded, inspectable, reversible, and consistent with the selected expression profile.


When pairwise preference is collected, it tells us **which was selected**, not why. Independent of whether a ballot exists, facet evidence can explain the likely strengths and failures of a rendered design:

- VisAWI: simplicity, diversity, colorfulness, craftsmanship;
- UI-Bench-style failure labels: typography, spacing, hierarchy, color/contrast, detail work, responsiveness, brief adherence, resonance;
- Ordivon-specific task observations: evidence scanability, reading rhythm, temporal-state clarity, identity.

Facet scores or comments diagnose the direction of improvement. When a formal human-preference claim is being made, they explain rather than override the direct comparative evidence.

### Layer 5 — calibrated Agent / VLM comparative judges

Agents are useful because they are cheap, repeatable, and can inspect many variants, but they are not yet aesthetic authority.

Use Agent judges for:

- pre-screening obvious failures;
- checking implementation against stated rationale;
- labeling failure modes;
- producing pairwise predictions before human review;
- scaling experiments after calibration.

Do not average arbitrary Agent 1–10 aesthetic scores and call the result objective. The Visual Aesthetic Benchmark shows that frontier multimodal systems still have a substantial gap to expert comparative judgment.

An Agent judge earns more authority only after its pairwise predictions are calibrated against the same human/expert comparison distribution used by Ordivon.

## Reference fidelity is a different task

Design2Code, Vision2Web, VISTA, and similar benchmarks measure whether generated code reproduces a supplied visual/reference and whether interactions work. Those methods are valuable when Ordivon has a reference design.

They do **not** answer whether an original design is aesthetically better. Visual fidelity to a reference and visual excellence are separate objectives.

## Generation guidance from current Agent-design evidence

Current large-scale AI design evaluations repeatedly identify several useful generation priors:

- reuse proven design structures but adapt them to the actual task;
- avoid generic card/bento repetition when information hierarchy can be expressed more directly;
- avoid oversized hero typography as a substitute for composition;
- build deliberate typography systems rather than isolated font-size choices;
- maintain coherent color programs instead of fashionable default gradients;
- make multi-section pages read as a narrative rather than a pile of components;
- reuse real design-system components/tokens where they exist;
- verify that design rationale is actually implemented rather than merely described.

These are priors to pressure-test, not permanent laws.

## Statistical protocol for small Ordivon experiments

For `k` variants on `s` benchmark surfaces, one evaluator should normally see all unordered variant pairs per surface:

```text
comparisons per evaluator = s × k × (k - 1) / 2
```

For three variants over three surfaces, that is nine pairwise decisions per evaluator.

The executable ballot apparatus is archived under [`archive/preference-calibration/`](./archive/preference-calibration/) and is intentionally absent from ordinary package commands and `design:check`. Restore/use it only when the active claim is specifically comparative human preference. The evaluation principles below remain active even when the apparatus is dormant.

The pairing generator randomizes left/right order deterministically from a seed. Before an evaluator sees the ballot, the blinding step separates a public ballot containing only comparison identity/surface from a private left/right→variant key. The review renderer consumes only that public ballot. Evaluator export contains only `left`/`right` choices; the private key resolves those choices after ballot closure. The ranker then reports global and sliced Bradley–Terry ratings, direct head-to-head records, empirical win rates, and Wilson 95% intervals.

For any formal ballot, precommit the private-key digest and exact public review-asset digests before collecting responses. Do not publish the seed or private mapping until that ballot is closed.

### Statistical unit: evaluator, not click

A single evaluator normally contributes several pairwise decisions across surfaces. Those decisions are repeated measures from one person; they are not independent human samples. Therefore:

- overall Bradley–Terry ratings and overall win-rate intervals are useful descriptive summaries of recorded comparisons;
- cross-surface wins from one evaluator measure within-evaluator coverage/consistency, not population preference;
- for a human-preference claim on one specific surface, each independent evaluator contributes at most one direct vote for a candidate pair;
- a Wilson interval may be interpreted at evaluator level only when the reported slice has one vote per evaluator for that pair;
- if a slice contains repeated votes from the same evaluator, use its interval only as comparison-level description or apply an explicitly cluster-aware/hierarchical analysis before population inference.

The ranker exposes `raters`, `surfaces`, `maxVotesPerRater`, `independentEvaluatorVotes`, and `intervalUnit` on direct head-to-head rows so an Agent does not need to infer this boundary from counts.

When the claim is specifically “candidate X is preferred to the current baseline on surface Y,” inspect the direct X-versus-baseline **surface slice** rather than inferring that claim from the global ranking. A strong human-preference claim requires an evaluator-level direct 95% Wilson interval excluding `0.5`; otherwise the comparison remains inconclusive even if its point estimate, cross-surface coverage, or Bradley–Terry rank is higher.

Do not treat a ranking as stable when independent evaluators are sparse or confidence intervals overlap materially.

## Promotion rule

A visual change may enter stable design authority when:

1. all Layer-0 gates pass;
2. diagnostics confirm the intended manipulation and reveal no unacceptable regression;
3. relevant task/UX evidence is non-degrading;
4. the intended experiential outcomes and Web tension profile are explicit enough to explain why the concrete change belongs;
5. rendered inspection shows the implementation actually expresses that rationale rather than merely describing it;
6. the exact promoted change is smaller than or equal to the evidence and craft judgment supporting it;
7. any stronger claim about **human population preference** is backed by the appropriate human/expert calibration rather than inferred from Agent judgment.

When Web does make a strong “humans prefer X to baseline on surface Y” claim, the direct surface-specific evaluator-level 95% Wilson interval must exclude `0.5`; otherwise that population-preference claim remains inconclusive. This statistical threshold governs the claim, not whether Web is allowed to make a bounded design decision.

A candidate that only works on Home must not silently rewrite the long-form design system. A candidate selected by Agents may become a design decision, but it must not be narrated as proven human taste without corresponding evidence.

## Sources retained by this contract

- UI-Bench: expert blinded pairwise comparison + TrueSkill and explicit rejection of automated aesthetic proxies as the primary endpoint.
- Design Arena: crowdsourced anonymous pairwise comparison + Bradley–Terry / win-rate uncertainty.
- Visual Aesthetic Benchmark: comparative selection is more reliable than score-derived aesthetic ranking; current MLLM aesthetic judges remain substantially below experts.
- VisAWI: simplicity, diversity, colorfulness, craftsmanship.
- UEQ / UEQ+: attractiveness, perspicuity, efficiency, dependability, stimulation, novelty and modular UX scales.
- WCAG 2.2: normative accessibility gates.
- Figma MCP / Code Connect: structured components, variables, annotations, and real code mappings as Agent design context.
- Design Theater: stated design rationale must be checked against the actual rendered implementation.
## R6 browser encounter evidence

Creative Alpha R6 added a Web-local **encounter evidence** layer without turning Web into the owner of creative meaning or a general analytics platform. For bounded experiments, `scripts/run-r6-encounter.mjs` can now materialize:

```text
exact experiment manifest
→ randomized assignment
→ explicit assignment probability / propensity
→ real Chromium render
→ realized exposure
→ optional typed outcome event
→ representative screenshot / visible-text / viewport-evidence digests
```

This layer answers a question the ordinary browser review packet does not: **which exact variant was actually encountered, under what randomized assignment probability, and which evidence intersected the declared initial viewport?** The receipt does not decide whether the work was good, whether a person understood it, or whether a Provider answer is semantically correct. Those claims remain owned by the relevant experiment and observer evidence.

R6 dogfood also established two operational details that are now part of the harness rather than caller folklore: Chromium receives a bounded temporary root when Runtime workspace paths would exceed Unix-socket limits, and async outcome handlers freeze the event target before awaiting network emission.

Assignment probability is retained even for simple equal randomization because future analysis must not reconstruct the exposure policy from memory. Adaptive allocation or off-policy evaluation is deliberately outside R6; trustworthy randomized exposure precedes any bandit.
