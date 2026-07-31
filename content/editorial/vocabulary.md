# Vocabulary and Naming

## Principle

Ordivon needs formal language because ownership and recovery fail when important states are ambiguous. Public communication should still introduce that language progressively.

> Plain first. Formal when useful. Exact when consequential.

## Three levels of language

### Level 1: public entry language

Use on Home, About, Writing, Now, metadata, social cards, and the first paragraph of most articles.

- real agent work
- accepted decisions
- unfinished work
- execution evidence
- session or process interruption
- provider replacement
- external action
- recovery
- verification
- current question
- experiment
- result
- project boundary

### Level 2: introduced technical language

Use after a plain-language explanation or on Project and Research pages.

- task continuity
- state ownership
- provider harness
- agent loop
- durable task state
- committed effect
- reconciliation
- evidence projection
- source of truth
- deletion condition
- completion admission

### Level 3: formal model language

Use in architecture guides, research reports, schemas, diagrams, and repository-facing material.

- Goal, Task, TaskAttempt, Assignment
- HarnessRunReceipt, CompletionProposal, TaskOutcome
- Effect, Observation, Artifact
- generation fencing
- foreign references
- terminal evidence
- Ready Frontier
- provider Thread, Turn, Session, Prompt, Item, event lifecycle

A Level 3 term should not be the only explanation of a public result.

## Canonical project names

| Name | Public definition |
| --- | --- |
| Ordivon Computing | Research and conformance root for contracts that must survive changing models and implementations. |
| Ordivon Host | Durable owner of goals, tasks, accepted decisions, assignments, and semantic completion. |
| Ordivon Runtime | Durable owner of local workspaces, processes, attempts, cancellation, artifacts, and execution evidence. |
| Ordivon World | Owner of conditioned interaction with external systems, paths, identities, effects, and observations. |
| Ordivon Web | Editorial and evidence-navigation layer around the projects; not a technical truth store. |
| Ordivon Game | Agent-native workload and game research, including Station Zero. |
| Ordivon Security | Adversarial agency research under bounded, evidence-preserving experiments. |
| Ordivon Harness | Proposed thin first-party agent loop for bare model APIs; not a universal wrapper over mature provider harnesses. |

## Public-first definitions

### Agent

Public: a model operating through a loop that can inspect context, choose actions, use tools, observe results, and continue toward a goal.  
Avoid: using “agent” as a synonym for any model response.

### Harness

Public: the bounded loop that turns model intelligence into one tool-using run.  
Formal: model adapter, run-local context assembly, tool catalog, tool dispatch, observations, budgets, interruption, and run evidence.  
Avoid: implying that all provider agent products share one lifecycle.

### Host

Public: the layer that preserves what the user is trying to accomplish and what has been accepted across model runs.  
Formal: owner of Goal, Task, TaskAttempt, Assignment, candidate admission, completion adjudication, and TaskOutcome.  
Avoid: describing Host as a generic server or UI container.

### Runtime

Public: the layer that turns admitted operations into observable local execution and durable artifacts.  
Formal: owner of Workspace, Job, Attempt, process tree, cancellation, bounded output, Artifact, and restart recovery.  
Avoid: giving Runtime semantic task completion.

### World

Public: the layer through which work reaches external services, machines, identities, and changing paths.  
Formal: owner of conditioned external interaction, effect correlation, observation, path and endpoint state.  
Avoid: using “World” when “external service” or “environment” is clearer and no formal boundary is being discussed.

### Task

Public: a durable unit of intended work that can outlive one model run or process.  
Formal: use `Task` only for the exact Host object.  
Avoid: capitalizing every informal use of task.

### Effect

Public: an operation that may change reality outside model reasoning.  
Formal: an admitted, identifiable operation whose commit state may require evidence or reconciliation.  
Avoid: treating every tool call as an effect.

### Evidence

Public: retained facts that allow a later reader or system to verify what happened.  
Formal: receipts, source revisions, output, artifacts, observations, verification results, and provider provenance.  
Avoid: calling a claim or summary itself evidence.

### Continuity

Public: the ability to continue the same intended work after interruption or replacement.  
Avoid: using continuity without naming what persists and across which boundary.

### Authority / source of truth

Public: the place allowed to commit a class of facts.  
Avoid: calling every database, component, or document an authority. State the exact facts it owns.

### UNKNOWN

Public: an operation may have changed the external world, but current evidence cannot yet establish whether it committed.  
Formal: an operational state requiring reconciliation before blind redispatch.  
Always uppercase only when referring to the formal state.

### Deletion condition

Public: the evidence that would make an abstraction, project, or boundary unnecessary.  
On general pages prefer “what would make this unnecessary” until the formal term has been introduced.

## Capitalization rules

Use uppercase initial letters for exact project or schema identities. Use lowercase for generic concepts.

| Formal | Generic |
| --- | --- |
| Ordivon Host / Host | a host process |
| Ordivon Runtime / Runtime | a runtime environment |
| Ordivon World / World | the external world |
| Ordivon Harness / Harness | a provider harness |
| Task | a task |
| Assignment | an assignment |
| Artifact | an artifact |
| Provider is not normally formal | provider |
| Agent is not normally formal | agent |
| Tool is not normally formal | tool |
| Run is not normally formal | run |

Do not capitalize a generic term to make it sound strategically important.

## Navigation and section naming

Canonical navigation label: **Now**, route `/now`. Do not alternate between “Current” and “Now” in primary navigation.

Canonical publication terms:

- **Writing** — the complete editorial area.
- **Publication** — any dated public article in the registry.
- **Article** — acceptable in implementation and ordinary prose.
- **Research report**, **Engineering report**, **Architecture decision**, **Research note**, **Release note**, **Essay** — reader-facing types.

Avoid “public record” as the only label for Writing. It describes archival function but not reader value.

## Status language

Use a small stable set:

- **active** — receiving implementation or research effort;
- **testing** — a defined hypothesis is under real pressure;
- **open** — admitted question without sufficient implementation evidence;
- **answered** — current evidence supports closing the question within stated scope;
- **historical** — retained for context, no longer a current frontier;
- **released** — exact public release exists;
- **prototype** — usable for investigation but not a stable release;
- **retired** — intentionally removed or superseded.

Avoid mixing status, confidence, maturity, and priority in one word.

## Metrics and labels

Prefer measures that describe capability or evidence:

- live provider runs;
- replacement orders completed;
- faults injected and handled;
- exact outcomes preserved;
- implementation lines deleted;
- release artifacts verified;
- active questions with publications.

Avoid presenting content-model size as a primary achievement:

- graph nodes;
- relation count;
- metadata objects;
- internal anchors.

Those may be useful diagnostics, not public proof.

## Terms to reduce above the fold

Use only after consequence is clear:

- typed graph;
- curated object model;
- state owner;
- question dossier;
- deletion condition;
- completion adjudication;
- graph anchor;
- provider lifecycle;
- semantic authority;
- task truth;
- public model.

These terms remain valid. Their placement, not their existence, is the issue.
