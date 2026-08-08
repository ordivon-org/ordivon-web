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
summary: Web-specific research method for applying cross-medium expression priors to visual alternatives without collapsing aesthetics, usability, accessibility, and visual stability into one score.
evidence_status: not_applicable
readiness: CANDIDATE
applies_to:
  - ordivon-web
related:
  - web.design-system
  - web.agent-web-system
  - web.design-evaluation
---
# Aesthetic Research Program

## Question

How should Web apply cross-medium aesthetic and expressive knowledge to a human-facing interface while preserving reading, trust, navigation, accessibility, and source-bound public truth?

The broader question — what structures tend to create beauty, interest, expression, narrative force, rhythm, memory, or attraction across media — is now owned by Ordivon Studio's Art & Expression Laboratory. Web consumes the exact upstream research revision declared in [`expression-profile.md`](./expression-profile.md) rather than maintaining a second theory of beauty.

## First principle

The Web has two different kinds of quality:

```text
Can the interface work correctly?
        ≠
Do people experience the interface as good design?
```

Accessibility, responsive integrity, link correctness, content provenance, and rendering stability can be tested mechanically to a useful degree. Aesthetic experience is perceptual, contextual, and partly subjective.

An Agent may generate, critique, select, and promote aesthetic candidates when its decision is supported by source constraints, mature craft priors, relevant research, and rendered evidence. It must not misdescribe its own preference as a measured claim about human population preference.

## External research we retain

The visual-aesthetics literature provides useful dimensions without giving us a universal formula for beauty. Later Agent-design benchmarks strengthen the same conclusion: automated image proxies and absolute aesthetic scores are useful diagnostics but are not reliable primary rankings for original UI design.

Lavie and Tractinsky (2004), *Assessing dimensions of perceived visual aesthetics of web sites*, established that perceived web aesthetics is multidimensional rather than one obvious property.

Moshagen and Thielsch (2010), *Facets of visual aesthetics*, validated the VisAWI instrument around four useful facets:

- simplicity;
- diversity;
- colorfulness;
- craftsmanship.

The later VisAWI-S showed that shorter perception measures can still be useful when evaluation time is limited.

UI-Bench, Design Arena, and the 2026 Visual Aesthetic Benchmark provide a narrower lesson: when the claim under test is **comparative human preference**, direct blinded comparison is more defensible than pretending an absolute aesthetic score is ground truth. They do not imply that every creative decision requires a vote.

We therefore use empirical literature and the Studio expression context as generative priors, mechanical and task evidence as constraints, Agent critique as the normal operating loop, and human/expert preference as an occasional calibration channel when a durable decision depends on uncertain human response. Reading success, task success, accessibility, perceived usability, and aesthetic preference remain separable evidence. The stable comparison protocol is owned by [`evaluation.md`](./evaluation.md).

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
evidence-based critique
  intended experiential outcomes
  expression tension profile
  simplicity / diversity / craft diagnostics
  reading/task consequences
  human/expert calibration only if needed
        ↓
interpretation
        ↓
promote / retain as experiment / reject
```

A local preference observation may be useful evidence about one observer in one context, but it is not a universal taste law. When Web makes a real population-preference claim, sample independence, evaluator class, randomization, blinding, and context remain part of the evidence boundary.

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

For a formal claim about human comparative preference, use a blinded forced-choice pairwise judgment as the primary direct response. Routine Web composition does not require this procedure. When calibration is useful, ask separately about:

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

Do not average these into one “Web quality” number. If pairwise human preference is collected, rank it separately; UX/task evidence, aesthetic facets, and the Web expression profile explain tradeoffs.

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

Pairwise vote aggregation now has one proven repeated consumer and is handled by the lightweight scripts defined in `evaluation.md`. More elaborate experiment state should still be forced by practice rather than introduced pre-emptively.

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
- treat an uncalibrated VLM/Agent judge as equivalent to expert human aesthetic preference;
- keep every generated variation as permanent design-system surface area.

## Human role

Because the final interface is consumed by people, human perception is an experimental sensor. Human review is not required because humans are metaphysically privileged over Agents; it is required when the claim being tested is specifically about **human visual experience**.

Future non-human users may require different interface experiments and different sensors.

## Mature tools and what we do not copy blindly

Design-token standards, Figma/Builder/v0 design context, Storybook component states, visual regression systems, and preview deployments all demonstrate mature pieces of this loop.

Ordivon should reuse their ideas before reimplementing them, but a tool enters the permanent stack only when a real experiment needs its capability. N0 therefore creates token/context authority and benchmark surfaces without yet adding Storybook, Chromatic, Figma, or another hosting runtime.

## Current research pressure

A0/A2 supplied the first bounded visual experiment and, more importantly, falsified the idea that one exposed observer's momentary preference should become design authority. The current pressure is no longer to collect votes until a theme wins. It is to apply [`expression-profile.md`](./expression-profile.md) to a real Web composition, state the intended experiential outcomes and tension profile before implementation, and test whether those concepts actually improve Agent creative judgment. Human/expert comparison remains available when the residual uncertainty is specifically about human response.

## References

- Lavie, T. & Tractinsky, N. (2004). *Assessing dimensions of perceived visual aesthetics of web sites*. International Journal of Human-Computer Studies. DOI: 10.1016/j.ijhcs.2003.09.002.
- Moshagen, M. & Thielsch, M. T. (2010). *Facets of visual aesthetics*. International Journal of Human-Computer Studies. DOI: 10.1016/j.ijhcs.2010.05.006.
- Moshagen, M. & Thielsch, M. T. (2013). *A short version of the visual aesthetics of websites inventory*. Behaviour & Information Technology. DOI: 10.1080/0144929X.2012.694910.
- Design Tokens Community Group, Design Tokens Format Module 2025.10.
- Jung, S., Garcinuno, A. & Mateega, S. (2025). *UI-Bench: A Benchmark for Evaluating Design Capabilities of AI Text-to-App Tools*.
- Feng, Y. et al. (2026). *Visual Aesthetic Benchmark: Can Frontier Models Judge Beauty?*.
- Design Arena, public pairwise-comparison methodology.
