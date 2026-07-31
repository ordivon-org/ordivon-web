import { getNode, graphRelations } from "@/lib/graph";
import type { GraphNode, GraphRelation, NodeKind, NodeStatus, RelationType } from "@/lib/graph/types";

export type SystemViewId = "structure" | "execution" | "research";

export type SystemViewConnection = {
  id: string;
  direction: "incoming" | "outgoing";
  type: RelationType;
  label: string;
  otherId: string;
  otherTitle: string;
};

export type SystemViewNode = {
  id: string;
  kind: NodeKind;
  status: NodeStatus;
  title: string;
  label: string;
  detail: string;
  summary: string;
  href?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  facts: { label: string; value: string }[];
  connections: SystemViewConnection[];
};

export type SystemViewEdge = GraphRelation & {
  sourceNode: SystemViewNode;
  targetNode: SystemViewNode;
};

export type SystemPerspective = {
  id: SystemViewId;
  label: string;
  kicker: string;
  description: string;
  defaultNodeId: string;
  nodes: SystemViewNode[];
  edges: SystemViewEdge[];
};

type Placement = {
  id: string;
  label: string;
  detail: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
};

type PerspectiveDefinition = Omit<SystemPerspective, "nodes" | "edges"> & {
  placements: Placement[];
  relationIds: string[];
};

const definitions: PerspectiveDefinition[] = [
  {
    id: "structure",
    label: "Structure",
    kicker: "State ownership",
    description: "Separate the contracts, semantic Tasks, committed local effects, and conditioned external interactions that must not fabricate one another's state.",
    defaultNodeId: "system:host",
    placements: [
      { id: "system:computing", label: "Computing", detail: "contracts + conformance", x: 150, y: 155 },
      { id: "system:host", label: "Host", detail: "Goals + Tasks", x: 450, y: 155 },
      { id: "system:runtime", label: "Runtime", detail: "committed local effects", x: 750, y: 155 },
      { id: "system:world", label: "World", detail: "conditioned external action", x: 1050, y: 155 },
      { id: "project:computing", label: "Computing repository", detail: "research + shared contracts", x: 150, y: 515 },
      { id: "project:host", label: "Host repository", detail: "semantic control plane", x: 450, y: 515 },
      { id: "project:runtime", label: "Runtime repository", detail: "trusted-local execution", x: 750, y: 515 },
      { id: "project:world", label: "World repository", detail: "external continuity experiment", x: 1050, y: 515 },
    ],
    relationIds: [
      "relation:project-system-1",
      "relation:project-system-2",
      "relation:project-system-3",
      "relation:project-system-4",
      "relation:host-runtime-dependency",
      "relation:host-computing-dependency",
      "relation:world-computing-dependency",
    ],
  },
  {
    id: "execution",
    label: "Execution",
    kicker: "Effect path",
    description: "Follow how shared contracts condition a Host Task, how Runtime commits local effects, and how World carries external uncertainty without collapsing those responsibilities.",
    defaultNodeId: "project:host",
    placements: [
      { id: "project:computing", label: "Computing", detail: "defines contracts", x: 150, y: 115 },
      { id: "project:host", label: "Host", detail: "admits + continues Tasks", x: 430, y: 300 },
      { id: "project:runtime", label: "Runtime", detail: "commits local effects", x: 770, y: 150 },
      { id: "project:world", label: "World", detail: "reconciles external effects", x: 1010, y: 475 },
      { id: "question:host-general-goal", label: "Host test", detail: "general repository Goal", x: 275, y: 565, width: 250, height: 132 },
      { id: "question:runtime-structured-effect", label: "Runtime test", detail: "full structured Effect", x: 690, y: 515, width: 250, height: 132 },
      { id: "question:world-correlated-recovery", label: "World test", detail: "lost-response recovery", x: 1015, y: 150, width: 250, height: 132 },
    ],
    relationIds: [
      "relation:project-computing-defines-host",
      "relation:project-computing-defines-runtime",
      "relation:project-computing-defines-world",
      "relation:project-host-runtime-dependency",
      "relation:project-host-world-dependency",
      "relation:project-question-host-general-goal",
      "relation:project-question-runtime-structured-effect",
      "relation:project-question-world-correlated-recovery",
    ],
  },
  {
    id: "research",
    label: "Research",
    kicker: "Judgment trajectory",
    description: "Read Ordivon as a sequence of falsifiable questions, real experiments, changed findings, explicit decisions, and public records rather than a stack of timeless project descriptions.",
    defaultNodeId: "question:web-research-interface",
    placements: [
      { id: "question:web-research-interface", label: "Web question", detail: "research graph or page directory?", x: 135, y: 145, width: 230, height: 132 },
      { id: "experiment:web-governance-audit", label: "Audit", detail: "measure displaced effort", x: 390, y: 145, width: 220, height: 124 },
      { id: "finding:web-governance-displaced-interface", label: "Finding", detail: "governance exceeded interface", x: 645, y: 145, width: 230, height: 132 },
      { id: "decision:thin-web-release", label: "Decision", detail: "reduce release machinery", x: 925, y: 88, width: 230, height: 124 },
      { id: "decision:mdx-writing", label: "Decision", detail: "make writing composable", x: 925, y: 248, width: 230, height: 124 },
      { id: "question:world-boundary-value", label: "World question", detail: "does the boundary earn itself?", x: 120, y: 520, width: 230, height: 132 },
      { id: "experiment:world-unification", label: "Experiment", detail: "unify Link + Edge", x: 355, y: 520, width: 210, height: 124 },
      { id: "finding:link-edge-boundary-wrong", label: "Finding", detail: "analytical planes, wrong boundary", x: 590, y: 520, width: 230, height: 132 },
      { id: "decision:unify-world", label: "Decision", detail: "one World continuity object", x: 830, y: 520, width: 220, height: 124 },
      { id: "article:link-edge-boundary", label: "Public record", detail: "dated correction + argument", x: 1060, y: 520, width: 210, height: 124 },
    ],
    relationIds: [
      "relation:web-experiment-tests",
      "relation:web-experiment-supports-finding",
      "relation:web-finding-supports",
      "relation:web-thin-release-implements",
      "relation:web-mdx-implements",
      "relation:world-experiment-tests",
      "relation:world-experiment-supports-finding",
      "relation:world-finding-supports",
      "relation:article-world-decision",
    ],
  },
];

function factsForNode(node: GraphNode) {
  switch (node.kind) {
    case "system":
      return [
        { label: "Central question", value: node.question },
        { label: "Thesis", value: node.thesis },
        { label: "Owns", value: node.owns.join(" · ") },
        { label: "Refuses", value: node.boundary.join(" · ") },
      ];
    case "project":
      return [
        { label: "Current state", value: node.state },
        { label: "Portfolio group", value: node.group },
        ...(node.evidence.length ? [{ label: "Evidence", value: node.evidence.map((item) => `${item.value} ${item.label}`).join(" · ") }] : []),
      ];
    case "question":
      return [{ label: "Question state", value: node.state }];
    case "experiment":
      return [{ label: "Experiment state", value: node.state }, { label: "Date", value: node.date }];
    case "finding":
      return [{ label: "Confidence", value: node.confidence }, { label: "Date", value: node.date }];
    case "decision":
      return [{ label: "Rationale", value: node.rationale }, { label: "Date", value: node.date }];
    case "article":
      return [{ label: "Publication", value: node.articleType }, { label: "Project", value: node.project }, { label: "Date", value: node.date }];
  }
}

function connectionsForNode(node: GraphNode): SystemViewConnection[] {
  return graphRelations
    .filter((relation) => relation.source === node.id || relation.target === node.id)
    .map((relation) => {
      const outgoing = relation.source === node.id;
      const otherId = outgoing ? relation.target : relation.source;
      const other = getNode(otherId);
      return {
        id: relation.id,
        direction: outgoing ? "outgoing" as const : "incoming" as const,
        type: relation.type,
        label: relation.label || relation.type.replaceAll("_", " "),
        otherId,
        otherTitle: other?.title || otherId,
      };
    })
    .slice(0, 8);
}

function resolveNode(placement: Placement): SystemViewNode {
  const node = getNode(placement.id);
  if (!node) throw new Error(`System perspective references missing node ${placement.id}`);
  return {
    id: node.id,
    kind: node.kind,
    status: node.status,
    title: node.title,
    label: placement.label,
    detail: placement.detail,
    summary: node.summary,
    href: node.href,
    x: placement.x,
    y: placement.y,
    width: placement.width || 220,
    height: placement.height || 118,
    facts: factsForNode(node),
    connections: connectionsForNode(node),
  };
}

export const systemPerspectives: SystemPerspective[] = definitions.map((definition) => {
  const nodes = definition.placements.map(resolveNode);
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const edges = definition.relationIds.map((id) => {
    const relation = graphRelations.find((item) => item.id === id);
    if (!relation) throw new Error(`${definition.id} perspective references missing relation ${id}`);
    const sourceNode = nodesById.get(relation.source);
    const targetNode = nodesById.get(relation.target);
    if (!sourceNode || !targetNode) throw new Error(`${id} leaves the ${definition.id} perspective`);
    return { ...relation, sourceNode, targetNode };
  });
  return {
    id: definition.id,
    label: definition.label,
    kicker: definition.kicker,
    description: definition.description,
    defaultNodeId: definition.defaultNodeId,
    nodes,
    edges,
  };
});
