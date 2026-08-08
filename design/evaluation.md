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
summary: Layered evaluation contract separating correctness, objective diagnostics, task UX, blinded aesthetic preference, and calibrated Agent judges.
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

The contract therefore uses **several evidence layers with different authority**.

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

### Layer 3 — blinded pairwise aesthetic preference

This is the **primary aesthetic endpoint**.

For the same content/state and same benchmark surface, compare two variants anonymously and ask a forced-choice question. Recommended default:

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

### Layer 4 — facet explanation

Pairwise preference tells us **which wins**, not why.

After or independently from the forced choice, optional facet evidence can explain the result:

- VisAWI: simplicity, diversity, colorfulness, craftsmanship;
- UI-Bench-style failure labels: typography, spacing, hierarchy, color/contrast, detail work, responsiveness, brief adherence, resonance;
- Ordivon-specific task observations: evidence scanability, reading rhythm, temporal-state clarity, identity.

Facet scores or comments do not override the pairwise result; they diagnose the direction of improvement.

### Layer 5 — Agent / VLM judges

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

The repository tools support:

```text
node scripts/prepare-design-comparisons.mjs <spec.json> <rater-id> <rater-class> [seed]
node scripts/rank-design-preferences.mjs <votes.json>
```

The pairing generator randomizes left/right order deterministically from a seed. The ranker reports global and sliced Bradley–Terry ratings, direct head-to-head records, empirical win rates, and Wilson 95% intervals.

When the claim is specifically “candidate X is preferred to the current baseline on surface Y,” inspect the direct X-versus-baseline slice rather than inferring that claim from the global ranking. A strong preference claim requires the candidate's direct 95% Wilson interval to exclude `0.5`; otherwise the comparison remains inconclusive even if its point estimate or Bradley–Terry rank is higher.

Do not treat a ranking as stable when comparisons are sparse or confidence intervals overlap materially.

## Promotion rule

A visual change may enter stable design authority when:

1. all Layer-0 gates pass;
2. objective diagnostics confirm the intended manipulation and reveal no unacceptable regression;
3. relevant task/UX evidence is non-degrading;
4. blinded pairwise preference supports the candidate on the surfaces it claims to improve, with the direct candidate-versus-baseline comparison reported explicitly;
5. a strong “preferred to baseline” claim has a direct 95% Wilson interval excluding `0.5`; otherwise the aesthetic result is labeled inconclusive rather than promoted by point estimate alone;
6. the result remains legible when sliced by surface and evaluator class;
7. the exact promoted changes are smaller than or equal to the evidence supporting them.

A candidate that wins only Home must not silently rewrite the long-form design system. A candidate preferred only by Agents must not be described as proven human taste.

## Sources retained by this contract

- UI-Bench: expert blinded pairwise comparison + TrueSkill and explicit rejection of automated aesthetic proxies as the primary endpoint.
- Design Arena: crowdsourced anonymous pairwise comparison + Bradley–Terry / win-rate uncertainty.
- Visual Aesthetic Benchmark: comparative selection is more reliable than score-derived aesthetic ranking; current MLLM aesthetic judges remain substantially below experts.
- VisAWI: simplicity, diversity, colorfulness, craftsmanship.
- UEQ / UEQ+: attractiveness, perspicuity, efficiency, dependability, stimulation, novelty and modular UX scales.
- WCAG 2.2: normative accessibility gates.
- Figma MCP / Code Connect: structured components, variables, annotations, and real code mappings as Agent design context.
- Design Theater: stated design rationale must be checked against the actual rendered implementation.
