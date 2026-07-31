export type TocEntry = { id: string; label: string };
export type ArticleMetadata = {
  slug: string;
  title: string;
  kicker: string;
  deck: string;
  description: string;
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
    "slug": "winning-move-loses-contest",
    "title": "Winning the Move Can Lose the Contest",
    "kicker": "Research report / Adversarial agency",
    "deck": "Across 84 bounded Trials, action success, reward, foothold spread, interpretation, and objective completion repeatedly disagreed. The result supports a multidimensional experimental method—not a strategic Agent architecture.",
    "description": "How Ordivon Security Round 1 used local dynamic opponents, CAGE Challenge 4, and bounded Hermes/Codex diagnostics to separate tactical success from strategic outcome without promoting a Campaign engine, organization ontology, strategic state, or custom cyber range.",
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
    "deck": "LangGraph, Temporal, current-revision retrieval, idempotency, durable Activities, and live Provider replacement did not validate a larger Ordivon stack. They identified the smaller set of responsibilities that remained independently necessary.",
    "description": "How Core Work System Round 1 used strong classical baselines and live Codex/Hermes replacement to remove a Task Runtime, reject a generalized Context Kernel, shrink Effect, localize DecisionRequest, and retain Provider-neutral Task state.",
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
    "deck": "Why the AI revolution calls for civilizational acceleration.",
    "description": "A historical and systems argument for accelerating AI, robotics, science, verification, resilience, access, and cooperation instead of centering civilization on a global frontier slowdown.",
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
    "title": "From Link and Edge to Ordivon World",
    "kicker": "Architecture correction / Task-to-world interaction",
    "deck": "Separating connectivity from external execution exposed the right classical boundaries. Keeping that separation as two top-level projects created the wrong Agent boundary.",
    "description": "Why Ordivon first separated connectivity and external execution, then unified both prototypes around one complete Task-to-World Interaction.",
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
    "title": "Ordivon Runtime after the core",
    "kicker": "Engineering report / Agent infrastructure",
    "deck": "The ten-tool release proved durable execution. Later work clarified commitment semantics, added recovery and structured-progress primitives, retired one overlapping editor, and closed the production lifecycle around environment, deployment, retention, repair, and status.",
    "description": "How Ordivon Runtime evolved after its ten-tool core into a thirteen-tool Agent Effect Commit Kernel with explicit execution environments, deployment receipts, Workspace lifecycle, repair, and secret-free status.",
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
    "title": "Why Task continuity belongs above execution",
    "kicker": "Architecture report / Agent systems",
    "deck": "Runtime can recover a process. It should not decide what the user meant, which model decision is admissible, whether external evidence satisfies the Task, or which frontier a later Agent should continue.",
    "description": "Why durable Agent Task continuity belongs in Ordivon Host above replaceable model sessions and Ordivon Runtime process execution.",
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
    "title": "Ordivon Runtime: from governance platform to durable execution",
    "kicker": "Release note / Agent infrastructure",
    "deck": "The M0–M7 core is closed. Ten production-tested tools now cover isolated workspaces, durable execution, observation, cancellation, artifacts, and cleanup.",
    "description": "Ordivon Runtime closes its M0–M7 core with ten production-tested tools for durable agent execution, observation, cancellation, artifacts, and recovery.",
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
    "title": "Why Ordivon matters in the AI era",
    "kicker": "Note / Agent systems",
    "deck": "Capable agents need both flexible reasoning and durable execution truth.",
    "description": "How Ordivon connects AI capability to durable execution, evidence, judgment, authority, action, review, and responsibility inside real systems.",
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
