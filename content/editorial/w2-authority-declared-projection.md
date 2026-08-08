# W2 Authority-Declared Projection Experiment

## Question

Does the W1 source-bound publication pattern transfer to a project whose public truth is not organized like Harness?

W2 deliberately used Security rather than another core engineering repository. Security has no `STATUS.md`, mixes current sources with `READY`, `EXPERIMENTAL`, `CANDIDATE`, and `ACCEPTED` readiness, and owns research judgments, executable range semantics, physical evidence, authorization boundaries, and historical material at the same time.

## First falsifier: STATUS is not universal

The W1 probe initially failed immediately:

```text
/root/projects/ordivon-security: no status document found
```

Adding a Security STATUS file would have made Web impose an engineering-document convention on the owner. W2 rejected that response.

Security's canonical entry is `README.md`; its authority map is `docs/authority.md`. The current README is deliberately `readiness: EXPERIMENTAL`, because the active 0.8 research core itself is experimental. Therefore `readiness: READY` cannot mean “eligible to define public truth.” Readiness is content to publish and interpret, not a universal source-admission flag.

## Second falsifier: managed paths are not the semantic envelope

Security declares 16 `managed_paths`, but those paths mix current architecture, migration closeouts, candidate specifications, experimental profiles, and evidence guidance. Conversely, its `Current authority` section names additional current canonical sources not captured by the simple W1 READY-managed-path filter.

The owner already had the missing structure:

```text
.ordivon/project.yaml
        ↓
docs/authority.md
        ↓
Current authority / Decision
        ↓
owner-declared canonical sources
```

Harness expresses this as a `Decision` responsibility table. Security expresses it as a `Current authority` list. Game uses another `Decision` section. The syntax differs; the ownership relation is the same.

## W2 source envelope

The probe now:

1. reads `.ordivon/project.yaml` and the declared authority document;
2. reads only the authority section that defines current sources (`Current authority`, falling back to `Decision`);
3. resolves local document links from that section;
4. initially admitted linked documents only when their own frontmatter said `lifecycle: active`, `source_role: canonical`, and `visibility: public`; W3 later falsified the lifecycle part with Game, where accepted target specifications are current authority dependencies;
5. records lifecycle and readiness for each document without treating either as a universal dependency-admission gate;
6. chooses an anchor only for convenient current-summary extraction (`STATUS.md` when the owner has one, otherwise `README.md`/start document);
7. binds the project manifest, authority declaration, selected documents, latest revision touching that envelope, and aggregate digest.

The build does not read sibling repositories. It consumes committed source snapshots; local Agents can reproduce or `--check` them against owners.

## Cross-project result

The same probe admitted three structurally different repositories:

| Project | Authority section | Anchor | Document readiness shape |
| --- | --- | --- | --- |
| Harness | `Decision` | `docs/STATUS.md` | READY |
| Security | `Current authority` | `README.md` | READY + EXPERIMENTAL + CANDIDATE + ACCEPTED |
| Game | `Decision` | `README.md` | READY |

This is enough to reject a universal STATUS schema and a READY-only publication rule.

## Security drift reproduced

Before W2, Web still described Security mainly through Round 1:

```text
84 bounded Trials
Campaign machinery archived
three experiment families
```

The owner has since moved substantially:

- synchronous Contest remains the reproducible profile;
- `RangeSession` is an experimental persistent contested-world spine;
- S2–S6 and S6-R introduced disposable Windows KVM and isolated heterogeneous range materialization, independent management/world-truth/sensor planes, topology churn, and owner-loss reconciliation;
- C1–C1F tested exact Actor authority, autonomous intent, interrupted consequence, partial materialization, fresh-controller continuation, and successor/reconciler ownership;
- C1-F has now closed the first two-successor competition and lineage question; the current nearest pressure is mid-succession interruption after partial physical progress but before stable generation publication;
- Campaign and Organization remain evolving research contracts rather than promoted general engines.

The old Web projection was therefore not merely timestamp-stale. Its active research question was pointed at an earlier layer of the problem.

## Publication result

Security now has the same three-way separation as Harness:

```text
Security owner authority
        ↓
security-source.json       derived owner snapshot
        +
security-publication.json  Web editorial judgment
        ↓
generated-security.ts      disposable build projection
        ↓
Project / Now / Research
```

The source snapshot currently binds 33 active canonical public documents selected by Security's authority map. The publication describes the active 0.8 core, Contest versus RangeSession distinction, S0–S6 and C1–C1F progression, authorization boundary, and non-ownership of generic infrastructure.

The research dossier was explicitly re-evaluated rather than mechanically synchronized. The original Round 1 result remains valid dated evidence; the current question is now which Agent-native laws survive in persistent adversarial worlds. The current judgment distinguishes intent, admission, backend receipt, sensor observation, world truth, interrupted progress, continuation, successor ownership, and recovery lineage.

## Harness concurrent change

While W2 ran, Harness changed its public architecture again: the mature Agent loop gained an internal experimental Working View projector. The new authority envelope detected the change and invalidated the W1 snapshot.

After review, W2 re-bound Harness without adding Working View as a new public product claim because the owner explicitly labels it an internal experimental seam outside the recommended API. This is an important positive result:

```text
source change
    → mandatory re-review
    ≠ mandatory public-copy change
```

The publication compiler constrains judgment; it does not replace judgment.

## What generalized and what did not

### Generalized

- exact owner project identity;
- owner-declared current authority map;
- active/canonical/public document admission;
- deterministic source snapshot;
- public-source revision and aggregate digest binding;
- Web-owned Project judgment;
- generated/disposable build module;
- local drift verification.

### Did not generalize

- existence of STATUS;
- READY as an admission requirement;
- one shared maturity vocabulary;
- Harness H3 retired-term parser;
- one fixed set of Project evidence metrics;
- automatic conversion of owner facts into Research judgment.

## Verification

W2 exercised both the local owner boundary and the static build boundary. Harness and Security snapshots both passed `--check` against their live owner repositories and the comparison returned `staleProjects=[]`. Three mutations failed closed: an internally forged aggregate source digest, an envelope document rewritten as `visibility: internal`, and a publication bound to the wrong source digest.

The complete static publication path then passed project/article generation, publication validation, Next route type generation, TypeScript, ESLint, production compilation, all 57 static routes, and the static budget report. Static output was inspected for the current Security 0.8, S0–S6, C1–C1F, recovery-lineage and next-pressure language, while current Project/Now surfaces no longer used Round 1's 84-Trial count as current status. Browser smoke remains a separate environment-dependent check.

## Current conclusion

W2 supports a narrower and stronger contract:

> Ordivon Web should bind publication judgment to the owner's declared current public authority, not require owners to adopt a Web-shaped status schema.

The reusable invariant is provenance and authority declaration. Project semantics remain domain-owned.

A third materially different project can now test whether this is enough. Game is the obvious next pressure because one owner simultaneously contains a registered playable product, an implemented but unregistered replacement target, and long-range vision. That would test temporal/product-state projection rather than research-state projection.
