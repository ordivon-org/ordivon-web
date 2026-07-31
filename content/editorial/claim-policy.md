# Claim and Evidence Policy

## Purpose

Ordivon should communicate forcefully without asking language to carry more certainty than the evidence.

Marketing here means selecting the important result, framing why it matters, packaging it clearly, and distributing it to the right reader. It does not mean hiding limitations, manufacturing adoption, or converting a prototype into a platform claim.

## Claim classes

Every important public claim should be identifiable as one of the following.

| Class | Meaning | Typical language | Evidence obligation |
| --- | --- | --- | --- |
| Observed fact | Directly recorded state or event | “The run produced…” | Link or point to source, receipt, release, artifact, or exact repository state. |
| Experimental result | Outcome under a defined setup | “Across 84 bounded trials…” | State setup, sample, baseline, metric, and limitation. |
| Engineering inference | Generalization from observed behavior | “This suggests the boundary belongs…” | Name supporting observations and plausible alternatives. |
| Architecture decision | Chosen allocation of responsibility | “We will keep…” | State alternatives, rationale, consequences, and reopening/deletion condition. |
| Thesis | Broad argued position | “We argue that…” | Use sources, mechanism, objections, and connection to practice. |
| Forecast | Claim about future development | “We expect…” | Mark uncertainty, assumptions, horizon, and invalidating conditions. |
| Aspiration | Desired future or project ambition | “Ordivon aims to…” | Do not present as current capability or evidence. |

Do not move between classes silently within one paragraph.

## Evidence levels

### E0 — assertion

A stated belief or idea without independent support. Appropriate only when labeled as a question, aspiration, or early hypothesis.

### E1 — reasoned argument

Mechanism, analogy, prior work, or source-supported inference. Useful for essays and architecture proposals, but not proof of implementation.

### E2 — observed dogfood

A real use exposed a failure or supported a mechanism. Record environment and scope. Do not generalize to broad reliability.

### E3 — bounded experiment

Defined setup, controls or baselines, repeated runs where appropriate, retained outputs, and explicit limits.

### E4 — reproducible engineering evidence

Exact source revision, tests, receipts, artifacts, release identity, replay, or independent verification make the result reproducible.

### E5 — external replication or sustained operation

Independent use, third-party reproduction, or long-term operational evidence. Ordivon should rarely imply this level unless it actually exists.

Public language must not imply a higher level than the source supports.

## Use of “proved”

Use **proved** only for a bounded proposition under an explicit tested scope.

Acceptable:

> H1–H5 proved that one Host TaskAttempt could remain coherent across both tested Codex/Hermes replacement orders while provider sessions remained different.

Not acceptable:

> H1–H5 proved durable agent work.

Prefer:

- demonstrated within the tested scope;
- supported;
- survived the comparison;
- falsified the previous boundary;
- did not establish;
- remains open.

## Metrics

Every metric should include the context required to interpret it:

- numerator and denominator;
- unit;
- workload or population;
- time window when relevant;
- baseline or previous value;
- whether the measurement is direct, provider-reported, or derived;
- known measurement limits.

Example:

> Four real provider runs completed two replacement orders. The providers reported 493,294 tokens in total; the number measures reported usage, not useful work or model quality.

Do not use a large number solely as visual proof of seriousness.

## Baselines and alternatives

A claim that an Ordivon abstraction is necessary should compare against the strongest practical alternative available.

Possible baselines include:

- direct model API use;
- mature provider harness;
- existing durable workflow system;
- current-revision retrieval;
- database or file-backed state;
- deterministic projection;
- ordinary Git and process tools;
- no new abstraction.

The baseline should be capable enough to make the proposed architecture lose.

## Negative results and deletion

Negative results are first-class publication material when they change allocation or architecture.

Record:

- what was expected;
- what failed;
- whether the failure belongs to the model, harness, host, runtime, workload, measurement, or hypothesis;
- what was removed or narrowed;
- whether the question is closed or transferred.

Do not frame every deletion as a victory. State the lost time or implementation cost when relevant.

## Limitations

Every research report and consequential architecture decision should contain a visible limitation section.

Limitations should answer:

- What population, provider, workload, or environment was not tested?
- Which result may be caused by the setup?
- Which metric does not represent the broader objective?
- What did the experiment deliberately hold fixed?
- Which conclusion is an inference rather than an observation?
- What evidence would change the judgment?

Avoid ritual language such as “more research is needed” without naming the missing pressure.

## Source hierarchy

Prefer sources in this order:

1. exact Ordivon repository, commit, release, test, receipt, artifact, or report;
2. official provider documentation or protocol;
3. primary research paper, standard, benchmark, or dataset;
4. authoritative institutional report;
5. high-quality secondary analysis;
6. informal discussion, used only for context or discovery.

A public article may summarize primary evidence, but the summary must not replace it.

## External comparisons

When discussing OpenAI, Anthropic, Google, Microsoft, Temporal, LangGraph, or another system:

- describe only documented behavior or directly observed integration behavior;
- distinguish product surface from underlying architecture;
- avoid implying internal implementation details not established by sources;
- date claims that may change;
- avoid using a competitor as a rhetorical straw baseline.

## Product and maturity language

Use maturity labels precisely.

- **research prototype** — built to test a question;
- **source-playable alpha** — exact source release supports a bounded journey;
- **production-tested locally** — used in the maintained local environment, not externally production-proven;
- **released** — an exact public artifact exists;
- **core complete** — the defined core scope is closed, not all operations or product work;
- **public project** — visible project with current page and repository, not necessarily generally usable.

Avoid without evidence:

- production-ready;
- enterprise-grade;
- industry-leading;
- robust at scale;
- universal;
- autonomous;
- secure;
- reliable;
- proven across providers or workloads.

## Corrections and revisions

Dated articles should not silently rewrite historical claims.

- Fix typographical and link errors directly.
- Use `revisedAt` for substantive clarification.
- Add an editorial note when a conclusion changed materially.
- Publish a new article when a later result reverses or supersedes the central argument.
- Keep historical release facts tied to their original version.
- Current Project and Question pages may update, but should link to the dated argument that caused the change.

## Marketing boundary

Permitted:

- choosing a strong title;
- leading with the most important result;
- using narrative, history, conflict, and visual explanation;
- repeating stable brand language;
- packaging one result for different channels;
- explaining why the work matters;
- making a strong thesis vulnerable to criticism.

Not permitted:

- hiding negative evidence;
- implying users, customers, adoption, team size, or institutional status that does not exist;
- treating internal complexity as market validation;
- presenting plans as shipped capability;
- using benchmark numbers without scope;
- describing formal object names as industry consensus;
- making risk, safety, or security guarantees unsupported by testing.

## Final claim review

For every major sentence, ask:

1. What class of claim is this?
2. What evidence level supports it?
3. Does the wording imply more?
4. Is the scope visible?
5. Is there a stronger alternative explanation?
6. What would make the claim false or obsolete?
7. Does the reader know why it matters?
