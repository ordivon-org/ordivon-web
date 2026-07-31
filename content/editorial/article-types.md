# Article Types and Publication Architecture

## Publication rule

Publish when a result, question, decision, release, or position has become worth preserving and distributing—not because an internal object exists or a schedule requires another page.

Length and publication count are variable. A small result may deserve a three-minute note. A major disagreement may require several articles. A week with no durable insight may produce no article.

## Required metadata for every publication

Current required fields remain useful:

- slug
- title
- kicker
- deck
- description
- projectSlugs
- questionSlugs
- type
- project
- date
- modifiedDate when revised
- readMinutes
- author
- lead
- table of contents

Future article work should add where relevant:

- `audience`
- `claimClass`
- `evidenceLevel`
- `series`
- `coverImage`
- `socialImage`
- `takeaways`
- `limitations`
- `canonicalResearchRecord`

These fields should be added only when the templates consume them. Do not create unused metadata governance.

## 1. Research report

### Use when

A bounded experiment, comparison, or multi-stage research round produced evidence that changed a judgment.

### Reader promise

The reader can understand what was tested, against what baseline, what happened, what the result supports, and what it does not support.

### Required structure

1. In brief
2. Research question
3. Why it matters
4. Setup and invariants
5. Baselines or comparison
6. Results
7. Failure cases and contradictions
8. Interpretation
9. What changed
10. What this did not prove
11. Next falsifier
12. Primary record and sources

### Title patterns

- Winning the Move Can Lose the Contest
- What We Learned Replacing Two Agent Harnesses Mid-Task
- The Smaller Core That Survived Strong Baselines
- 84 Trials Separated Tactical Success from Strategic Progress

Prefer the result over an internal round code. Preserve H1–H5 or Round 1 in the deck or metadata.

## 2. Engineering report

### Use when

Implementation, dogfood, deletion, migration, recovery work, or an operational correction produced a reusable engineering conclusion.

### Reader promise

The reader can see the original friction, the implemented change, measured consequences, trade-offs, and remaining operational limits.

### Required structure

1. Problem in practice
2. Previous path
3. What changed
4. Architecture or mechanism
5. Before/after evidence
6. Cost added and cost removed
7. Failure and recovery behavior
8. General lesson
9. Where the lesson does not transfer
10. Source and release record

### Strong existing examples

- One Authority, Thirteen Tables Deleted
- Replay Without a Second Truth Store
- A Thin Host Can Improve Strategy Without Becoming a Planner

## 3. Architecture decision or architecture report

### Use when

The important output is a responsibility boundary, rejected alternative, repository split or merge, or a retained contract.

### Reader promise

The reader can understand why the boundary exists, what alternatives were considered, and which evidence would make it change.

### Required structure

1. Context
2. Failure or ambiguity
3. Candidate boundaries
4. Evidence from implementation or comparison
5. Decision
6. Why alternatives lost
7. Consequences and maintenance cost
8. Non-goals
9. Deletion or reopening condition
10. Related source

### Distinction

Use **Architecture decision** for one explicit choice. Use **Architecture report** for a broader boundary established across several stages.

## 4. Research note

### Use when

One bounded finding or conceptual correction is useful independently but does not justify a full report.

### Reader promise

One clear claim, one mechanism, one concrete example, and one boundary.

### Required structure

1. Claim
2. Concrete failure or example
3. Mechanism
4. Implication
5. Limit
6. Related record

Target reading time is normally three to five minutes, but usefulness matters more than length.

Strong existing forms:

- A Transcript Is Not a Task Database
- UNKNOWN Is an Operational State, Not a Model Feeling
- Communication Is Gameplay State

## 5. Release note

### Use when

An exact public release, deployment, or playable artifact changes what another person can use or verify.

### Reader promise

The reader knows what shipped, what they can do now, how it was verified, what remains experimental, and where to obtain the exact artifact.

### Required structure

1. What shipped
2. Who it is for
3. What can be done now
4. Key changes
5. Verification and release identity
6. Known limits
7. Upgrade, download, or source path
8. Next release question

A version identifier may lead the title when the release itself is the subject. Otherwise pair it with a capability-oriented title.

## 6. Essay or design argument

### Use when

The article advances a broad technical, historical, philosophical, or civilizational position that cannot be reduced to one experiment.

### Reader promise

The reader receives a strong thesis, serious argument, the strongest objection, evidence, practical consequences, and a clear connection to Ordivon.

### Required structure

1. Opening tension or historical scene
2. Central thesis
3. Conceptual or historical frame
4. Mechanism
5. Strongest objection
6. Response and limits
7. Practical program
8. Connection to actual Ordivon work
9. Closing proposition
10. Sources

Do not publish a manifesto that cannot return to concrete work.

## Publication packages

A flagship article is not complete when the MDX body exists. It should also have:

- a distinct cover or hero image;
- a distinct 1200×630 social image;
- one-sentence summary;
- 80–120 word summary;
- three key takeaways;
- one mechanism or evidence visual;
- one quotable passage;
- canonical source/research link;
- appropriate RSS description;
- links from Home, Writing, relevant Project, Research, and Now where justified.

## Series

Use a series when several articles answer different parts of one large problem. A series should not merely group by repository.

Possible series:

- From Models to Durable Work
- Building Station Zero
- Strong Baselines Against Ordivon
- Agent Work Across Providers
- Acceleration and Recoverable Systems

Each series needs an editorial question and a recommended reading order.

## When not to publish

Do not create a full publication for:

- a routine dependency update;
- an issue whose importance is still speculative;
- a graph or metadata count;
- a refactor with no visible or architectural consequence;
- a test result that confirms an already well-supported fact without changing confidence;
- a plan before meaningful execution;
- an internal phase boundary with no public lesson.

Use repository history, an issue, a short Now entry, or no public artifact instead.

## Article acceptance checklist

- One primary audience is named.
- The title works without internal phase context.
- The deck states a reading contract.
- The central claim can be paraphrased in one sentence.
- Evidence and limitations are both visible.
- The article distinguishes observed result, inference, and decision.
- At least one concrete mechanism or event appears before prolonged abstraction.
- The next question is meaningful, not ritualistic.
- Source links lead to authoritative records.
- Publication packaging matches the importance of the article.
