# Ordivon Editorial System

Status: canonical editorial guidance for `ordivon-web`  
Established: 31 July 2026  
Applies to: interface copy, metadata, articles, release notes, research reports, diagrams, RSS summaries, social cards, and repository-facing publication copy.

## Purpose

Ordivon Web is not only a renderer for repository state. It is the public editorial layer through which independent research, engineering results, project judgment, and long-term positions become understandable, memorable, and useful.

The editorial system exists to prevent two equal failures:

1. reducing real research to vague promotion; and
2. publishing correct internal language that requires readers to reconstruct the value themselves.

The desired public standard is:

> Bold in judgment. Precise in evidence. Plain before technical. Concrete before abstract.

## Canonical files

- [`positioning.md`](./positioning.md) — what Ordivon is, why it matters, and the message hierarchy.
- [`audiences.md`](./audiences.md) — primary readers, their questions, and the appropriate entry path.
- [`voice.md`](./voice.md) — sentence-level tone, rhythm, terminology, calls to action, and examples.
- [`vocabulary.md`](./vocabulary.md) — public terminology, capitalization, definitions, and progressive disclosure.
- [`article-types.md`](./article-types.md) — publication taxonomy, required structure, and selection rules.
- [`claim-policy.md`](./claim-policy.md) — evidence obligations, claim classes, limitations, corrections, and marketing boundaries.
- [`audit-2026-07-31.md`](./audit-2026-07-31.md) — R1 inventory and scored baseline of the current public copy.
- [`r2-p0-2026-07-31.md`](./r2-p0-2026-07-31.md) — implemented high-leverage entry, title, metadata, and social-distribution changes.

## Editorial sequence

Every important public surface should answer these questions in order:

1. **What changed or what problem exists?**
2. **Why does it matter outside Ordivon?**
3. **What is Ordivon's judgment?**
4. **What evidence supports that judgment?**
5. **What remains uncertain?**
6. **Where should the reader go next?**

Internal architecture may require additional precision. It should not replace this sequence.

## Source-of-truth boundary

Public copy may interpret and organize the work. It must not become a second technical authority.

- Repositories own source, tests, release identity, receipts, and live implementation state.
- Research records own detailed experimental setup and raw evidence.
- Dated articles own their published argument at that date.
- Current Question and Project metadata own only the present public orientation.
- Interface copy owns navigation and explanation, not technical truth.

## Use in review

A change to a public page or article should be reviewed against the relevant files above. The system is guidance, not a mandatory prose bureaucracy. Apply it where it improves comprehension, credibility, or reach; do not create process that costs more than the communication failure it prevents.
