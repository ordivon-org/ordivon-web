# A3-1 — Runtime response-loss expression trial

## Upstream experiment

Cross-medium experiment authority: Ordivon Studio revision `76c7c168b89f1e75946cc2b6ffd1c6db363befcb`, `research/expression/experiments/a31-runtime-response-loss.md`.

This Web candidate applies the same proposition to a spatial, non-linear reading medium. It is experimental code, not a new Runtime product claim.

## Intended outcomes

- clarity;
- trust;
- identity;
- interest / memorability as secondary effects.

## Web-specific translation

Motion can create `expected response → rupture → hold → reconnect` over time. Web instead places the complete relation in one spatial field:

```text
Client A → durable Job → response lost
                         ↑
               same identity
                         ↓
                  Client B
```

The stable Job is deliberately much larger than either client or lost-response state. This expresses the semantic authority structure rather than giving all steps equal visual weight.

## Tension choices

- **unity / variety:** one typographic grammar, with signal/success/accent reserved for semantically different states;
- **fluency / challenge:** familiar request / response vocabulary plus one conceptual inversion;
- **continuity / discontinuity:** broken response path, continuous durable identity;
- **restraint / expression:** the project page remains restrained; this one proof receives larger serif scale and more space;
- **density / space:** sparse layout because simultaneous comparison, not feature inventory, is the task.

## Falsifiers

Reject or revise if:

- the reader can mistake the broken line for failed execution rather than failed response delivery;
- the expressive section overwhelms current project truth or looks like a new capability claim;
- mobile reflow destroys the causal order;
- the design only looks impressive at desktop hero scale;
- the same meaning would be clearer with the existing Runtime four-step mechanism alone.

No human-preference claim is made by this experiment.


## Rendered observation

The candidate was built into the real static Runtime project page and captured at desktop and mobile widths.

The first rendered desktop pass exposed one concrete mismatch between rationale and artifact: Client B reconnected on the right while `same recorded Job` sat at the lower left with no complete spatial causal path. The intended `continuity ↔ discontinuity` model was therefore conceptually correct but visually incomplete.

The corrected desktop topology is now symmetrical:

```text
Client A  →  durable Job  →  response lost
Client B  →  durable Job  →  same recorded Job
```

Measured rendered geometry at 1440 px viewport:

```text
client A      ~265 × 203 px
central Job   ~492 × 544 px
response lost ~265 × 203 px
client B      ~265 × 203 px
resolution    ~265 × 203 px
```

The durable identity therefore has materially stronger visual area and persistence than transient endpoints. At 390 px mobile width, the section has no horizontal overflow and becomes a linear reading order while retaining the Job as the largest node.

Capture digests:

```text
Web A3-1 desktop  sha256:36c96dbb3abcccc32a4c2192c0a8ef4edd4319eac0fae5fbb926c9b13bc7041b
Web A3-1 mobile   sha256:538832a6c7e85fa75c78246c3baa05dfa88fbeba38f9ca54fed9c5ec4e2fb7f0
Web baseline      sha256:5c54e61650ec9b29660dbdda898fba651c8034c15bb86931fe0c3d99ddbc5d2b
```

The Studio counterpart also rendered real receipt-bound frames. The local review bundle compares both pre-laboratory baselines and both medium-specific A3-1 expressions.

## Decision

**Promote as a bounded Runtime-page expression, not as a site-wide component or human-preference claim.**

Reasons:

1. the new section expresses one existing evidence-backed recovery property and does not create new product authority;
2. the Art & Expression tension model materially changed hierarchy and composition rather than merely renaming existing CSS;
3. real rendering found and corrected a visual-semantics defect;
4. desktop and mobile preserve the intended event model without new interaction behavior;
5. the existing four-step Runtime mechanism remains below it for operational inspection, so expressive explanation and engineering summary are complementary rather than mutually exclusive;
6. the change is isolated to `/projects/runtime` and can be removed without changing shared design primitives;
7. no claim is made that a human population prefers the candidate.

The cross-medium result is therefore evidence for a **method**: start from experiential intent and an explicit tension profile, then require the rendered medium to prove that the rationale became perceptual structure.
