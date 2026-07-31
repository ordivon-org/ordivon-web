export const editorialSelections = {
  home: {
    proof: "what-h1-h5-proved",
    recentArguments: ["what-h1-h5-proved", "smaller-core-strong-baselines", "winning-move-loses-contest"],
  },
  writing: {
    startHere: "from-tokens-to-work",
    evidenceReports: ["what-h1-h5-proved", "winning-move-loses-contest"],
    readingPaths: [
      {
        label: "Start with Ordivon",
        title: "Why durable agent work matters",
        description: "Begin with the practical failure, the project intent, and the larger future Ordivon is trying to make possible.",
        slugs: ["why-ordivon", "creation-judgment-recoverable-systems", "the-future-will-not-wait"],
      },
      {
        label: "Agent architecture",
        title: "From model output to completed work",
        description: "Follow the execution stack, the Harness boundary, and the experiments that made the surviving architecture smaller.",
        slugs: ["from-tokens-to-work", "why-ordivon-needs-a-harness", "what-h1-h5-proved"],
      },
      {
        label: "Experiments and failures",
        title: "What changed under real pressure",
        description: "Read the reports where tactical success, duplicate authority, response loss, and strong baselines forced a different judgment.",
        slugs: ["winning-move-loses-contest", "one-authority-thirteen-tables", "unknown-is-operational-state"],
      },
    ],
  },
  research: {
    currentQuestion: "host-general-repository-goal",
    recentlyAnswered: "harness-composition-and-completion",
    architectureChangingExperiment: "smaller-core-strong-baselines",
  },
  now: {
    judgmentChanges: [
      "harness-composition-and-completion", "smallest-agent-native-core", "world-boundary-value",
      "runtime-boundary-friction", "game-agent-native-mechanics", "security-adversarial-trajectory",
    ],
  },
} as const;
