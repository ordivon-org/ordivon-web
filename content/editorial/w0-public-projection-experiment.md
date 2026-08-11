# W0 Public Projection Experiment

## Question

Can Ordivon Web discover enough current public project truth from owning repositories to stop manually copying implementation state into `content/model.ts`, without introducing a CMS, database, service, or second authority?

## Experiment

The W0 probe reads only two owner-local inputs:

1. `.ordivon/project.yaml` for project identity and the declared `public_projection` target;
2. the repository status document for canonical public status, maturity/capability statements, and explicit removals.

For every source it binds the candidate to the exact Git revision and SHA-256 digest of the status document. It also records whether the source worktree is clean.

A source is admitted as a publication candidate only when all of these are true:

- `public_projection` is `ordivon-web`;
- the status document declares `source_role: canonical`;
- the status document declares `visibility: public`;
- the status document declares `readiness: READY`;
- the repository worktree is clean.

Discovery is not publication. The probe produces evidence for an Agent or editor to judge; it does not rewrite public pages.

## Real sources

The experiment used the current local Host, Harness, and Runtime repositories.

| Project | Source revision | Status updated | Web updated | Result |
| --- | --- | --- | --- | --- |
| Host | `e48ad7e770ceef504fb5b936b46a60c9e4b9ab68` | 2026-08-08 | 2026-08-04 | stale |
| Harness | `d267a6b11f15a5c019d18340e6fe0dbb5d585657` | 2026-08-08 | 2026-08-04 | stale + semantic conflict |
| Runtime | `88ef2af1a9b17177fddc5133d8cf9ba2ce4c16cb` | 2026-08-04 | 2026-08-04 | date aligned |

All three owner sources passed the admission boundary.

## Reproduced drift

The comparison automatically identified Host and Harness as stale because their canonical status dates are newer than the Web project projection.

Harness produced a stronger failure. Its current status explicitly removes the old Host-backed Runner, TaskContract/Assignment persistence, Host compatibility package/dependency, cutover machinery, and Host-coupled Codex/Hermes drivers. The Web projection still contains:

- `Assignment-bound` in the public capability description;
- `Host dependency` in `latestProof`.

This is a reproduced semantic contradiction, not merely a timestamp mismatch.

## Admission pressure

A temporary Git fixture tested the boundary independently of the three real repositories.

| Condition | Admission |
| --- | --- |
| clean + canonical + public + READY + targets Web | accepted |
| same source with an uncommitted status change | rejected |
| clean committed source changed to `visibility: internal` | rejected |

This demonstrates that a source-bound candidate can be produced without accepting ambiguous working state or private material.

## Field disposition

W0 suggests three different classes rather than one universal content model.

### Mechanical projection

These facts can be discovered and source-bound without editorial authorship:

- project identity and repository URL;
- lifecycle and public-projection target;
- owner source revision and status digest;
- owner status update time;
- canonical/public/readiness/evidence declarations;
- owner-declared capability/status tables;
- explicit removed or unsupported paths.

### Constrained public synthesis

These remain authored public language, but owner evidence constrains them and can falsify them:

- capability summary;
- maturity wording;
- current state;
- evidence summary.

An Agent may draft these fields, but publication should reject statements that contradict a newer admitted owner source.

### Editorial judgment

These should remain genuine publication decisions rather than generated repository prose:

- public label and positioning;
- problem framing;
- thesis and importance;
- audience;
- which change deserves emphasis;
- homepage and reading-path selection.

## Structural result

The current single `portfolioUpdatedAt` and manually maintained current project facts are not a safe long-term authority boundary. W0 reproduced the failure predicted by `web-research-interface`: owner repositories changed while the authored Web model retained superseded implementation language.

The experiment does **not** justify a live synchronization service or CMS. The smaller surviving hypothesis is:

> Web can remain a static publication system while an Agent-facing projection step discovers commit-bound owner facts, detects drift and contradictions, and produces reviewable publication candidates. Human-facing synthesis remains editorial rather than mechanically mirrored.

## Equipment

- `scripts/probe-public-projection.mjs` — source-bound discovery and admission probe;
- `scripts/compare-public-projection.mjs` — W0 comparison against the current Web project model.

Neither script is part of the production build or a new fact store. They are W0 experimental instruments and should be retained only if the next experiment demonstrates recurring value.
