# Vocabulary and Naming

## Principle

Ordivon needs formal language because ownership and recovery fail when consequential states are ambiguous. Public communication should still introduce that language progressively.

> Plain first. Formal when useful. Exact when consequential.

## Three levels of language

### Level 1: public entry language

- real Agent work
- accepted commitments
- unfinished work
- physical evidence
- Session or process interruption
- Provider replacement
- recovery
- verification
- current status
- experiment
- result
- project boundary

### Level 2: introduced technical language

- Task continuity
- state ownership
- Provider Harness
- Agent Run
- model–Tool loop
- reconciliation
- evidence admission
- source of truth
- deletion condition
- completion proposal

### Level 3: formal model language

- Goal, Task, Task Attempt, Assignment
- Agent Run, Tool Step, CompletionProposal, TaskOutcome
- Effect, Observation, Artifact
- generation fencing
- foreign references
- terminal evidence
- Ready Frontier
- Provider Thread, Turn, Session, Prompt, Item, and event lifecycle

A formal term should not be the only explanation of a public result.

## Canonical project names

| Name | Public definition |
| --- | --- |
| Ordivon Host | Persistent coordination and commitment plane for generic Tasks, Journal/CAS state, verification, and outcomes. |
| Ordivon Harness | Replaceable Agent execution layer for Assignments, Runs, Provider adapters, model–Tool loops, Tool-step recovery, and completion proposals. |
| Ordivon Runtime | Owner-trusted physical execution layer for Workspaces, Jobs, Runtime Attempts, process trees, Artifacts, cancellation, and reconciliation. |
| Ordivon Game | Playable application and game-research repository, currently centered on Station Zero. |
| Ordivon World | Carrier for a Cloudflare adapter and private network operator tools; not a shared semantic or execution layer. |
| Ordivon Computing | Research synthesis, specification, promoted protocol, and conformance root for shared contracts. |
| Ordivon Human | Bounded human research and practical paths with explicit conditions, limitations, ethics, and privacy boundaries. |
| Ordivon Security | Strategic adversarial research through bounded experiments and multidimensional evaluation; not a production attack platform. |
| Ordivon Web | Public orientation, project navigation, and dated publication layer; not a technical truth store. |

## Public-first definitions

### Agent

Public: a model operating through a loop that can inspect Context, choose actions, use Tools, observe results, and continue toward a goal.

Avoid: using “Agent” as a synonym for any model response.

### Harness

Public: the bounded execution layer that turns model intelligence into one Assignment-scoped, Tool-using Agent Run.

Formal: owner of Assignment and Run semantics, Provider adapters, Run-local Context, Tool catalog, Tool steps, budgets, interruption, recovery, and completion proposals.

Avoid: implying that all Provider Agent products share one internal lifecycle or that Harness owns the durable Task.

### Host

Public: the layer that preserves intended work, accepted commitments, evidence admission, and outcomes across replaceable Runs.

Formal: owner of generic Task continuity, Journal/CAS, commitment identity, verification records, and TaskOutcome.

Avoid: assigning Provider loops, Assignment schemas, or process truth to Host.

### Runtime

Public: the layer that turns admitted local operations into observable physical execution and durable Artifacts.

Formal: owner of Workspace, Job, Runtime Attempt, process tree, cancellation, bounded output, Artifact, repair, and physical reconciliation.

Avoid: giving Runtime Task meaning, Provider policy, or semantic completion.

### World

Use **Ordivon World** only for the repository and its retained capabilities. Do not describe it as a fourth core execution layer, provider router, service, database, or owner of external truth. In ordinary prose, prefer the owning domain, external service, environment, game World, Provider, or machine network state.

### Task

Public: a durable unit of intended work that can outlive one Agent Run or process.

Formal: use `Task` for the exact Host object.

Avoid: capitalizing every informal task.

### Assignment

Public: one versioned commitment that authorizes a Harness to perform a bounded Agent Run.

Formal: owned by Harness semantics and stored through Host generic persistence.

Avoid: treating Assignment as the Task itself.

### Evidence

Public: retained facts that allow a later reader or system to verify what happened.

Formal: receipts, revisions, output, Artifacts, observations, verification results, and Provider provenance.

Avoid: calling a claim or summary itself evidence.

### UNKNOWN

Public: an operation may have changed reality, but current evidence cannot establish whether it committed.

Formal: an operational state requiring reconciliation before blind redispatch.

Always uppercase only for the formal state.

### Deletion condition

Public: the evidence that would make an abstraction, project, or boundary unnecessary.

On entry pages prefer “what would make this unnecessary” until the term is introduced.

## Capitalization rules

| Formal | Generic |
| --- | --- |
| Ordivon Host / Host | a host process |
| Ordivon Harness / Harness | a Provider harness |
| Ordivon Runtime / Runtime | a runtime environment |
| Ordivon World | the external world or a game World |
| Task | a task |
| Assignment | an assignment |
| Artifact | an artifact |
| Provider | a provider in ordinary non-formal prose |
| Agent | an agent in ordinary non-formal prose |
| Tool | a tool in ordinary non-formal prose |
| Run | a run in ordinary non-formal prose |

Do not capitalize a generic term merely to make it sound strategically important.

## Navigation and section naming

Primary navigation uses:

- **How it works** — `/system`
- **Projects** — `/projects`
- **Research** — `/research`
- **Writing** — `/writing`
- **Now** — `/now`
- **About** — `/about`

## Status language

Keep lifecycle, maturity, availability, and research state separate.

Public project availability:

- **usable now** — operational under a current run or operations contract;
- **implemented prototype** — executable and tested but not a general production product;
- **playable now** — a current application can be run as documented;
- **research** — bounded inquiry with conditional conclusions;
- **historical** — retained evidence no longer describing current capability.

Research Question state:

- **testing** — a defined hypothesis is under real pressure;
- **open** — admitted but insufficiently tested;
- **answered** — closed within the stated scope;
- **reframed** — the original question changed materially.

Repository lifecycle such as `active` means only that work or maintenance continues. It does not imply maturity or priority.

## Metrics

Prefer measures that describe capability or evidence: tests, real Runs, replacement orders, fault classes, exact outcomes, release identity, deleted implementation, or completed research cycles. Avoid presenting graph nodes, metadata objects, relation counts, or internal anchors as public achievement.

## Terms to reduce above the fold

Use only after consequence is clear:

- typed graph
- state owner
- question dossier
- deletion condition
- completion adjudication
- Provider lifecycle
- semantic authority
- Task truth
- public model
