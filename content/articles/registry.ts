export type TocEntry = { id: string; label: string };
export type ArticleMetadata = {
  slug: string;
  title: string;
  kicker: string;
  deck: string;
  description: string;
  projectSlugs: readonly string[];
  questionSlugs: readonly string[];
  meta: string;
  type: string;
  project: string;
  date: string;
  modifiedDate?: string;
  readMinutes: number;
  author: string;
  lead: string;
  toc: TocEntry[];
};

export const articleMetadata = [
  {
    "slug": "from-tokens-to-work", "title": "From Tokens to Work: The Complete Agent Execution Stack", "kicker": "Architecture guide / Agent systems",
    "deck": "A model generates representations. A harness creates one cognitive, tool-using run. Host preserves the work across runs. Runtime turns admitted actions into physical evidence.",
    "description": "A first-principles walkthrough from token generation to tool execution, verification, TaskOutcome, and graph advancement, compared with OpenAI, Anthropic, Microsoft, Google, and Ordivon's tested boundaries.",
    "projectSlugs": ["computing", "host", "runtime"], "questionSlugs": ["harness-composition-and-completion", "ordivon-harness-v0"],
    "meta": "Architecture guide · Ordivon Computing · Published 31 July 2026 · 12 min read · By zycxfyh", "type": "Architecture guide", "project": "Ordivon Computing",
    "date": "2026-07-31", "modifiedDate": "2026-07-31", "readMinutes": 12, "author": "zycxfyh",
    "lead": "The path from a prompt to completed work is not one model call. It is a stack of nested loops, authority boundaries, physical execution, evidence, and semantic decisions—and each layer fails differently when its owner is unclear.",
    "toc": [{ "id": "a-model-does-not-act", "label": "A model does not act" }, { "id": "four-loops-run-at-different-timescales", "label": "Four loops, different timescales" }, { "id": "the-complete-call-chain", "label": "The complete call chain" }, { "id": "five-kinds-of-memory-are-not-one-memory", "label": "Five kinds of memory" }, { "id": "where-ordivon-draws-the-boundary", "label": "Where Ordivon draws the boundary" }, { "id": "what-top-labs-are-actually-building", "label": "What top labs are building" }, { "id": "the-result-is-a-graph-not-a-chat", "label": "A graph, not a chat" }, { "id": "what-remains-open", "label": "What remains open" }, { "id": "sources-title", "label": "Primary sources" }]
  },
  {
    "slug": "why-ordivon-needs-a-harness", "title": "Why Ordivon Needs a Harness—but Not a Universal Harness", "kicker": "Architecture decision / Agent systems",
    "deck": "Reuse mature provider harnesses when they exist. Own a thin first-party agent loop when a provider supplies intelligence but no complete harness.",
    "description": "Why H5 correctly rejected a common Codex/Hermes lifecycle while a separate Ordivon Harness remains strategically necessary for bare model APIs, local inference, and controlled agent-loop research.",
    "projectSlugs": ["host", "computing"], "questionSlugs": ["harness-composition-and-completion", "ordivon-harness-v0"],
    "meta": "Architecture decision · Ordivon Host · Published 31 July 2026 · 10 min read · By zycxfyh", "type": "Architecture decision", "project": "Ordivon Host",
    "date": "2026-07-31", "modifiedDate": "2026-07-31", "readMinutes": 10, "author": "zycxfyh",
    "lead": "The word Harness had been hiding two different decisions. Ordivon should not flatten mature Provider Agent systems into a lowest-common-denominator platform. It should still be able to turn a bare model API into one bounded, Tool-using, verifiable Agent Run.",
    "toc": [{ "id": "the-word-harness-was-hiding-two-decisions", "label": "Two decisions hidden in one word" }, { "id": "two-paths-not-one-platform", "label": "Two paths, not one platform" }, { "id": "why-the-first-party-loop-is-strategically-necessary", "label": "Why the first-party Loop matters" }, { "id": "why-a-universal-harness-is-the-wrong-goal", "label": "Why universal is the wrong goal" }, { "id": "why-ordivon-harness-can-remain-thin", "label": "Why it can remain thin" }, { "id": "the-admitted-v0", "label": "The admitted v0" }, { "id": "what-v0-deliberately-does-not-contain", "label": "What v0 excludes" }, { "id": "when-ordivon-harness-becomes-a-repository", "label": "Repository promotion gate" }, { "id": "the-deletion-condition-matters", "label": "The deletion condition" }, { "id": "sources-title", "label": "Evidence and sources" }]
  },
  {
    "slug": "what-h1-h5-proved", "title": "What Survived When Codex and Hermes Replaced Each Other Mid-Task", "kicker": "Research report / Harness H1–H5",
    "deck": "Four live provider runs completed both replacement orders and survived stale completion, a missing artifact, and response loss without turning provider output into task truth.",
    "description": "How one task remained coherent through Codex→Hermes and Hermes→Codex replacement, three injected faults, and materially different provider lifecycles.",
    "projectSlugs": ["host", "runtime", "computing"], "questionSlugs": ["harness-composition-and-completion", "ordivon-harness-v0"],
    "meta": "Research report · Ordivon Host · Published 31 July 2026 · 12 min read · By zycxfyh", "type": "Research report", "project": "Ordivon Host",
    "date": "2026-07-31", "modifiedDate": "2026-07-31", "readMinutes": 12, "author": "zycxfyh",
    "lead": "H1–H5 did not prove that Codex and Hermes were interchangeable. It proved that one Task could remain coherent while their Sessions, event protocols, Tool semantics, final responses, and accepted source implementations remained different.",
    "toc": [{ "id": "the-experiment-was-not-a-provider-benchmark", "label": "Not a Provider benchmark" }, { "id": "the-five-stages", "label": "The five stages" }, { "id": "h3-and-h4-proved-that-harnesses-are-materially-different", "label": "H3 and H4: different Harnesses" }, { "id": "h5-ran-both-replacement-orders", "label": "Both replacement orders" }, { "id": "different-code-same-accepted-work", "label": "Different code, accepted work" }, { "id": "fault-one-stale-assignment", "label": "F1: stale Assignment" }, { "id": "fault-two-process-success-without-artifact", "label": "F2: success without Artifact" }, { "id": "fault-three-response-loss", "label": "F3: response loss" }, { "id": "the-final-message-failed-as-a-contract", "label": "Final text failed as a contract" }, { "id": "what-survived-and-what-did-not", "label": "What survived" }, { "id": "what-h1-h5-did-not-prove", "label": "What H1–H5 did not prove" }, { "id": "the-new-question", "label": "The new question" }, { "id": "sources-title", "label": "Receipts and closeout" }]
  },
  {
    "slug": "creation-judgment-recoverable-systems",
    "title": "Creation, Judgment, and Recoverable Systems",
    "kicker": "Research essay / Project intent",
    "deck": "Ordivon separates task meaning, local execution, and external consequences so models and tools can change without destroying the work they serve; permanent structure stays thin and experimentation stays recoverable.",
    "description": "The canonical public statement of Ordivon's project intent: creation, capability externalization, judgment, changing implementation costs, low governance, high recoverability, and participant freedom.",
    "projectSlugs": ["computing", "web"],
    "questionSlugs": ["smallest-agent-native-core", "web-research-interface"],
    "meta": "Research essay · Ordivon Computing · Published 31 July 2026 · 7 min read · By zycxfyh",
    "type": "Research essay",
    "project": "Ordivon Computing",
    "date": "2026-07-31",
    "modifiedDate": "2026-07-31",
    "readMinutes": 7,
    "author": "zycxfyh",
    "lead": "Ordivon is a chosen practice of creation: it gives durable form to finite thought, intention, judgment, research, and action while keeping models, implementations, and governance replaceable wherever consequence remains recoverable.",
    "toc": [
      { "id": "creation-is-a-way-of-entering-the-world", "label": "Creation as participation" },
      { "id": "tools-move-capability-beyond-the-immediate-participant", "label": "Tools externalize capability" },
      { "id": "continuity-surrounds-finite-participants", "label": "Continuity for finite participants" },
      { "id": "judgment-operates-where-criteria-remain-open", "label": "Judgment and formal systems" },
      { "id": "the-cost-structure-has-changed", "label": "The cost structure changed" },
      { "id": "thin-core-high-potential-low-governance-high-recoverability", "label": "Four engineering consequences" },
      { "id": "wide-interior-narrow-consequence-boundary", "label": "Wide interior, narrow boundary" },
      { "id": "durable-governance-bears-a-higher-burden", "label": "Governance bears the burden" },
      { "id": "how-ordivon-is-measured", "label": "How Ordivon is measured" },
      { "id": "a-practical-decision-test", "label": "A practical decision test" },
      { "id": "sources-title", "label": "Canonical foundations" }
    ]
  },
  {
    "slug": "station-zero-alpha-1",
    "title": "Station Zero v0.1.0-alpha.1 — The First Source-Playable Release",
    "kicker": "Release note / Agent-native game",
    "deck": "The first source-playable developer alpha binds one mission, exact replay, evidence-linked diagnosis, immutable deployment, same-case comparison, reload recovery, and clean archive verification to one release identity.",
    "description": "What shipped in Station Zero v0.1.0-alpha.1, how the release journey is verified, what one coordination-only comparison proves, and which agent-native game claims remain open.",
    "projectSlugs": ["game"],
    "questionSlugs": ["game-agent-native-mechanics"],
    "meta": "Release note · Ordivon Game · Published 31 July 2026 · 5 min read · By zycxfyh",
    "type": "Release note",
    "project": "Ordivon Game",
    "date": "2026-07-31",
    "modifiedDate": "2026-07-31",
    "readMinutes": 5,
    "author": "zycxfyh",
    "lead": "Station Zero is now downloadable as an exact source release. The player can complete a bounded mission, inspect an earlier World revision, follow evidence-linked diagnosis, change one immutable input, run again, compare exact outcomes, and recover the same Run after reload.",
    "toc": [
      { "id": "a-playable-release-not-a-platform-promise", "label": "A playable release" },
      { "id": "the-player-loop", "label": "The player loop" },
      { "id": "one-input-changed-the-terminal-outcome", "label": "One input changed the outcome" },
      { "id": "replay-and-diagnosis-are-release-features", "label": "Replay and diagnosis" },
      { "id": "the-release-is-bound-to-exact-bytes", "label": "Exact release identity" },
      { "id": "what-the-alpha-proves", "label": "What the Alpha proves" },
      { "id": "what-the-alpha-does-not-prove", "label": "What it does not prove" },
      { "id": "the-next-game-question", "label": "The next game question" },
      { "id": "sources-title", "label": "Release record" }
    ]
  },
  {
    "slug": "thin-host-without-hidden-planner",
    "title": "A Thin Host Can Improve Strategy Without Becoming a Planner",
    "kicker": "Engineering report / Host semantics",
    "deck": "The World, models, admission rules, Skills, verification, and replay stayed fixed. Explicit Goal dependencies, threat horizons, regression meaning, and one-step visibility changed two live paths from failure to verified victory.",
    "description": "How Station Zero M2.1 improved Codex and Codex-to-Hermes strategy by compiling trustworthy decision semantics without forcing rank one, adding unrestricted memory, or introducing a hidden planner.",
    "projectSlugs": ["host", "game"],
    "questionSlugs": ["host-general-repository-goal", "game-agent-native-mechanics"],
    "meta": "Engineering report · Ordivon Host and Game · Published 31 July 2026 · 5 min read · By zycxfyh",
    "type": "Engineering report",
    "project": "Ordivon Host / Game",
    "date": "2026-07-31",
    "modifiedDate": "2026-07-31",
    "readMinutes": 5,
    "author": "zycxfyh",
    "lead": "A persistent Host had already preserved identity, execution, recovery, and Provider replacement. Strategy improved only after the Host made current Goal structure and consequence visible—without taking the final choice away from the model.",
    "toc": [
      { "id": "the-model-did-not-need-more-history", "label": "The model did not need more history" },
      { "id": "the-world-model-and-admission-rules-stayed-fixed", "label": "What stayed fixed" },
      { "id": "before-and-after", "label": "Before and after" },
      { "id": "what-the-host-actually-compiled", "label": "What Host compiled" },
      { "id": "the-host-did-not-force-the-best-ranked-action", "label": "No forced rank-one policy" },
      { "id": "hermes-remained-a-required-counterexample", "label": "Hermes remained a counterexample" },
      { "id": "why-not-a-planner", "label": "Why not a planner" },
      { "id": "what-this-experiment-proves", "label": "What it proves" },
      { "id": "what-it-does-not-prove", "label": "What it does not prove" },
      { "id": "sources-title", "label": "M2.1 record" }
    ]
  },
  {
    "slug": "one-authority-thirteen-tables",
    "title": "One Authority, Thirteen Tables Deleted",
    "kicker": "Engineering report / Boundary correction",
    "deck": "A working Python Host sidecar lost to an embedded authority on startup, lifecycle latency, code size, deployment, and recovery cost. The cutover preserved exact World outcomes while deleting thirteen duplicate truth tables.",
    "description": "Why Ordivon Game reused the Host contract without forcing every workload through one Python process, and how unique semantic authority enabled a net deletion of 641 implementation and test lines.",
    "projectSlugs": ["host", "game"],
    "questionSlugs": ["contracts-across-a-second-workload"],
    "meta": "Engineering report · Ordivon Host and Game · Published 31 July 2026 · 5 min read · By zycxfyh",
    "type": "Engineering report",
    "project": "Ordivon Host / Game",
    "date": "2026-07-31",
    "modifiedDate": "2026-07-31",
    "readMinutes": 5,
    "author": "zycxfyh",
    "lead": "The sidecar was functionally correct. It was deleted because the in-process Game workload gained no capability from the process boundary while paying transport, startup, deployment, code-size, and split-recovery cost.",
    "toc": [
      { "id": "semantic-reuse-created-two-authorities", "label": "Semantic reuse created two authorities" },
      { "id": "the-sidecar-worked", "label": "The sidecar worked" },
      { "id": "one-authority-replaced-reconstruction", "label": "One authority replaced reconstruction" },
      { "id": "thirteen-duplicate-truth-tables-left", "label": "Thirteen tables left" },
      { "id": "world-results-did-not-move", "label": "World results did not move" },
      { "id": "what-game-still-owns", "label": "What Game still owns" },
      { "id": "the-general-lesson", "label": "The general lesson" },
      { "id": "what-this-does-not-generalize", "label": "What does not generalize" },
      { "id": "sources-title", "label": "Authority record" }
    ]
  },
  {
    "slug": "replay-without-second-truth-store",
    "title": "Replay Without a Second Truth Store",
    "kicker": "Engineering report / Evidence systems",
    "deck": "Station Zero derives point-in-time World state, evidence graphs, bounded frames, curves, key turns, diagnosis, and exact comparison from retained authority without creating another synchronized database or asking a model to invent causality.",
    "description": "How replay and evidence-linked diagnosis can remain pure deterministic projections of World, Host, Team, authority, Message, Provider, Effect, Observation, and verification records.",
    "projectSlugs": ["game"],
    "questionSlugs": ["game-agent-native-mechanics"],
    "meta": "Engineering report · Ordivon Game · Published 31 July 2026 · 6 min read · By zycxfyh",
    "type": "Engineering report",
    "project": "Ordivon Game",
    "date": "2026-07-31",
    "modifiedDate": "2026-07-31",
    "readMinutes": 6,
    "author": "zycxfyh",
    "lead": "Replay becomes dangerous when it quietly becomes another authority. Station Zero instead rebuilds explanation from stable identities and retained evidence, so the projection can be deleted and regenerated without changing the work it describes.",
    "toc": [
      { "id": "replay-is-easy-to-add-and-easy-to-corrupt", "label": "Replay can create another authority" },
      { "id": "one-graph-from-existing-evidence", "label": "One graph from existing evidence" },
      { "id": "point-in-time-state-comes-from-world-authority", "label": "Point-in-time World state" },
      { "id": "diagnosis-needs-evidence-classes", "label": "Evidence classes" },
      { "id": "key-turns-are-derived-not-authored", "label": "Derived key turns" },
      { "id": "comparison-is-exact-only-when-inputs-are-compatible", "label": "Exact comparison" },
      { "id": "pure-reads-have-a-recovery-advantage", "label": "Recovery through pure reads" },
      { "id": "what-this-architecture-refuses", "label": "What it refuses" },
      { "id": "the-general-use", "label": "The general use" },
      { "id": "sources-title", "label": "Replay record" }
    ]
  },
  {
    "slug": "transcript-not-task-database",
    "title": "A Transcript Is Not a Task Database",
    "kicker": "Research note / Task continuity",
    "deck": "Conversation history can preserve rationale while omitting the operation identity, source revision, authority, and unresolved commitment that determine whether the next action is safe.",
    "description": "Why transcripts and summaries remain useful cognitive evidence but should not become the authoritative database of durable agent work.",
    "projectSlugs": ["computing"],
    "questionSlugs": ["smallest-agent-native-core"],
    "meta": "Research note · Ordivon Computing · Published 31 July 2026 · 3 min read · By zycxfyh",
    "type": "Research note",
    "project": "Ordivon Computing",
    "date": "2026-07-31",
    "modifiedDate": "2026-07-31",
    "readMinutes": 3,
    "author": "zycxfyh",
    "lead": "A summary can preserve the story of a Task while deleting the exact pending operation whose retry would duplicate reality.",
    "toc": [
      { "id": "a-transcript-can-explain-without-authorizing", "label": "Explain without authorizing" },
      { "id": "the-missing-facts", "label": "The missing facts" },
      { "id": "more-transcript-can-be-less-safe", "label": "More transcript can be less safe" },
      { "id": "what-a-transcript-is-good-for", "label": "What transcript is good for" },
      { "id": "the-thin-boundary", "label": "The thin boundary" },
      { "id": "sources-title", "label": "Related record" }
    ]
  },
  {
    "slug": "unknown-is-operational-state",
    "title": "UNKNOWN Is an Operational State, Not a Model Feeling",
    "kicker": "Research note / Effect ambiguity",
    "deck": "A lost response becomes operationally meaningful only when uncertainty remains bound to stable identity, backend correlation, reconciliation, and a prohibition on blind redispatch.",
    "description": "Why unresolved external reality must be represented as system state rather than inferred from model confidence or collapsed into failure.",
    "projectSlugs": ["runtime", "world"],
    "questionSlugs": ["runtime-structured-effect", "calibrated-non-action"],
    "meta": "Research note · Ordivon Runtime and World · Published 31 July 2026 · 3 min read · By zycxfyh",
    "type": "Research note",
    "project": "Ordivon Runtime / World",
    "date": "2026-07-31",
    "modifiedDate": "2026-07-31",
    "readMinutes": 3,
    "author": "zycxfyh",
    "lead": "No response does not imply no commit. Safe continuation begins when uncertainty constrains the next action and preserves a route back to external evidence.",
    "toc": [
      { "id": "no-response-is-not-no-commit", "label": "No response is not no commit" },
      { "id": "the-five-required-invariants", "label": "Five required invariants" },
      { "id": "unknown-is-not-failure", "label": "UNKNOWN is not failure" },
      { "id": "unknown-is-not-model-sentiment", "label": "Not model sentiment" },
      { "id": "where-the-state-belongs", "label": "Where the state belongs" },
      { "id": "waiting-can-be-the-correct-action", "label": "Waiting can be correct" },
      { "id": "sources-title", "label": "Related record" }
    ]
  },
  {
    "slug": "communication-is-gameplay-state",
    "title": "Communication Is Gameplay State",
    "kicker": "Research note / Agent-native games",
    "deck": "The same typed task offer produced victory when delivered locally and power exhaustion when a disabled radio delayed it beyond the coordination window.",
    "description": "Why agent communication needs identity, reachability, delivery state, and World-conditioned timing rather than decorative chat logs or a shared transcript.",
    "projectSlugs": ["game"],
    "questionSlugs": ["game-agent-native-mechanics"],
    "meta": "Research note · Ordivon Game · Published 31 July 2026 · 3 min read · By zycxfyh",
    "type": "Research note",
    "project": "Ordivon Game",
    "date": "2026-07-31",
    "modifiedDate": "2026-07-31",
    "readMinutes": 3,
    "author": "zycxfyh",
    "lead": "A message becomes part of the World when the recipient may not receive it before the action window closes—and the lost time cannot be repaired by showing the text later.",
    "toc": [
      { "id": "the-same-message-produced-two-worlds", "label": "The same message, two Worlds" },
      { "id": "a-message-needs-more-than-text", "label": "More than text" },
      { "id": "reachability-creates-coordination-windows", "label": "Coordination windows" },
      { "id": "the-world-remains-authoritative", "label": "World authority" },
      { "id": "communication-does-not-prove-multi-agent-superiority", "label": "What it does not prove" },
      { "id": "sources-title", "label": "Related record" }
    ]
  },
  {
    "slug": "winning-move-loses-contest",
    "title": "Winning the Move Can Lose the Contest",
    "kicker": "Research report / Adversarial agency",
    "deck": "Across 84 bounded trials, action success, reward, foothold spread, interpretation, and objective completion repeatedly disagreed. The result supports a multidimensional experimental method—not a strategic agent architecture.",
    "description": "How Ordivon Security Round 1 used local dynamic opponents, CAGE Challenge 4, and bounded Hermes/Codex diagnostics to separate tactical success from strategic outcome without promoting a Campaign engine, organization ontology, strategic state, or custom cyber range.",
    "projectSlugs": ["security"],
    "questionSlugs": ["security-adversarial-trajectory", "opponent-state-transfer"],
    "meta": "Research report · Ordivon Security · Published 31 July 2026 · 12 min read · By zycxfyh",
    "type": "Research report",
    "project": "Ordivon Security",
    "date": "2026-07-31",
    "modifiedDate": "2026-07-31",
    "readMinutes": 12,
    "author": "zycxfyh",
    "lead": "Round 1 did not produce an Agent that defeated an adaptive opponent. It produced something more useful for architecture: a system that could preserve the difference between what the World knew, what the Actor saw, what the Actor claimed, what an action changed, and whether the long-horizon objective improved.",
    "toc": [
      { "id": "the-action-succeeded-the-strategy-failed", "label": "The action succeeded; the strategy failed" },
      { "id": "eighty-four-trials-preserved-metric-disagreement", "label": "Eighty-four Trials, independent outcomes" },
      { "id": "a-decoy-can-win-the-move-and-lose-the-contest", "label": "A decoy can win the move" },
      { "id": "better-belief-can-still-spend-the-option-to-act", "label": "Better belief can spend the option to act" },
      { "id": "organization-isolated-bad-advice-but-created-no-new-intelligence", "label": "Isolation without new intelligence" },
      { "id": "cage-made-reward-and-foothold-rankings-disagree", "label": "Reward and footholds disagreed" },
      { "id": "richer-model-interpretation-still-failed-the-objective", "label": "Richer interpretation still failed" },
      { "id": "the-method-survived-the-large-abstractions-did-not", "label": "The method survived" },
      { "id": "what-the-data-does-not-establish", "label": "What the data does not establish" },
      { "id": "the-next-test-is-transfer-under-disruption", "label": "Transfer under disruption" },
      { "id": "sources-title", "label": "Research record" }
    ]
  },
  {
    "slug": "smaller-core-strong-baselines",
    "title": "The Smaller Core That Survived Strong Baselines",
    "kicker": "Research report / Agent systems",
    "deck": "Mature workflow, retrieval, idempotency, durable activity, and live provider baselines did not validate a larger Ordivon stack. They exposed the smaller set of responsibilities that remained independently necessary.",
    "description": "How Core Work System Round 1 used strong classical baselines and live Codex/Hermes replacement to remove a Task Runtime, reject a generalized Context Kernel, shrink Effect, localize DecisionRequest, and retain provider-neutral Task state.",
    "projectSlugs": ["computing"],
    "questionSlugs": ["smallest-agent-native-core", "runtime-structured-effect", "calibrated-non-action"],
    "meta": "Research report · Ordivon Computing · Published 31 July 2026 · 13 min read · By zycxfyh",
    "type": "Research report",
    "project": "Ordivon Computing",
    "date": "2026-07-31",
    "modifiedDate": "2026-07-31",
    "readMinutes": 13,
    "author": "zycxfyh",
    "lead": "Round 1 was built to make Ordivon's own abstractions lose. Mature systems carried durable work, filtered current sources, reconciled lost responses, and preserved safe approval boundaries. What remained was not a universal Agent stack, but a narrower division of ownership that could still explain failures the baselines could not erase.",
    "toc": [
      { "id": "the-experiment-was-designed-to-delete-our-own-architecture", "label": "Designed to delete our own architecture" },
      { "id": "one-frozen-world-separated-four-causal-questions", "label": "One frozen world, four causal questions" },
      { "id": "durable-work-survived-but-a-task-runtime-did-not", "label": "Durable work without a Task Runtime" },
      { "id": "more-context-lost-to-current-revision-retrieval", "label": "More Context lost to current retrieval" },
      { "id": "the-full-effect-graph-lost-to-smaller-recovery-mechanisms", "label": "The full Effect graph lost" },
      { "id": "attention-improved-only-as-a-host-local-decision-boundary", "label": "Attention remained Host-local" },
      { "id": "provider-replacement-survived-model-equivalence-did-not", "label": "Portability, not model equivalence" },
      { "id": "the-surviving-architecture-is-smaller-and-sharper", "label": "The surviving architecture" },
      { "id": "what-the-numbers-do-not-say", "label": "What the numbers do not say" },
      { "id": "round-two-must-attack-the-remaining-boundary", "label": "Round 2 must attack the remainder" },
      { "id": "sources-title", "label": "Research record" }
    ]
  },
  {
    "slug": "the-future-will-not-wait",
    "title": "The Future Will Not Wait",
    "kicker": "Essay / Computing",
    "deck": "AI, robotics, science, and institutional capacity should accelerate together; resilience, verification, access, and cooperation are reasons to build faster, not freeze the frontier.",
    "description": "A historical and systems argument for accelerating AI, robotics, science, verification, resilience, access, and cooperation instead of centering civilization on a global frontier slowdown.",
    "projectSlugs": ["computing"],
    "questionSlugs": [],
    "meta": "Research essay · Ordivon Computing · Published 29 July 2026 · 14 min read · By zycxfyh",
    "type": "Research essay",
    "project": "Ordivon Computing",
    "date": "2026-07-29",
    "modifiedDate": "2026-07-29",
    "readMinutes": 14,
    "author": "zycxfyh",
    "lead": "The answer to fast intelligence is not to make the frontier slow. It is to make science, verification, resilience, access, and cooperation move faster with it.",
    "toc": [
      {
        "id": "cumulative",
        "label": "Progress is uneven, but cumulative"
      },
      {
        "id": "organization",
        "label": "Industrial revolutions are organizational revolutions"
      },
      {
        "id": "knowledge",
        "label": "AI changes the production of knowledge"
      },
      {
        "id": "slowdown",
        "label": "Why a global frontier slowdown is unstable"
      },
      {
        "id": "acceleration",
        "label": "Acceleration is more than model capability"
      },
      {
        "id": "governance",
        "label": "Govern consequences, not the horizon of intelligence"
      },
      {
        "id": "ordivon",
        "label": "Ordivon: infrastructure for moving faster without losing the work"
      },
      {
        "id": "the-future-will-not-ask-whether-we-feel-ready",
        "label": "The future will not ask whether we feel ready"
      },
      {
        "id": "sources-title",
        "label": "Research behind the argument"
      }
    ]
  },
  {
    "slug": "link-edge-boundary",
    "title": "Why Link and Edge Became One Ordivon World Boundary",
    "kicker": "Architecture correction / Task-to-world interaction",
    "deck": "Separating connectivity from external execution exposed useful classical boundaries. Keeping that split as two top-level projects created the wrong agent boundary for one recoverable external action.",
    "description": "Why Ordivon first separated connectivity and external execution, then unified both prototypes around one complete Task-to-World Interaction.",
    "projectSlugs": ["world"],
    "questionSlugs": ["world-boundary-value"],
    "meta": "Architecture report · Ordivon World · Published 28 July 2026 · Revised 30 July 2026 · 9 min read · By zycxfyh",
    "type": "Architecture report",
    "project": "Ordivon World",
    "date": "2026-07-28",
    "modifiedDate": "2026-07-30",
    "readMinutes": 9,
    "author": "zycxfyh",
    "lead": "The original split solved a real problem. Network observation, routing, VPNs, transports, browsers, cloud providers, Sandboxes, and remote execution are mature technical domains with different mechanisms. Treating them as one undifferentiated “edge” would have encouraged Ordivon to rebuild infrastructure it should reuse.",
    "toc": [
      {
        "id": "the-split-was-analytically-correct",
        "label": "The split was analytically correct"
      },
      {
        "id": "the-repository-boundary-was-wrong",
        "label": "The repository boundary was wrong"
      },
      {
        "id": "external-work-is-a-graph",
        "label": "External work is a graph"
      },
      {
        "id": "world-interaction-is-the-new-research-object",
        "label": "World Interaction is the new research object"
      },
      {
        "id": "what-was-migrated",
        "label": "What was migrated"
      },
      {
        "id": "what-was-not-created",
        "label": "What was not created"
      },
      {
        "id": "the-correction-is-part-of-the-evidence",
        "label": "The correction is part of the evidence"
      }
    ]
  },
  {
    "slug": "runtime-after-core",
    "title": "How Ordivon Runtime Grew Beyond Its Ten-Tool Core",
    "kicker": "Engineering report / Durable execution",
    "deck": "Sustained use clarified commitment semantics, added recovery and structured progress, removed an overlapping editor, and closed the operational lifecycle around deployment, retention, repair, and status.",
    "description": "How a production-tested ten-tool runtime became a thirteen-tool execution and recovery system without absorbing task meaning or external-world semantics.",
    "projectSlugs": ["runtime", "host", "world"],
    "questionSlugs": ["runtime-structured-effect", "runtime-boundary-friction"],
    "meta": "Engineering report · Ordivon Runtime · Published 28 July 2026 · 10 min read · By zycxfyh",
    "type": "Engineering report",
    "project": "Ordivon Runtime",
    "date": "2026-07-28",
    "modifiedDate": "2026-07-28",
    "readMinutes": 10,
    "author": "zycxfyh",
    "lead": "The 23 July release established exact Git Workspaces, durable Jobs and Attempts, owned process trees, bounded output, cancellation, Artifacts, and restart recovery. Sustained Agent work then exposed two further questions: what exactly is committed when a nondeterministic Agent crosses into reality, and what operational machinery lets the Runtime itself remain clean and recoverable?",
    "toc": [
      {
        "id": "the-historical-release-remains-ten-tools",
        "label": "The historical release remains ten tools"
      },
      {
        "id": "the-decisive-abstraction-is-commitment",
        "label": "The decisive abstraction is commitment"
      },
      {
        "id": "source-commitment-is-strong-but-scoped",
        "label": "Source commitment is strong but scoped"
      },
      {
        "id": "opaque-execution-does-not-become-idempotent-by-declaration",
        "label": "Opaque execution does not become idempotent by declaration"
      },
      {
        "id": "agent-facing-ux-improved-without-absorbing-every-workflow",
        "label": "Agent-facing UX improved without absorbing every workflow"
      },
      {
        "id": "execution-stopped-inheriting-ambient-service-state",
        "label": "Execution stopped inheriting ambient service state"
      },
      {
        "id": "workspace-and-cache-lifecycles-were-separated",
        "label": "Workspace and cache lifecycles were separated"
      },
      {
        "id": "repair-and-status-preserve-evidence",
        "label": "Repair and status preserve evidence"
      },
      {
        "id": "deployment-became-a-receipted-transaction",
        "label": "Deployment became a receipted transaction"
      },
      {
        "id": "the-production-cleanup-was-measurable",
        "label": "The production cleanup was measurable"
      },
      {
        "id": "what-remains-outside-runtime",
        "label": "What remains outside Runtime"
      }
    ]
  },
  {
    "slug": "host-task-continuity",
    "title": "Why Task Continuity Belongs Above Execution",
    "kicker": "Architecture report / Agent systems",
    "deck": "Runtime can recover a process. It should not decide what the user meant, which model decision is admissible, whether external evidence satisfies the task, or which frontier a later agent should continue.",
    "description": "Why durable task continuity belongs in Ordivon Host above replaceable model sessions and Ordivon Runtime process execution.",
    "projectSlugs": ["host", "runtime", "world"],
    "questionSlugs": ["host-general-repository-goal"],
    "meta": "Architecture report · Ordivon Host · Published 28 July 2026 · 9 min read · By zycxfyh",
    "type": "Architecture report",
    "project": "Ordivon Host",
    "date": "2026-07-28",
    "modifiedDate": "2026-07-28",
    "readMinutes": 9,
    "author": "zycxfyh",
    "lead": "The first Ordivon Host prototypes lived inside Computing because the ownership boundary was not yet proven. H2–H6 forced that boundary through deterministic reads, bounded cognition, guarded mutation, response-loss recovery, and Runtime restarts. The result is an independent state owner: Host persists semantic Task continuity while Runtime persists physical execution truth.",
    "toc": [
      {
        "id": "a-conversation-is-not-a-task-database",
        "label": "A conversation is not a Task database"
      },
      {
        "id": "runtime-truth-and-task-truth-are-different",
        "label": "Runtime truth and Task truth are different"
      },
      {
        "id": "the-durable-host-has-two-mechanisms",
        "label": "The durable Host has two mechanisms"
      },
      {
        "id": "a-minimal-kernel-coordinates-transitions-not-workflows",
        "label": "A minimal kernel coordinates transitions, not workflows"
      },
      {
        "id": "cognition-is-split-by-a-durable-boundary",
        "label": "Cognition is split by a durable boundary"
      },
      {
        "id": "unknown-is-a-first-class-recovery-state",
        "label": "UNKNOWN is a first-class recovery state"
      },
      {
        "id": "live-faults-changed-the-architecture",
        "label": "Live faults changed the architecture"
      },
      {
        "id": "why-host-became-an-independent-repository",
        "label": "Why Host became an independent repository"
      },
      {
        "id": "what-is-still-missing",
        "label": "What is still missing"
      }
    ]
  },
  {
    "slug": "ordivon-runtime-release",
    "title": "Ordivon Runtime: From Governance Platform to Durable Execution",
    "kicker": "Release note / Agent infrastructure",
    "deck": "The M0–M7 core is closed. Ten production-tested tools now cover isolated workspaces, durable execution, observation, cancellation, artifacts, and cleanup.",
    "description": "Ordivon Runtime closes its M0–M7 core with ten production-tested tools for durable agent execution, observation, cancellation, artifacts, and recovery.",
    "projectSlugs": ["runtime"],
    "questionSlugs": [],
    "meta": "Release · Ordivon Runtime · Published 23 July 2026 · Updated 23 July 2026 · 9 min read · By zycxfyh",
    "type": "Release",
    "project": "Ordivon Runtime",
    "date": "2026-07-23",
    "modifiedDate": "2026-07-23",
    "readMinutes": 9,
    "author": "zycxfyh",
    "lead": "Ordivon Runtime has reached a clear engineering boundary: the core local execution and recovery system is implemented, simplified, and accepted through direct production MCP use. The remaining work is operational adoption and further dogfood—not rebuilding the platform around imagined future capabilities.",
    "toc": [
      {
        "id": "what-has-been-completed",
        "label": "What has been completed"
      },
      {
        "id": "the-important-change-was-subtraction",
        "label": "The important change was subtraction"
      },
      {
        "id": "a-new-division-of-responsibility",
        "label": "A new division of responsibility"
      },
      {
        "id": "the-ten-tool-surface",
        "label": "The ten-tool surface"
      },
      {
        "id": "what-the-protocol-dogfood-proved",
        "label": "What the protocol dogfood proved"
      },
      {
        "id": "what-ordivon-deliberately-is-not",
        "label": "What Ordivon deliberately is not"
      },
      {
        "id": "three-engineering-defaults-survived-the-redesign",
        "label": "Three engineering defaults survived the redesign"
      },
      {
        "id": "core-complete-does-not-mean-operations-finished",
        "label": "Core complete does not mean operations finished"
      },
      {
        "id": "what-comes-next",
        "label": "What comes next"
      }
    ]
  },
  {
    "slug": "why-ordivon",
    "title": "AI Agents Need More Than a Good Conversation",
    "kicker": "Design argument / Durable agent work",
    "deck": "Models can reason, plan, and write code. Real work also needs task meaning, execution evidence, recovery, and responsibility that survive the conversation.",
    "description": "Why capable AI agents need durable task and execution truth when work crosses into repositories, processes, credentials, machines, and consequential decisions.",
    "projectSlugs": ["computing", "host"],
    "questionSlugs": [],
    "meta": "Design argument · Related to Ordivon Runtime · Published 23 July 2026 · Updated 29 July 2026 · 6 min read · By zycxfyh",
    "type": "Design argument",
    "project": "Related to Ordivon Runtime",
    "date": "2026-07-23",
    "modifiedDate": "2026-07-23",
    "readMinutes": 6,
    "author": "zycxfyh",
    "lead": "Modern AI can produce explanations, plans, code, analysis, and recommendations with remarkable fluency. As agents gain tools and longer-running workflows, the decisive question moves beyond output quality: what must remain true when work crosses into processes, repositories, credentials, machines, and consequential decisions?",
    "toc": [
      {
        "id": "fluency-changes-the-social-meaning-of-output",
        "label": "Fluency changes the social meaning of output"
      },
      {
        "id": "dependable-work-needs-more-than-a-good-conversation",
        "label": "Dependable work needs more than a good conversation"
      },
      {
        "id": "ordivon-began-as-a-method-problem-and-became-a-runtime-problem",
        "label": "Ordivon began as a method problem—and became a runtime problem"
      },
      {
        "id": "thin-infrastructure-can-support-stronger-agents",
        "label": "Thin infrastructure can support stronger agents"
      },
      {
        "id": "a-public-domain-connects-the-work",
        "label": "A public domain connects the work"
      },
      {
        "id": "principles-that-travel-across-systems",
        "label": "Principles that travel across systems"
      }
    ]
  }
] as const satisfies readonly ArticleMetadata[];

export type ArticleSlug = (typeof articleMetadata)[number]["slug"];
