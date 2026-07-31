# Ordivon Web — Core A-Series Constraint Audit

Date: 1 August 2026  
Web baseline: `86b014f4fff020a139dd141bc3b5cf43b062463c`  
Computer Core: `be5fe779267f0225dd37c570932c7d71ee5223a7`

## Audit method

The Web architecture was reviewed against A0–A16, with special weight on A1, A7–A8, A11, A13–A16. A persistent constraint remains only when it answers a real loss, a narrower recovery path is insufficient, recurring benefit exceeds recurring friction, and a review or deletion condition remains visible.

## Constraint dispositions

| Constraint | Observed loss | Disposition | Why | Review or deletion condition |
|---|---|---|---|---|
| Article source synchronization | Metadata and MDX could be registered independently | **retain, generate** | One MDX source plus a generated manifest removes the double fact | Delete the generator if the framework later provides equivalent typed discovery with less machinery |
| Table of contents contract | Hand-authored TOC could drift from headings | **retain, derive** | TOC is generated from h2 identity and optional display labels | Remove custom labels if heading text becomes sufficient |
| At least one limitation | Public claims can hide their boundary | **retain** | Directly protects claim interpretation with low recurring cost | Narrow only if a publication class demonstrably cannot express a meaningful limitation |
| Three-to-five takeaways | No repeated loss required this exact count | **shrink** | At least one explicit retained conclusion is sufficient; editorial judgment controls length | Reintroduce a range only after reading evidence shows a recurring scanning failure |
| Canonical research record on every article | Essays and theses may not have one exact technical record | **localize** | E3–E5 require a source; E0–E2 may omit it | Expand only when a lower-evidence class repeatedly becomes unverifiable |
| Home proof at E3+ | The primary public proof must not be assertion-only | **retain** | Consequential public positioning needs bounded evidence | Revisit when Home no longer leads with an empirical proof |
| Editorial selections cannot point to superseded work | Navigation can silently promote an obsolete judgment | **retain** | Prevents a direct public contradiction | Delete only if supersession is removed from the publication model |
| Full browser and axe checks | Mobile overflow, inaccessible scroll regions, and hydration failures occurred in real runs | **retain** | Reproduced failures justify the gate | Narrow route coverage when equivalent component-level evidence removes repeated runtime value |
| Type, lint, build, source validation | Broken references and generated drift can prevent publication | **retain** | Low-friction deterministic checks at the commitment boundary | Remove redundant checks when one tool subsumes the same invariant |
| Exact deployment-source audit | Main and live production previously diverged | **retain, simplify** | A full-SHA public manifest verifies consequence without a generated branch | Delete only when the hosting platform exposes an equally direct immutable source identity |
| Dirty-worktree and production-branch deployment policy | Was needed by a local push script | **delete** | Official Pages Artifacts isolate build and deployment without maintaining generated Git history | Do not restore unless Artifact deployment loses source identity or rollback capability |
| Bundle budget | No measured user harm currently justifies blocking publication | **advisory** | Makes cost visible without converting a proxy into authority | Promote only after real performance evidence and a measured threshold |
| Status shared across projects, questions, and boundaries | One enum blurred unrelated lifecycle semantics | **delete and split** | Project lifecycle, question state, and boundary maturity now describe different facts | Recombine only if a real consumer requires one invariant across all three |
| Computing as a fourth execution layer | Public diagrams implied a false runtime sequence | **delete and reframe** | Computing is research/conformance pressure outside the Task execution path | Reopen only if Computing begins owning non-bypassable production state |
| Decorative quantitative encoding | Visual height implied unsupported measurement | **delete** | Evidence figures must not invent magnitude | Use quantitative encoding only when bound to declared data and units |
| Hardcoded production copy markers | Ordinary editorial changes could fail operations audit | **delete** | Status, canonical metadata, manifest identity, and structured contracts are sufficient | Add a marker only for a reproduced failure invisible to structural checks |

## A-Series architecture result

- **A1:** Next.js static export, GitHub Pages, Git, MDX, and browser standards remain inherited substrate; no CMS or custom publication database was added.
- **A7–A8:** Authoring and local generation remain broad and reversible. Strong checks concentrate at publication and deployment commitment.
- **A11:** Exact-count prose constraints, generated-branch deployment, shared status enums, and copy-marker audits were removed or narrowed.
- **A13:** No new shared runtime layer was admitted. The article compiler is build-local and owns only source discovery, TOC derivation, and generated imports.
- **A14:** Historical documents and redirects remain evidence, while obsolete live compatibility and dead code are deleted.
- **A15:** Editorial choices remain authored in `selections.ts`; recency and metrics do not mechanically decide importance.
- **A16:** The redesign reduces repeated maintenance and preserves the ability to replace the framework, hosting workflow, or publication representation later.

## Boundary

This audit is an authored decision record, not a machine-readable governance registry. It should be revised when a constraint changes materially and deleted if maintaining it no longer helps future judgment.
