import type { GraphRelation } from "@/lib/graph/types";

const projectSystemRelations = [
  ["project:computing", "system:computing"],
  ["project:host", "system:host"],
  ["project:runtime", "system:runtime"],
  ["project:world", "system:world"],
].map(([source, target], index) => ({ id: `relation:project-system-${index + 1}`, type: "implements" as const, source, target }));

const projectQuestionRelations = [
  ["project:computing", "question:computing-async-join"],
  ["project:computing", "question:computing-second-workload"],
  ["project:host", "question:host-general-goal"],
  ["project:host", "question:host-operational-surface"],
  ["project:runtime", "question:runtime-structured-effect"],
  ["project:runtime", "question:runtime-boundary-friction"],
  ["project:world", "question:world-correlated-recovery"],
  ["project:world", "question:world-boundary-value"],
  ["project:web", "question:web-research-interface"],
  ["project:game", "question:game-agent-native-mechanics"],
  ["project:security", "question:security-adversarial-trajectory"],
].map(([source, target], index) => ({ id: `relation:project-question-${index + 1}`, type: "raises" as const, source, target }));

const researchRelations: GraphRelation[] = [
  { id: "relation:host-experiment-tests", type: "tests", source: "experiment:host-h2-h6", target: "question:host-general-goal" },
  { id: "relation:host-finding-supports", type: "supports", source: "finding:host-state-above-session", target: "question:host-general-goal" },
  { id: "relation:host-finding-decision", type: "supports", source: "finding:host-state-above-session", target: "decision:extract-host" },
  { id: "relation:runtime-experiment-tests", type: "tests", source: "experiment:runtime-production-dogfood", target: "question:runtime-boundary-friction" },
  { id: "relation:runtime-finding-supports", type: "supports", source: "finding:runtime-commitment-boundary", target: "question:runtime-structured-effect" },
  { id: "relation:world-experiment-tests", type: "tests", source: "experiment:world-unification", target: "question:world-boundary-value" },
  { id: "relation:world-experiment-supports-finding", type: "supports", source: "experiment:world-unification", target: "finding:link-edge-boundary-wrong" },
  { id: "relation:world-finding-supports", type: "supports", source: "finding:link-edge-boundary-wrong", target: "decision:unify-world" },
  { id: "relation:web-experiment-tests", type: "tests", source: "experiment:web-governance-audit", target: "question:web-research-interface" },
  { id: "relation:web-experiment-supports-finding", type: "supports", source: "experiment:web-governance-audit", target: "finding:web-governance-displaced-interface" },
  { id: "relation:web-finding-supports", type: "supports", source: "finding:web-governance-displaced-interface", target: "decision:thin-web-release" },
  { id: "relation:web-thin-release-implements", type: "implements", source: "decision:thin-web-release", target: "question:web-research-interface" },
  { id: "relation:web-mdx-implements", type: "implements", source: "decision:mdx-writing", target: "question:web-research-interface" },
  { id: "relation:host-runtime-dependency", type: "depends_on", source: "system:host", target: "system:runtime", label: "dispatches physical effects" },
  { id: "relation:host-computing-dependency", type: "depends_on", source: "system:host", target: "system:computing", label: "implements shared contracts" },
  { id: "relation:world-computing-dependency", type: "depends_on", source: "system:world", target: "system:computing", label: "tests continuity contracts" },
  { id: "relation:project-computing-defines-host", type: "defines", source: "project:computing", target: "project:host", label: "defines shared contracts" },
  { id: "relation:project-computing-defines-runtime", type: "defines", source: "project:computing", target: "project:runtime", label: "defines effect contracts" },
  { id: "relation:project-computing-defines-world", type: "defines", source: "project:computing", target: "project:world", label: "defines continuity contracts" },
  { id: "relation:project-host-runtime-dependency", type: "depends_on", source: "project:host", target: "project:runtime", label: "commits local effects" },
  { id: "relation:project-host-world-dependency", type: "depends_on", source: "project:host", target: "project:world", label: "acts through external bindings" },
];

const articleRelations: GraphRelation[] = [
  { id: "relation:article-future-computing", type: "documents", source: "article:the-future-will-not-wait", target: "project:computing" },
  { id: "relation:article-world-world", type: "documents", source: "article:link-edge-boundary", target: "project:world" },
  { id: "relation:article-world-decision", type: "documents", source: "article:link-edge-boundary", target: "decision:unify-world" },
  { id: "relation:article-runtime-runtime", type: "documents", source: "article:runtime-after-core", target: "project:runtime" },
  { id: "relation:article-runtime-finding", type: "documents", source: "article:runtime-after-core", target: "finding:runtime-commitment-boundary" },
  { id: "relation:article-host-host", type: "documents", source: "article:host-task-continuity", target: "project:host" },
  { id: "relation:article-host-finding", type: "documents", source: "article:host-task-continuity", target: "finding:host-state-above-session" },
  { id: "relation:article-release-runtime", type: "documents", source: "article:ordivon-runtime-release", target: "project:runtime" },
  { id: "relation:article-why-computing", type: "documents", source: "article:why-ordivon", target: "project:computing" },
  { id: "relation:article-why-host", type: "documents", source: "article:why-ordivon", target: "project:host" },
  { id: "relation:article-host-runtime", type: "documents", source: "article:host-task-continuity", target: "project:runtime" },
  { id: "relation:article-runtime-host", type: "documents", source: "article:runtime-after-core", target: "project:host" },
  { id: "relation:article-host-world", type: "documents", source: "article:host-task-continuity", target: "project:world" },
  { id: "relation:article-runtime-world", type: "documents", source: "article:runtime-after-core", target: "project:world" },
];

export const graphRelations: GraphRelation[] = [
  ...projectSystemRelations,
  ...projectQuestionRelations,
  ...researchRelations,
  ...articleRelations,
];
