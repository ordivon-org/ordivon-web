export const editorialSelections = {
  home: {
    proof: "the-shorter-explanation-won",
    recentArguments: ["the-agent-asked-for-more-evidence-the-answer-became-no", "the-model-finished-the-protocol-wasnt-done", "we-sorted-the-evidence-accuracy-got-worse"],
  },
  writing: {
    startHere: "why-ordivon",
    evidenceReports: ["the-constitution-changed-the-agent-that-wasnt-enough", "we-sorted-the-evidence-accuracy-got-worse"],
    readingPaths: [
      {
        label: "When rules deserve defaults",
        title: "A cleaner rule or representation still has to beat the ugly baseline",
        description: "Follow two interventions that looked architecturally attractive—a quantitative constitution and canonical evidence order—until sealed replication and a clearer oracle removed their default status.",
        slugs: ["the-constitution-changed-the-agent-that-wasnt-enough", "we-sorted-the-evidence-accuracy-got-worse", "the-shorter-explanation-won"],
      },
      {
        label: "Non-action is a result",
        title: "What happens when new evidence removes the action instead of authorizing it",
        description: "Start with an Agent requesting missing evidence, watch a read-only observation change the available action space, then connect that no-op to UNKNOWN and consequence boundaries.",
        slugs: ["the-agent-asked-for-more-evidence-the-answer-became-no", "unknown-is-operational-state", "the-command-succeeded-did-anything-happen"],
      },
      {
        label: "State the model should not see",
        title: "Semantic history is only one continuity layer",
        description: "See why opaque Provider continuation can be necessary across a Tool turn without becoming Agent cognition, then place that state beside Task and execution continuity rather than inside one universal transcript.",
        slugs: ["the-model-finished-the-protocol-wasnt-done", "transcript-not-task-database", "from-tokens-to-work"],
      },
    ],
  },
  research: {
    currentQuestion: "historical-world-model-dogfood",
    recentlyAnswered: "semantic-order-and-canonicalization",
    architectureChangingExperiment: "the-model-finished-the-protocol-wasnt-done",
  },
  now: {
    judgmentChanges: [
      "historical-world-model-dogfood", "context-treatment-replication", "provider-protocol-continuation",
      "semantic-order-and-canonicalization", "calibrated-non-action", "finance-real-capital-agent",
      "evidence-current-applicability", "creative-empirical-validity", "world-minimal-boundary",
      "ordivon-harness-v0", "runtime-boundary-friction", "game-agent-native-mechanics", "security-adversarial-trajectory",
    ],
  },
} as const;
