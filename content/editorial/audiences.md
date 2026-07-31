# Audiences

## Priority

Ordivon does not need to speak to everyone. Public copy should optimize for readers who can understand, test, extend, challenge, or learn from the work.

### Primary audience

1. Independent developers and small technical teams building with capable agents.
2. Agent infrastructure engineers and researchers working on long-running tasks, tool use, recovery, evaluation, or multi-provider systems.

### Secondary audience

3. Product and research teams evaluating architectural boundaries around model sessions, execution, evidence, and external effects.
4. Technically literate readers interested in AI, automation, acceleration, tools, and the organization of future work.

The site may also serve future collaborators, reviewers, and employers, but it should not distort the work into a portfolio optimized for recruitment.

## Audience 1: independent builders

### Their situation

They use ChatGPT, Codex, Claude Code, Hermes, model APIs, local models, scripts, repositories, and cloud services to complete real work. Their systems often depend on one conversation or one tool process more than they realize.

### Questions they bring

- Why does a capable model still lose work between sessions?
- Which state must be externalized, and which state can remain ephemeral?
- What should be reused from existing agent products?
- When is a custom Host, Runtime, or Harness justified?
- How can recovery remain cheap without turning every action into a governed workflow?

### Best entry path

Home → flagship architecture article → relevant Project → repository.

### Copy requirements

- Start with a recognizable failure or capability.
- Explain formal objects through examples.
- Show implementation cost and deletion decisions.
- Make maturity explicit.
- Provide a repository or reproducible record.

### Do not require

- prior knowledge of Ordivon terminology;
- understanding of the public content model;
- interest in every repository;
- acceptance of Ordivon's broader philosophical positions.

## Audience 2: agent infrastructure engineers and researchers

### Their situation

They already know model APIs, tool loops, durable workflows, orchestration systems, evaluation, provider protocols, and distributed-systems failure modes. They need precise boundaries and evidence, not introductory AI explanations.

### Questions they bring

- What exactly survived provider replacement?
- Which invariants were tested?
- What were the baselines and failure injections?
- What remains Host-local, Runtime-local, or provider-local?
- Which claims are experimental results and which are architectural inference?
- What would falsify or delete the proposed abstraction?

### Best entry path

Research → report → primary receipts/source → Project boundary.

### Copy requirements

- Preserve exact scope and terminology after introduction.
- State setup, baselines, metrics, and limitations.
- Separate process success from task completion.
- Link to canonical evidence.
- Include negative results and non-generalization.

### Do not require

- reading every prior Ordivon article;
- accepting internal names as industry-standard categories;
- trusting a summary in place of source evidence.

## Audience 3: product and research teams

### Their situation

They need to decide whether a boundary or technique affects a real agent product, laboratory workflow, or internal platform. They have less time for the full ontology and more interest in consequences, trade-offs, and transferability.

### Questions they bring

- What failure does this architecture prevent?
- What changed in practice?
- How much permanent machinery did it add or remove?
- Does the result transfer beyond the tested provider or workload?
- Which alternative approaches were compared?

### Best entry path

Home proof → selected engineering report → decision consequences → repository.

### Copy requirements

- Lead with result and consequence.
- Use comparison tables and before/after paths.
- Distinguish tested scope from strategic recommendation.
- Make retained maintenance cost visible.

## Audience 4: technical future-oriented readers

### Their situation

They are interested in how AI changes software, scientific work, institutions, agency, and civilization. They may not need implementation details, but they reject empty futurism.

### Questions they bring

- Why does durable agent work matter beyond developer tooling?
- What becomes possible when intelligence is replaceable but work persists?
- How do recovery, verification, and acceleration reinforce each other?
- Which philosophical positions are supported by engineering practice?

### Best entry path

Essay → concrete experiment → About → selected Project.

### Copy requirements

- Use history, analogy, tension, and clear thesis.
- Connect technical mechanisms to human or institutional consequences.
- Include the strongest objection.
- Return from the large argument to concrete Ordivon work.

## Progressive disclosure

Public pages should disclose complexity in four steps:

1. **Consequence** — what fails or becomes possible.
2. **Mechanism** — the smallest explanation of why.
3. **Formal object** — the precise Ordivon term.
4. **Evidence** — the experiment, source, or repository.

Example:

> A replacement model resumed the same task without inheriting the previous provider session. Ordivon preserved accepted decisions and unresolved commitments outside both sessions. That durable semantic state belongs to Host. The H1–H5 report records both replacement orders and three injected faults.

Do not reverse this sequence on a general entry page.

## Audience test

Before publication, choose one primary audience and answer:

- What do they already know?
- What concrete problem brings them here?
- Which one claim should they remember?
- Which evidence will they trust?
- What is the next useful action?

An article may serve several audiences, but it should not begin at four different levels of abstraction.
