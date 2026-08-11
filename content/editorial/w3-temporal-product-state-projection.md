# W3 Temporal Product-State Projection Experiment

## Question

Can the source-bound publication pattern preserve a product that simultaneously has:

- one registered current executable;
- one implemented but unregistered replacement target;
- long-range vision that creates no feature commitment;
- historical releases that remain valid dated evidence?

W3 uses Ordivon Game because collapsing any two of those states would make the public site materially wrong even if every sentence were copied from a real owner document.

## Initial Game reality

At the start of W3, Game already had a clear domain distinction:

```text
registered current product
  station-zero@2
  station-zero-core@3

accepted replacement target
  station-zero@3
  station-zero-core@4

long-range Game vision
  possibilities, not commitments

historical Alpha release
  dated evidence, not current product state
```

The repository also already contained a separate Station Zero v3 API, SQLite state, `/v3` browser first-playable, bounded Agent planning, explicit whole-Turn Commit, and restart recovery. `src/registry.ts` still registered only v2. Repeated human playtesting and live-Provider evaluation remained the explicit gates before v3 registration or v2 deletion.

## First falsifier: lifecycle is not envelope membership

The W2 probe admitted only owner-linked documents with:

```text
lifecycle: active
source_role: canonical
visibility: public
```

That worked for Harness and Security, but Game exposed the hidden assumption. Its P0/P1/P2 replacement-target specifications were deliberately:

```text
lifecycle: accepted
source_role: canonical
visibility: public
```

They were linked directly by the current Game authority decision, yet the W2 filter discarded them. Before correction, the Game envelope contained only five documents. After removing lifecycle as a dependency-admission gate, it contained eight: five active current/vision/authority documents plus three accepted target specifications.

The resulting rule is narrower:

> Authority dependency and document lifecycle are different dimensions.

If a current authority decision depends on an accepted target specification, that target belongs in the public semantic envelope precisely so the publication can preserve that it is accepted target truth rather than current product truth.

## Second falsifier: owner authority can itself have a provenance hole

Game's canonical README had advanced beyond its authority map. It described `STATION_ZERO_V3_P3.md` as the implemented first-playable planning layer and linked it as part of the current v3 target. The file existed and documented the dedicated API, `/v3` browser, fixture-backed Agent planning, Preview/Commit boundary, and recovery.

But P3 had:

- no document frontmatter;
- no `.ordivon/project.yaml` managed-path entry;
- no `docs/authority.md` current-authority entry.

W3 tested the consequence in an isolated clean Git Workspace. Only P3 was changed and committed. The Workspace HEAD moved to a new commit, but the Web probe still returned the old Game public-source revision and the same aggregate envelope digest; `p3_in_envelope=false`.

That is a real provenance hole:

```text
P3 semantic change
        ↓
clean committed owner repository
        ↓
public-source revision unchanged
        ↓
Web publication not invalidated
```

Web cannot safely repair that by guessing that every Markdown file linked from README is authoritative. The owner must declare the dependency.

## Owner-side correction

Game therefore received one independent documentation-authority correction at commit:

```text
6e8c668c29378b7707e099a39a3039f8fec42737
```

The correction:

- added canonical public frontmatter to P3 with `lifecycle: accepted`;
- added P3 to `.ordivon/project.yaml` managed paths;
- added P3 to the current authority Decision and related IDs;
- corrected the README current boundary to say what the implementation already proved: v3 has an implemented separate first-playable, but remains unregistered and does not replace v2.

No Game code, registry, product registration, or target acceptance was changed.

After that correction, the Game envelope contains nine documents:

| Role in current public judgment | Owner documents | Lifecycle |
| --- | --- | --- |
| registered/current orientation | README, PRODUCT, ARCHITECTURE | active |
| authority relation | authority | active |
| accepted unregistered v3 target | P0, P1, P2, P3 | accepted |
| long-range possibility | VISION | active |

P3-only future changes now alter the bound revision/digest because P3 is an explicit owner authority dependency.

## Did W3 require a new product-state database?

No.

The first minimal attempt retained the existing `ProjectDefinition` and added no universal `current | target | preview | historical` schema. The committed Game source snapshot preserves each owner's document lifecycle. The Web-owned publication judgment then states the relation explicitly:

```text
v2
  = registered current product

v3 P0–P3
  = accepted + implemented + first-playable
  = replacement target
  ≠ registered current product

VISION
  = long-range possibility
  ≠ feature commitment

Alpha article
  = historical publication
  ≠ current product state
```

This is sufficient for the current UI because the product page already separates Current status, Evidence, Where it stands now, ownership boundaries, current research questions, and historical related publications.

A universal temporal schema would currently duplicate domain semantics without adding a second materially different consumer. W3 therefore does not introduce one.

## Source-bound Game publication

Game now follows the same build pattern as Harness and Security:

```text
Game owner authority
        ↓
game-source.json          derived owner dependency snapshot
        +
game-publication.json     Web editorial judgment
        ↓
generated-game.ts         disposable build projection
        ↓
Project / Home / Now / Research
```

The source snapshot binds:

- project identity and public-projection target;
- current authority declaration;
- all nine canonical public dependencies;
- each dependency's lifecycle/readiness;
- exact latest revision touching that envelope;
- aggregate source digest.

The publication is bound to that exact revision and digest.

## Page-level second-fact-store cleanup

Before W3, the central Project entry was mostly accurate but several page-level sentences separately copied Game state:

```text
Home footer
Now summary
Research Question judgment / next step
```

One of them was already semantically wrong: it described v3 as “not yet the replacement target,” while the owner explicitly treated v3 as the accepted replacement target whose registration was deferred.

W3 therefore:

- sources Game's Project object from the bound publication input;
- derives Home and Now current Game state from that Project object;
- re-evaluates the Game research question rather than copying owner prose;
- preserves the historical Station Zero Alpha article as historical evidence.

The Research Question remains Web/research judgment. It now asks for repeated human play and live-Provider comparisons before **registering v3 or deleting v2**, not before “changing the product target.”

## What generalized

Across Harness, Security, and Game, the surviving generic contract is now:

```text
owner project identity
+ current authority declaration
+ canonical public dependency closure
+ exact source revision
+ aggregate digest
+ Web publication judgment
+ disposable generated projection
```

The owner dependency closure may contain different lifecycles and readiness states.

## What did not generalize

W3 rejects these as universal Web rules:

- every authority dependency must be `lifecycle: active`;
- every dependency must be READY;
- newest implemented artifact is the current product;
- accepted target equals registered product;
- vision equals roadmap commitment;
- historical publication equals current project status;
- every project needs one Web-owned temporal-state enum;
- Web should infer missing owner authority from filenames or prose heuristics.

## Stronger interpretation of the public envelope

The envelope should no longer be described as “the current documents.” It is better understood as:

> **the canonical public dependency closure required to make the current publication judgment.**

That distinction explains why an accepted target document belongs in today's envelope without becoming today's product.

## Verification

W3 verified both the provenance failure and the corrected publication path. Before the Game owner correction, a P3-only committed change moved the Game Workspace HEAD while leaving Web's public-source revision unchanged and `p3_in_envelope=false`. After P3 was explicitly admitted by Game's authority map, another isolated P3-only commit produced `projection_revision=test_head`, changed the aggregate digest, and returned `p3_in_envelope=true`.

The static snapshot gate was also strengthened so the aggregate digest binds parsed document identity and temporal metadata as well as file digests. Three deliberate mutations failed closed: changing P3's captured lifecycle without changing its owner binding, changing a captured dependency's visibility, and binding `game-publication.json` to the wrong aggregate source digest.

At final validation time, all three live owner snapshots passed exact `--check`:

```text
Harness   fa23bfc817ce4c63fc5eadc398d044eb6817b7ae
Security  efffb9f82a49cb7e46591a2a2c245cf9064e4266
Game      6e8c668c29378b7707e099a39a3039f8fec42737
staleProjects=[]
retiredCurrentClaimProjects=[]
```

The complete static publication path passed project generation, article generation, publication validation, Next route type generation, TypeScript, ESLint, production compilation, all 57 static routes, static budget reporting, and `git diff --check`. Generated HTML was then inspected directly: Game exposes v2 as the registered current product, P0–P3 as the accepted v3 target, `/v3` as a separate first-playable, and human/live-Provider gates before registration; Home and Now derive the same current state; the Game research dossier asks about registration/deletion rather than target selection; the Alpha remains visibly historical. Security reflects C1–C1G and unpublished-completion pressure, while Harness does not promote its new experimental WorkingSet transition seam into current product copy.

A Playwright smoke attempt could not provide browser acceptance because the installed Playwright package had no matching Chromium binary in the Runtime Workspace cache (`chromium-1234/.../chrome`, `bundled_exists=false`). Request-only cases began passing while browser-dependent cases failed immediately at launch. W3 does not reinterpret that environment failure as a page regression and does not download a browser merely to close the experiment.

W3 also exercised the publication invalidation gate against concurrent owner work. Security's C1-G changed the current research judgment and therefore required a real Web judgment update. Harness's Agent-owned WorkingSet transition changed the public semantic envelope but remained explicitly owner-labeled as an experimental execution seam outside the recommended API, so Web re-bound the source without promoting a new public capability claim.

## Current conclusion

W3 supports the authority-declared projection model and narrows it further:

> Ordivon Web should bind judgment to the owner's declared public semantic dependencies while preserving, not normalizing away, their lifecycle differences.

The common invariant is provenance. Temporal meaning remains domain-owned and editorially interpreted.

Harness, Security, and Game now provide three materially different consumers. That is enough evidence to consider promoting the small provenance contract toward a Public Projection Contract v0, but not enough evidence for a universal project-state ontology.
