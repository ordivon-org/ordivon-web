# N0 — Agent-Native Web and Aesthetic Laboratory Foundation

## Question

W0–W3 proved that Ordivon Web should compile source-bound public judgment instead of making an Agent copy repository facts like a human webmaster.

That still left two larger questions:

1. how should an Agent generate and manage the Web as a whole rather than only maintain project facts?
2. how should a human-facing interface study aesthetic quality without turning the Agent's taste or one automated score into authority?

N0 compares mature external patterns, audits the current repository, and lands the smallest foundation that changes those two operating models without redesigning the public site.

## External pattern review

### Structured design context for Agents

[v0 design systems](https://v0.dev/docs/design-systems) treats a registry as structured context that can expose components, blocks, and design tokens to AI generation. [Builder MCP](https://www.builder.io/c/docs/builder-mcp/) similarly grounds coding Agents in component guidance, examples, patterns, and tokens rather than relying on a screenshot alone.

Figma's current MCP direction goes further: Agents can consume structured design context and write native frames, components, variables, and auto-layout back to the canvas. Figma's own guidance emphasizes component reuse, variables, semantic naming, Auto Layout, annotations, and Code Connect because otherwise the model is forced to infer implementation intent.

**Retained principle:** an Agent needs a narrow machine-readable map of the design language and real implementation primitives.

**Not retained:** a Figma, Builder, v0, or shadcn runtime dependency merely to obtain that principle.

### Proposed changes before public consequence

Sanity Content Agent separates hypothetical Agent changes from drafts/releases and lets them be previewed before they become content state. Content Releases and preview perspectives similarly separate the in-flight future state from the published state.

Vercel and Cloudflare Pages apply the same broad idea to code: branches or pull requests produce preview deployments while production remains a separate promotion consequence.

**Retained principle:** candidate generation and production publication are distinct states; the candidate should be previewable and verifiable before promotion.

**Agent-first correction:** “a human must click approve” is not a universal invariant. Promotion requires publication authority. Human evidence is specifically required when the tested claim is about human perception, comprehension, preference, or usability.

### Visual correctness is not functional correctness

Storybook isolates component states; its visual-testing ecosystem compares rendered snapshots against known baselines, while its accessibility tooling evaluates a different class of failures.

**Retained principle:** software correctness, accessibility, visual regression, and aesthetic judgment are separate evidence layers.

**Deferred equipment:** Storybook and Chromatic are not added in N0 because Ordivon does not yet have repeated component-state or screenshot experiments that require them.

### Portable token representation

The Design Tokens Community Group 2025.10 technical report is a stable community specification for exchanging typed design tokens. It provides standard value shapes for colors, dimensions, typography, font families, and other repeated design values.

**Retained principle and implementation:** the existing root design values now use DTCG-compatible color, dimension, and font-family value shapes. An Ordivon extension maps each token to the existing CSS custom-property name.

### Aesthetics as empirical human perception

Lavie and Tractinsky's web-aesthetics work distinguished orderly/classical and expressive dimensions rather than treating beauty as one obvious scalar. Moshagen and Thielsch's VisAWI later validated four useful facets: simplicity, diversity, colorfulness, and craftsmanship. VisAWI-S showed that shorter aesthetic measures can remain useful while correlating differently from usability and content quality.

**Retained principle:** aesthetic evaluation can be made more disciplined without pretending it is objective in one number.

**Rejected principle:** optimize a model-generated “beauty score.”

## Local baseline

Before N0 the repository contained:

```text
8 CSS files
139,355 CSS bytes
~1,222 CSS rule blocks
18 root CSS variables
18 TSX components
11 page routes
0 structured design files
0 Storybook files
0 visual baseline files
```

The visual language was real but mostly implicit. An Agent could inspect it, but only by reading the same implementation details a human designer would inspect manually.

The eighteen root variables already represented a small repeated design vocabulary:

- canvas and foreground colors;
- divider and signal colors;
- maximum shell/article widths;
- sans/serif/mono font stacks.

N0 therefore extracted only these already-proven shared values. It did not mechanically tokenize every literal in the stylesheet.

## New two-axis model

### Axis A — Agent-native Web generation and management

```text
public intent / owner change
        ↓
observe owner + editorial + design authority
        ↓
judge public consequence
        ↓
generate a reversible candidate
        ↓
build static preview
        ↓
verify source + software + interface evidence
        ↓
promote with publication authority
```

W0–W3 source-bound project projection becomes one subsystem of this larger loop.

The current candidate representation remains Git Workspace + diff + generated output + verification artifacts. N0 does not create a WebChangeSet database.

### Axis B — Aesthetic laboratory

```text
aesthetic hypothesis
        ↓
Agent-generated bounded variants
        ↓
canonical benchmark surfaces
        ↓
mechanical preflight
        ↓
human aesthetic / comprehension evidence
        ↓
promote / retain / reject
```

Stable design context and cheap aesthetic exploration remain separate. A design system that cannot be challenged becomes a fossil; unconstrained generation without a design system becomes random style search.

## N0 implementation

### Design token authority

`design/tokens.json` now owns the existing eighteen root tokens using typed design-token values.

`scripts/generate-design-tokens.mjs` deterministically translates them to:

```text
styles/generated-design-tokens.css
```

The CSS output is ignored and build-local. `app/globals.css` retains only the dark color-scheme policy and consumes the generated variables.

### Agent design context

`design/context.json` provides one machine-readable design entry containing:

- canonical design/editorial authority paths;
- eight existing reusable implementation primitives;
- five benchmark surfaces representing unlike public tasks.

`scripts/validate-design-context.mjs` proves those authorities and component exports still exist.

### Agent Web context report

`scripts/report-agent-web-context.mjs` produces a derived JSON report combining:

- the canonical Agent Web entry;
- current committed Harness/Security/Game source bindings and public states;
- design token identities and descriptions;
- reusable primitives;
- benchmark surfaces.

It is a navigation projection, not a new source of truth.

### Canonical architecture

`content/editorial/agent-web-system.md` now owns the Agent-native observe → judge → generate → preview → verify → promote loop.

`design/README.md` owns design context.

`design/aesthetic-research.md` owns the aesthetic experiment method.

Existing Web authority/publication documents were updated to keep these responsibilities explicit.

## Verification

The first requirement was that introducing design authority must not accidentally redesign the site.

The original W3 root-variable set was compared with generated N0 output after semantic CSS normalization:

```text
design_authority_migration=semantic_noop
tokens=18
built_css_contains_generated_tokens=true
```

Generation and context checks passed:

```text
design_token_projection=verified tokens=18
design_context=passed tokens=18 primitives=8 surfaces=5
agent_context=passed projects=harness,security,game
```

Three negative tests also failed closed:

```text
generated_token_drift=rejected
missing_primitive_source=rejected
duplicate_token_variable=rejected
```

During N0, the existing owner-source invalidation gate caught new concurrent work rather than letting the design refactor publish stale project state. Harness changed its experimental discovery/WorkingSet overlay provenance and was re-bound with no new public capability claim. Security advanced from C1-G to accepted C1-H unpublished-completion evidence, so its Project and Research judgment were genuinely updated. Game's owner repository advanced in unrelated work without changing its public semantic envelope and therefore did not force a publication rebind.

This supplies a concrete management example for the new architecture: one Web change may simultaneously contain a design-authority migration, a source rebind/public no-op, and a source rebind/public judgment update without collapsing those consequences together.

The complete non-browser static publication chain passed:

```text
project projection
article generation
publication contract
design generation/check
Next type generation
TypeScript
ESLint
Next production build
57 static routes
static budget
git diff --check
```

Browser capture is still unavailable in the current Runtime Workspace because the matching Playwright Chromium binary is not installed. N0 therefore establishes benchmark surfaces but does not claim screenshot or visual-regression acceptance.

## What N0 deliberately did not build

- no CMS;
- no content database;
- no design database;
- no universal page schema;
- no WebChangeSet persistence layer;
- no Storybook or Chromatic;
- no Figma/Builder/v0 dependency;
- no Vercel/Cloudflare hosting migration;
- no aesthetic score;
- no full tokenization of the existing CSS;
- no visible redesign.

## Result

W0–W3 changed how Web obtains public truth. N0 changes how an Agent is expected to **operate the Web itself**.

The new working model is:

> **Ordivon Web is an Agent-operated public judgment and design compiler whose output is human-facing, statically publishable, and experimentally revisable.**

The next experiment should finally use this foundation for what it was built for: generate a small family of real visual alternatives, compare them across unlike benchmark surfaces, and let that practice determine which additional design equipment deserves to exist.
