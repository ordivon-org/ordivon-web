export const editorialSelections = {
  home: {
    proof: "the-shorter-explanation-won",
    recentArguments: ["the-shorter-explanation-won", "world-got-smaller-and-got-clearer", "a-better-looking-result-can-still-be-noise"],
  },
  writing: {
    startHere: "why-ordivon",
    evidenceReports: ["the-shorter-explanation-won", "world-got-smaller-and-got-clearer"],
    readingPaths: [
      {
        label: "Start with one failure",
        title: "Why capable Agents still need a system around them",
        description: "Begin with an interrupted piece of real work, then follow the minimum responsibility boundaries that keep the next Agent from inventing what happened.",
        slugs: ["why-ordivon", "from-tokens-to-work", "the-shorter-explanation-won"],
      },
      {
        label: "Boundaries that survived",
        title: "What remains after ambiguity and deletion pressure",
        description: "See why unknown consequence, unique authority, and a smaller World survived stronger alternatives while broader machinery was removed.",
        slugs: ["unknown-is-operational-state", "one-authority-thirteen-tables", "world-got-smaller-and-got-clearer"],
      },
      {
        label: "How we test ourselves",
        title: "Strong baselines, negative results, and creative falsifiers",
        description: "Follow experiments designed to make Ordivon's own abstractions lose—from classical system baselines to searched creative winners manufactured by pure noise.",
        slugs: ["smaller-core-strong-baselines", "a-better-looking-result-can-still-be-noise", "the-shorter-explanation-won"],
      },
    ],
  },
  research: {
    currentQuestion: "creative-empirical-validity",
    recentlyAnswered: "causal-responsibility-explanation",
    architectureChangingExperiment: "world-got-smaller-and-got-clearer",
  },
  now: {
    judgmentChanges: [
      "creative-empirical-validity", "finance-real-capital-agent", "world-minimal-boundary",
      "ordivon-harness-v0", "runtime-boundary-friction", "game-agent-native-mechanics",
      "security-adversarial-trajectory",
    ],
  },
} as const;
