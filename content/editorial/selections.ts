export const editorialSelections = {
  home: {
    proof: "the-shorter-explanation-won",
    recentArguments: ["the-decision-was-valid-the-portfolio-changed", "the-evidence-is-real-it-is-still-too-old", "a-better-looking-result-can-still-be-noise"],
  },
  writing: {
    startHere: "why-ordivon",
    evidenceReports: ["the-decision-was-valid-the-portfolio-changed", "the-evidence-is-real-it-is-still-too-old"],
    readingPaths: [
      {
        label: "More evidence, less certainty",
        title: "When repeated evidence strengthens Reality and weakens the labels used to describe it",
        description: "Follow historical recurrence, ambiguous evaluators, and canonical representations until the experiment separates what keeps recurring from the vocabulary that only seemed stable.",
        slugs: ["the-patterns-recurred-our-taxonomy-got-worse", "history-did-not-prove-us-right", "we-sorted-the-evidence-accuracy-got-worse"],
      },
      {
        label: "Information must buy a decision",
        title: "Seeing less is useful only when each observation can change what the Agent is entitled to do",
        description: "Start with high-information repository discovery, then compare evidence that closes a capital path and UNKNOWN that preserves the right to keep observing.",
        slugs: ["we-cut-203-observations-to-8-and-still-didnt-edit", "the-agent-asked-for-more-evidence-the-answer-became-no", "unknown-is-operational-state"],
      },
      {
        label: "Goals, commitments, and remaining futures",
        title: "An explicit goal is not yet a strategy, and a retained object is not yet entitled to remain",
        description: "Compare a model that knows its objective but loses the multi-turn commitment with storage whose retention right depends on an actual current consumer rather than age or size.",
        slugs: ["the-agent-knew-the-goal-it-still-wouldnt-do-it", "we-deleted-16-8-gb-not-because-it-was-old", "winning-move-loses-contest"],
      },
    ],
  },
  research: {
    currentQuestion: "open-interface-relative-closure",
    recentlyAnswered: "historical-world-model-dogfood",
    architectureChangingExperiment: "we-cut-203-observations-to-8-and-still-didnt-edit",
  },
  now: {
    judgmentChanges: [
      "historical-world-model-dogfood", "ordivon-harness-v0", "game-agent-native-mechanics", "runtime-boundary-friction",
      "context-treatment-replication", "provider-protocol-continuation", "semantic-order-and-canonicalization",
      "calibrated-non-action", "finance-real-capital-agent", "evidence-current-applicability",
      "creative-empirical-validity", "world-minimal-boundary", "security-adversarial-trajectory",
    ],
  },
} as const;
