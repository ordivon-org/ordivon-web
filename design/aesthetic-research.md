---
schema_version: 1
id: web.aesthetic-research
title: Aesthetic Research Program
type: research-proposal
profile: research
lifecycle: active
source_role: canonical
visibility: public
owners:
  - ordivon-web
audience:
  - designer
  - researcher
  - builder
  - agent
updated: 2026-08-08
summary: Research method for generating and comparing human-facing visual alternatives without collapsing aesthetics, usability, accessibility, and visual stability into one score.
evidence_status: not_applicable
readiness: CANDIDATE
applies_to:
  - ordivon-web
related:
  - web.design-system
  - web.agent-web-system
---
# Aesthetic Research Program

## Question

How should an Agent-first project improve a human-facing Web interface when neither “the Agent likes it” nor one automated design score is evidence that people will find it clear, distinctive, coherent, or beautiful?

## First principle

The Web has two different kinds of quality:

```text
Can the interface work correctly?
        ≠
Do people experience the interface as good design?
```

Accessibility, responsive integrity, link correctness, content provenance, and rendering stability can be tested mechanically to a useful degree. Aesthetic experience is perceptual, contextual, and partly subjective.

An Agent may generate aesthetic candidates and reject mechanically broken ones. It must not treat its own preference as human aesthetic evidence.

## External research we retain

The visual-aesthetics literature provides useful dimensions without giving us a universal formula for beauty.

Lavie and Tractinsky (2004), *Assessing dimensions of perceived visual aesthetics of web sites*, established that perceived web aesthetics is multidimensional rather than one obvious property.

Moshagen and Thielsch (2010), *Facets of visual aesthetics*, validated the VisAWI instrument around four useful facets:

- simplicity;
- diversity;
- colorfulness;
- craftsmanship.

The later VisAWI-S showed that shorter perception measures can still be useful when evaluation time is limited.

We use these as prompts for observation, not as a scalar objective function. Reading success, task success, accessibility, perceived usability, and aesthetic preference remain separable evidence.

## Experiment loop

```text
Aesthetic hypothesis
        ↓
Agent generates bounded variants
        ↓
render the same canonical benchmark surfaces
        ↓
mechanical preflight
  content/provenance
  responsive integrity
  accessibility
  obvious visual regression
        ↓
human-facing evaluation
  pairwise preference
  simplicity
  diversity
  colorfulness
  craftsmanship
  reading/task comments
        ↓
interpretation
        ↓
promote / retain as experiment / reject
```

The evaluator may be one person in early experiments. Sample size and evaluator identity are part of the evidence boundary; a single preference must never be narrated as universal taste.

## Benchmark surfaces

`design/context.json` currently names five deliberately different surfaces:

- Home for identity and attention;
- Game Project for status and evidence hierarchy;
- Research for dense interactive information;
- one long-form publication for reading rhythm;
- Now for dated synthesis and comparison.

A design change that looks excellent only on Home has not yet proved itself as the site language.

## Variant discipline

A useful experiment changes a bounded set of variables and states the intended consequence.

Good hypotheses:

- reducing border density will improve hierarchy without making evidence blocks lose structure;
- a more expressive display type scale will strengthen identity while preserving long-form calm;
- a warmer secondary palette will improve differentiation among research states without turning status into decoration;
- larger whitespace around primary judgments will improve scanability on Project and Now surfaces.

Weak hypotheses:

- make it prettier;
- redesign everything;
- use the current design trend;
- maximize an aesthetic score.

## Evidence dimensions

### Mechanical gates

These can reject a candidate before aesthetic preference matters:

- build/type/lint correctness;
- source and publication provenance;
- valid internal navigation;
- keyboard and semantic accessibility checks;
- responsive overflow and reduced-motion behavior;
- readable contrast;
- accidental content loss;
- unintentional visual changes outside the experiment boundary.

### Perceived aesthetics

For human evaluation, record at least a pairwise or ordinal judgment and comments. When useful, ask separately about:

- **simplicity** — does the composition feel understandable rather than visually confused?
- **diversity** — is there enough visual variation to make hierarchy and identity legible without chaos?
- **colorfulness** — does color contribute to the experience at an appropriate intensity?
- **craftsmanship** — does the interface feel deliberate, coherent, and finished?

### Task and reading quality

Evaluate separately:

- can a first-time reader find the next destination?
- can a reader distinguish current product from target or history?
- can a reader find the current research judgment?
- can a reader complete a long article without excessive visual fatigue?

Do not average these into one “Web quality” number.

## Minimal experiment record

Do not create a database yet. A design experiment can begin as one Markdown record under a future `design/experiments/` directory containing:

```text
hypothesis
source revision
variant identity
exact changed variables or components
benchmark surfaces
mechanical gate result
human evaluation setup
observations
interpretation
promotion / rejection decision
limitations
```

If repeated experiments need structured aggregation, the experiments themselves should force the schema.

## Agent role

The Agent is well suited to:

- inspect design context and existing primitives;
- generate several coherent alternatives quickly;
- keep variants source-controlled and reversible;
- run mechanical checks;
- capture comparable surfaces when browser infrastructure is available;
- summarize disagreements and evidence;
- remove rejected variants cleanly.

The Agent should not:

- silently mutate production styling while exploring;
- invent quantitative meaning for decorative dimensions;
- infer universal aesthetic preference from its own critique;
- keep every generated variation as permanent design-system surface area.

## Human role

Because the final interface is consumed by people, human perception is an experimental sensor. Human review is not required because humans are metaphysically privileged over Agents; it is required when the claim being tested is specifically about **human visual experience**.

Future non-human users may require different interface experiments and different sensors.

## Mature tools and what we do not copy blindly

Design-token standards, Figma/Builder/v0 design context, Storybook component states, visual regression systems, and preview deployments all demonstrate mature pieces of this loop.

Ordivon should reuse their ideas before reimplementing them, but a tool enters the permanent stack only when a real experiment needs its capability. N0 therefore creates token/context authority and benchmark surfaces without yet adding Storybook, Chromatic, Figma, or another hosting runtime.

## Initial research pressure

The first aesthetic experiment should not be a full redesign. It should choose one visible hypothesis, generate two or three bounded variants, and compare them across at least Home, Game Project, and long-form Writing.

That experiment will tell us which next equipment is actually missing: browser capture, isolated component stories, richer tokens, design-to-code context, or something else.

## References

- Lavie, T. & Tractinsky, N. (2004). *Assessing dimensions of perceived visual aesthetics of web sites*. International Journal of Human-Computer Studies. DOI: 10.1016/j.ijhcs.2003.09.002.
- Moshagen, M. & Thielsch, M. T. (2010). *Facets of visual aesthetics*. International Journal of Human-Computer Studies. DOI: 10.1016/j.ijhcs.2010.05.006.
- Moshagen, M. & Thielsch, M. T. (2013). *A short version of the visual aesthetics of websites inventory*. Behaviour & Information Technology. DOI: 10.1080/0144929X.2012.694910.
- Design Tokens Community Group, Design Tokens Format Module 2025.10.
