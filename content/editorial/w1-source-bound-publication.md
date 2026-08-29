# W1 Source-Bound Publication Experiment

## Question

Can one current Ordivon project be rendered through the static Web publication without keeping its changing implementation facts as hand-authored fields in `content/model.ts`?

W1 uses Harness because W0 reproduced both timestamp drift and a semantic contradiction: Web still described the removed Assignment/Host-backed product line after the Harness owner had moved to a caller-neutral independent Run authority.

## Experiment shape

W1 separates three objects:

1. **Owner reality** — the canonical Harness repository and status document.
2. **Derived source snapshot** — `content/projects/harness-source.json`, captured from an admitted clean owner repository and bound to a public semantic envelope, the latest revision touching that envelope, and an aggregate source digest. W2 later corrected how the envelope is discovered: owner authority declarations, not `READY managed_paths`, define membership.
3. **Web publication judgment** — `content/projects/harness-publication.json`, containing reader-facing Boundary and Project synthesis and explicitly bound to the exact captured revision/digest.

The build-local `generated-harness.ts` is disposable. `content/model.ts` imports the generated Harness Boundary and Project rather than carrying another manually maintained Harness state object.

```text
Harness repository
  .ordivon/project.yaml
  docs/STATUS.md
  exact Git revision
        ↓ probe + admission
harness-source.json
        +
harness-publication.json
        ↓ source/digest + claim validation
generated-harness.ts
        ↓
content/model.ts
        ↓
Next static pages
```

## Static-build constraint

A GitHub Pages build receives the Web repository, not every sibling Ordivon checkout. Reading `/root/projects/ordivon-harness` directly during production build would therefore make local topology part of the publication contract.

The committed source snapshot is the minimal bridge W1 retained. It is derived, source-bound, deterministic, and locally re-verifiable with:

```bash
node scripts/capture-public-projection.mjs --check \
  /root/projects/ordivon-harness \
  content/projects/harness-source.json
```

This is intentionally different from a CMS or public project database. The snapshot does not acquire authority merely because static CI needs a local input.

### Why the source envelope is not repository HEAD or STATUS alone

A concurrent Harness change during W1 provided the failure case. Two new commits implemented P-C1.2a privacy authority. `docs/STATUS.md` did not change, but `ARCHITECTURE.md` and `docs/DATA_AND_PRIVACY.md` changed materially: metadata-only became the default durable-content authority, exact model/Tool retention requires explicit permission, and omitted content may require fail-closed rehydration without authorizing redispatch of an already completed effect.

Binding raw repository HEAD would have made every code-only commit a publication invalidation. Binding only STATUS would have missed this public semantic change. W1 therefore established the need for an explicit public semantic envelope; W2 later refined its discovery from managed-path heuristics to owner authority declarations. The current Harness envelope resolves to public-source revision `a8a6a2f14d2c1d8fe1e09a5f4f79daa026f8c31f` and aggregate digest `sha256:9f2f516e70bf6f5090cb86595a889b1485fadeab3ca65bb6765e5a74e891a89f`; the later evidence-record commit does not perturb that envelope.

The real three-revision comparison confirmed the intended selectivity:

| Harness state | Public-source revision | Aggregate digest result |
| --- | --- | --- |
| before the public privacy change | `6124cd22b182264cfd0acbcf6ddd3a0c5ccda964` | different |
| after P-C1.2a public documents changed | `a8a6a2f14d2c1d8fe1e09a5f4f79daa026f8c31f` | `sha256:9f2f516e70bf6f5090cb86595a889b1485fadeab3ca65bb6765e5a74e891a89f` |
| later evidence-record-only commit | still `a8a6a2f14d2c1d8fe1e09a5f4f79daa026f8c31f` | unchanged |

Thus a public semantic change invalidates the Web review while a later commit outside the declared public envelope does not.

## Admission and review boundaries

The captured source is accepted only when:

- `public_projection: ordivon-web`;
- `source_role: canonical`;
- `visibility: public`;
- the anchor and authority sources are active, canonical, and public; document readiness is captured rather than used as a universal admission gate (W2 correction);
- the projection-input set is clean: the project manifest, authority document, and every authority-linked candidate whose bytes or metadata can change public-envelope membership. Dirty paths outside that input set do not invalidate the source review; owner source-integration horizon/currentness remains a separate prerequisite.

The publication synthesis must then name the same project and bind to the exact captured public-source revision and aggregate source digest. Harness still uses STATUS as its preferred anchor, but the binding contract no longer requires every project to have one.

Two deliberate failures passed:

| Mutation | Result |
| --- | --- |
| publication points to a different public-source revision or aggregate digest | rejected |
| current capability reasserts retired `Assignment` support | rejected |

The first version of the retired-term check was too broad: it also rejected accurate phrases such as “without a Host dependency” and explicit removal notes. W1 therefore narrowed the invariant to **current positive capability/ownership/evidence claims**. Historical and boundary prose may name retired concepts when it clearly describes their removal.

## Public reconstruction result

The Harness Boundary and Project are now generated from the source-bound inputs. The W0 comparison changed from:

```text
staleProjects = [harness]
retiredReferenceProjects = [harness]
```

to:

```text
staleProjects = []
retiredCurrentClaimProjects = []
```

Both generated public objects carry the owner status date `2026-08-08`.

The static production build also succeeded through TypeScript, ESLint, Next production compilation, all 57 static routes, and the static budget report. Browser smoke execution in the isolated Workspace could not start because the matching Playwright Chromium binary was not installed there; request-only Playwright checks did run successfully before browser launch failures.

## A second fact-copy failure

After `content/model.ts` was corrected, built `/system` HTML still contained three old current claims:

- `256` Harness tests against an exact Host pin;
- “An Assignment binds …” in the execution trajectory;
- “Harness owns Assignment-bound Agent Runs” in section copy.

This proved that page-level prose can become a second fact store even when the central model is source-bound.

W1 removed those literals. The System page now obtains Harness capability/evidence from the projected Project, while its surrounding trajectory remains editorial explanation. System graph relation labels were also changed from “assigns” to delegation language because current Harness is caller-neutral and Host is not its persistence owner.

## Research judgment is different

`question:ordivon-harness-v0` also contained the old 256-test/Host-dependency description. W1 did **not** mechanically replace the Question from Harness status. A research Question is a judgment owned by the research/publication layer, not a project fact.

Instead the Question was explicitly reconsidered against the new owner evidence. Its current pressure is now whether the caller-neutral Mandate → Strategy → immutable Run-contract boundary transfers across materially different callers/workloads without reintroducing a universal planner or caller-specific persistence.

This distinction survived W1:

```text
owner fact change
    ├─ current Project / Boundary facts → source-bound projection
    └─ Research judgment              → explicit re-evaluation
```

## What must persist

W1 did not justify a live synchronization service, database, or general project graph. For this slice, the smallest persistent publication inputs are:

- exact owner source identity and derived snapshot;
- Web editorial/public synthesis bound to that source;
- dated Research judgment when evidence changes its interpretation;
- ordinary static publication source.

Everything else can remain generated.

## Current hypothesis

A static Web does not need to make Agents edit a human-oriented mirror of project reality. An Agent can discover owner truth, admit a source-bound snapshot, perform editorial/research judgment, and compile the human-facing interface.

The next experiment should test whether this pattern transfers to a second project with materially different public semantics before it becomes a general Web contract.
