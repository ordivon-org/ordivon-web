import { articles } from "@/lib/content";
import { getArchitectureRoleById, getProjectById, getQuestionById } from "@/content/model";
import type { BoundaryMaturity, ProjectLifecycle, QuestionState, ResearchPlaneStatus } from "@/lib/model/types";

export type SystemViewId = "structure" | "execution" | "research";
export type SystemViewKind = "boundary" | "research-plane" | "project" | "question" | "article";
export type SystemViewStatus = BoundaryMaturity | ResearchPlaneStatus | ProjectLifecycle | QuestionState | "published";
export type SystemRelationType = "owns" | "depends_on" | "implements" | "explores" | "documents";

export type SystemViewConnection = {
  id: string;
  direction: "incoming" | "outgoing";
  type: SystemRelationType;
  label: string;
  otherId: string;
  otherTitle: string;
};

export type SystemViewNode = {
  id: string;
  kind: SystemViewKind;
  status: SystemViewStatus;
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

export type SystemViewEdge = {
  id: string;
  type: SystemRelationType;
  source: string;
  target: string;
  label?: string;
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

type Placement = { id: string; label: string; detail: string; x: number; y: number; width?: number; height?: number };
type EdgeDefinition = { id: string; type: SystemRelationType; source: string; target: string; label?: string };
type PerspectiveDefinition = Omit<SystemPerspective, "nodes" | "edges"> & { placements: Placement[]; edges: EdgeDefinition[] };

const definitions: PerspectiveDefinition[] = [
  {
    id: "structure", label: "Structure", kicker: "State ownership",
    description: "Three durable boundaries, one research plane, and the repositories that implement or pressure them. World is shown only as retained capability, not a semantic layer.",
    defaultNodeId: "system:host",
    placements: [
      { id: "system:computing", label: "Computing", detail: "research + conformance", x: 110, y: 145 },
      { id: "system:host", label: "Host", detail: "Task continuity", x: 390, y: 145 },
      { id: "system:harness", label: "Harness", detail: "Agent Runs", x: 680, y: 145 },
      { id: "system:runtime", label: "Runtime", detail: "physical execution", x: 970, y: 145 },
      { id: "project:computing", label: "Computing repository", detail: "theory + protocol", x: 110, y: 500 },
      { id: "project:host", label: "Host repository", detail: "coordination plane", x: 390, y: 500 },
      { id: "project:harness", label: "Harness repository", detail: "replaceable execution", x: 680, y: 500 },
      { id: "project:runtime", label: "Runtime repository", detail: "owner-trusted execution", x: 970, y: 500 },
    ],
    edges: [
      { id: "structure-computing", type: "implements", source: "project:computing", target: "system:computing" },
      { id: "structure-host", type: "implements", source: "project:host", target: "system:host" },
      { id: "structure-harness", type: "implements", source: "project:harness", target: "system:harness" },
      { id: "structure-runtime", type: "implements", source: "project:runtime", target: "system:runtime" },
      { id: "structure-host-harness", type: "depends_on", source: "system:host", target: "system:harness", label: "may delegate Runs" },
      { id: "structure-harness-runtime", type: "depends_on", source: "system:harness", target: "system:runtime", label: "dispatches Tools" },
      { id: "structure-host-computing", type: "depends_on", source: "system:host", target: "system:computing", label: "implements contracts" },
    ],
  },
  {
    id: "execution", label: "Execution", kicker: "Task to evidence",
    description: "The core path is Host to Harness to Runtime and back through verification. Applications and providers remain authoritative for their own World state.",
    defaultNodeId: "project:host",
    placements: [
      { id: "project:computing", label: "Computing", detail: "tests shared contracts", x: 110, y: 105 },
      { id: "project:host", label: "Host", detail: "admits + continues Tasks", x: 350, y: 300 },
      { id: "project:harness", label: "Harness", detail: "runs replaceable intelligence", x: 650, y: 300 },
      { id: "project:runtime", label: "Runtime", detail: "commits physical work", x: 950, y: 300 },
      { id: "question:host-general-goal", label: "Host pressure", detail: "broader repository Goal", x: 265, y: 565, width: 250, height: 132 },
      { id: "question:ordivon-harness-v0", label: "Harness pressure", detail: "second adapter or workload", x: 605, y: 565, width: 250, height: 132 },
      { id: "question:runtime-structured-effect", label: "Runtime pressure", detail: "new structured operation", x: 945, y: 565, width: 250, height: 132 },
    ],
    edges: [
      { id: "execution-computing-host", type: "implements", source: "project:computing", target: "project:host", label: "promotes contracts" },
      { id: "execution-host-harness", type: "depends_on", source: "project:host", target: "project:harness", label: "delegates execution" },
      { id: "execution-harness-runtime", type: "depends_on", source: "project:harness", target: "project:runtime", label: "dispatches Tools" },
      { id: "execution-host-question", type: "explores", source: "project:host", target: "question:host-general-goal" },
      { id: "execution-harness-question", type: "explores", source: "project:harness", target: "question:ordivon-harness-v0" },
      { id: "execution-runtime-question", type: "explores", source: "project:runtime", target: "question:runtime-structured-effect" },
    ],
  },
  {
    id: "research", label: "Research", kicker: "Question to publication",
    description: "A sample of how current or answered Questions become dated arguments while repository evidence remains authoritative.",
    defaultNodeId: "question:computing-smallest-core",
    placements: [
      { id: "question:computing-smallest-core", label: "Smallest core", detail: "what survives baselines?", x: 160, y: 145, width: 250, height: 132 },
      { id: "article:smaller-core-strong-baselines", label: "Strong-baseline report", detail: "dated argument", x: 465, y: 145, width: 260, height: 124 },
      { id: "question:ordivon-harness-v0", label: "Harness transfer", detail: "what earns retention now?", x: 160, y: 385, width: 250, height: 132 },
      { id: "article:why-ordivon-needs-a-harness", label: "Harness decision", detail: "historical rationale", x: 465, y: 385, width: 260, height: 124 },
      { id: "question:game-agent-native-mechanics", label: "Agent-native game", detail: "what cannot be classical?", x: 760, y: 145, width: 250, height: 132 },
      { id: "article:station-zero-alpha-1", label: "Historical Alpha", detail: "earlier playable release", x: 1065, y: 145, width: 245, height: 124 },
      { id: "question:security-adversarial-trajectory", label: "Adversarial trajectory", detail: "what does success mean?", x: 760, y: 430, width: 250, height: 132 },
      { id: "article:winning-move-loses-contest", label: "Security Round 1", detail: "multidimensional outcomes", x: 1065, y: 430, width: 245, height: 124 },
    ],
    edges: [
      { id: "research-smallest-core", type: "documents", source: "article:smaller-core-strong-baselines", target: "question:computing-smallest-core" },
      { id: "research-harness", type: "documents", source: "article:why-ordivon-needs-a-harness", target: "question:ordivon-harness-v0" },
      { id: "research-station-zero", type: "documents", source: "article:station-zero-alpha-1", target: "question:game-agent-native-mechanics" },
      { id: "research-security", type: "documents", source: "article:winning-move-loses-contest", target: "question:security-adversarial-trajectory" },
    ],
  },
];

function resolveNode(placement: Placement): SystemViewNode {
  if (placement.id.startsWith("article:")) {
    const article = articles.find((item) => `article:${item.slug}` === placement.id);
    if (!article) throw new Error(`curated system view references missing article ${placement.id}`);
    return { id: placement.id, kind: "article", status: "published", title: article.title, label: placement.label, detail: placement.detail, summary: article.description, href: `/writing/${article.slug}`, x: placement.x, y: placement.y, width: placement.width || 220, height: placement.height || 118, facts: [{ label: "Publication", value: article.type }, { label: "Date", value: article.publishedAt }, { label: "Projects", value: article.projectSlugs.join(" · ") }], connections: [] };
  }
  if (placement.id.startsWith("system:")) {
    const object = getArchitectureRoleById(placement.id);
    if (!object) throw new Error(`curated system view references missing architecture role ${placement.id}`);
    const status = object.kind === "boundary" ? object.maturity : object.status;
    return { ...placement, width: placement.width || 220, height: placement.height || 118, id: object.id, kind: object.kind, status, title: object.title, summary: object.summary, href: object.href, facts: [{ label: object.kind === "boundary" ? "Boundary question" : "Research question", value: object.question }, { label: "Thesis", value: object.thesis }, { label: "Owns", value: object.owns.join(" · ") }, { label: "Refuses", value: object.boundary.join(" · ") }], connections: [] };
  }
  if (placement.id.startsWith("project:")) {
    const object = getProjectById(placement.id);
    if (!object) throw new Error(`curated system view references missing project ${placement.id}`);
    return { ...placement, width: placement.width || 220, height: placement.height || 118, id: object.id, kind: "project", status: object.lifecycle, title: object.title, summary: object.summary, href: object.publicPage ? `/projects/${object.slug}` : object.repository, facts: [{ label: "Current state", value: object.state }, { label: "Portfolio group", value: object.group }, { label: "Evidence", value: object.evidence.map((item) => `${item.value} ${item.label}`).join(" · ") }], connections: [] };
  }
  if (placement.id.startsWith("question:")) {
    const object = getQuestionById(placement.id);
    if (!object) throw new Error(`curated system view references missing question ${placement.id}`);
    return { ...placement, width: placement.width || 220, height: placement.height || 118, id: object.id, kind: "question", status: object.state, title: object.title, summary: object.summary, href: `/research/${object.slug}`, facts: [{ label: "Question state", value: object.state }, { label: "Current judgment", value: object.currentJudgment }, { label: "Next test", value: object.nextStep }], connections: [] };
  }
  throw new Error(`unsupported curated object ${placement.id}`);
}

export const systemPerspectives: SystemPerspective[] = definitions.map((definition) => {
  const baseNodes = definition.placements.map(resolveNode);
  const byId = new Map(baseNodes.map((node) => [node.id, node]));
  const edges = definition.edges.map((edge) => {
    const sourceNode = byId.get(edge.source); const targetNode = byId.get(edge.target);
    if (!sourceNode || !targetNode) throw new Error(`${edge.id} leaves curated ${definition.id} view`);
    return { ...edge, sourceNode, targetNode };
  });
  const nodes = baseNodes.map((node) => ({ ...node, connections: edges.filter((edge) => edge.source === node.id || edge.target === node.id).map((edge) => {
    const outgoing = edge.source === node.id; const other = outgoing ? edge.targetNode : edge.sourceNode;
    return { id: edge.id, direction: outgoing ? "outgoing" as const : "incoming" as const, type: edge.type, label: edge.label || edge.type.replaceAll("_", " "), otherId: other.id, otherTitle: other.title };
  }) }));
  const finalById = new Map(nodes.map((node) => [node.id, node]));
  return { id: definition.id, label: definition.label, kicker: definition.kicker, description: definition.description, defaultNodeId: definition.defaultNodeId, nodes, edges: edges.map((edge) => ({ ...edge, sourceNode: finalById.get(edge.source)!, targetNode: finalById.get(edge.target)! })) };
});
