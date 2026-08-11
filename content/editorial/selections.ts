export const editorialSelections = {
  home: {
    proof: "the-shorter-explanation-won",
    recentArguments: ["history-did-not-prove-us-right", "the-evidence-is-real-it-is-still-too-old", "correctness-is-not-isolation"],
  },
  writing: {
    startHere: "why-ordivon",
    evidenceReports: ["history-did-not-prove-us-right", "the-evidence-is-real-it-is-still-too-old"],
    readingPaths: [
      {
        label: "Start with one failure",
        title: "Follow one action until the word ‘success’ stops being enough",
        description: "Begin with the overall responsibility map, then trace one Agent action from proposal to physical execution and an external consequence that may remain unknown after the command returns.",
        slugs: ["why-ordivon", "from-tokens-to-work", "the-command-succeeded-did-anything-happen"],
      },
      {
        label: "Truth changes over time",
        title: "Why authentic evidence can stop governing the current decision",
        description: "Separate integrity, applicability, unknown consequence, and owner-native currentness without rewriting old evidence or inventing one global freshness authority.",
        slugs: ["the-evidence-is-real-it-is-still-too-old", "unknown-is-operational-state", "world-got-smaller-and-got-clearer"],
      },
      {
        label: "How we attack our own theory",
        title: "A stronger mechanism is not automatically a stronger explanation—or a universal law",
        description: "Watch remote isolation lose its universal status, searched creative winners collapse under stronger evidence, and five historical epochs narrow the theory we started with.",
        slugs: ["correctness-is-not-isolation", "a-better-looking-result-can-still-be-noise", "history-did-not-prove-us-right"],
      },
    ],
  },
  research: {
    currentQuestion: "historical-world-model-dogfood",
    recentlyAnswered: "causal-responsibility-explanation",
    architectureChangingExperiment: "world-got-smaller-and-got-clearer",
  },
  now: {
    judgmentChanges: [
      "historical-world-model-dogfood", "evidence-current-applicability", "creative-empirical-validity",
      "finance-real-capital-agent", "world-minimal-boundary", "ordivon-harness-v0",
      "runtime-boundary-friction", "game-agent-native-mechanics", "security-adversarial-trajectory",
    ],
  },
} as const;
