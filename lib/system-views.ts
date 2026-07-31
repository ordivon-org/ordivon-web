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
    description: "A curated view of three consequence boundaries, one research plane, and the repositories that implement them. This is an architecture map, not a second fact store.",
    defaultNodeId: "system:host",
    placements: [
      { id: "system:computing", label: "Computing", detail: "research + conformance", x: 150, y: 155 },
      { id: "system:host", label: "Host", detail: "Goals + Tasks", x: 450, y: 155 },
      { id: "system:runtime", label: "Runtime", detail: "committed local effects", x: 750, y: 155 },
      { id: "system:world", label: "World", detail: "conditioned external action", x: 1050, y: 155 },
      { id: "project:computing", label: "Computing repository", detail: "research + shared contracts", x: 150, y: 515 },
      { id: "project:host", label: "Host repository", detail: "semantic control plane", x: 450, y: 515 },
      { id: "project:runtime", label: "Runtime repository", detail: "trusted-local execution", x: 750, y: 515 },
      { id: "project:world", label: "World repository", detail: "external continuity experiment", x: 1050, y: 515 },
    ],
    edges: [
      { id: "structure-computing", type: "implements", source: "project:computing", target: "system:computing" },
      { id: "structure-host", type: "implements", source: "project:host", target: "system:host" },
      { id: "structure-runtime", type: "implements", source: "project:runtime", target: "system:runtime" },
      { id: "structure-world", type: "implements", source: "project:world", target: "system:world" },
      { id: "structure-host-runtime", type: "depends_on", source: "system:host", target: "system:runtime", label: "commits effects" },
      { id: "structure-host-computing", type: "depends_on", source: "system:host", target: "system:computing", label: "implements contracts" },
      { id: "structure-world-computing", type: "depends_on", source: "system:world", target: "system:computing", label: "tests contracts" },
    ],
  },
  {
    id: "execution", label: "Execution", kicker: "Effect path",
    description: "A curated execution path through Host, Runtime, and World, with Computing shown as external research pressure rather than an execution stage.",
    defaultNodeId: "project:host",
    placements: [
      { id: "project:computing", label: "Computing", detail: "tests contracts", x: 150, y: 115 },
      { id: "project:host", label: "Host", detail: "admits + continues Tasks", x: 430, y: 300 },
      { id: "project:runtime", label: "Runtime", detail: "commits local effects", x: 770, y: 150 },
      { id: "project:world", label: "World", detail: "reconciles external effects", x: 1010, y: 475 },
      { id: "question:host-general-goal", label: "Host test", detail: "general repository Goal", x: 275, y: 565, width: 250, height: 132 },
      { id: "question:runtime-structured-effect", label: "Runtime test", detail: "minimal Effect contract", x: 690, y: 515, width: 250, height: 132 },
      { id: "question:world-correlated-recovery", label: "World test", detail: "lost-response recovery", x: 1015, y: 150, width: 250, height: 132 },
    ],
    edges: [
      { id: "execution-computing-host", type: "implements", source: "project:computing", target: "project:host", label: "defines contracts" },
      { id: "execution-computing-runtime", type: "implements", source: "project:computing", target: "project:runtime", label: "defines contracts" },
      { id: "execution-computing-world", type: "implements", source: "project:computing", target: "project:world", label: "defines contracts" },
      { id: "execution-host-runtime", type: "depends_on", source: "project:host", target: "project:runtime", label: "local effects" },
      { id: "execution-host-world", type: "depends_on", source: "project:host", target: "project:world", label: "external effects" },
      { id: "execution-host-question", type: "explores", source: "project:host", target: "question:host-general-goal" },
      { id: "execution-runtime-question", type: "explores", source: "project:runtime", target: "question:runtime-structured-effect" },
      { id: "execution-world-question", type: "explores", source: "project:world", target: "question:world-correlated-recovery" },
    ],
  },
  {
    id: "research", label: "Research", kicker: "Question to publication",
    description: "A small sample of how active Questions become dated public arguments. The complete evidence remains in the article and its source repository.",
    defaultNodeId: "question:computing-smallest-core",
    placements: [
      { id: "question:computing-smallest-core", label: "Smallest core", detail: "what survives strong baselines?", x: 170, y: 145, width: 250, height: 132 },
      { id: "article:smaller-core-strong-baselines", label: "Strong-baseline report", detail: "canonical argument", x: 485, y: 145, width: 260, height: 124 },
      { id: "question:host-general-goal", label: "Host continuity", detail: "can semantic work stay above Runtime?", x: 170, y: 360, width: 250, height: 132 },
      { id: "article:thin-host-without-hidden-planner", label: "Thin Host report", detail: "bounded decision semantics", x: 485, y: 360, width: 260, height: 124 },
      { id: "question:game-agent-native-mechanics", label: "Agent-native game", detail: "what cannot be classical?", x: 770, y: 145, width: 250, height: 132 },
      { id: "article:station-zero-alpha-1", label: "Station Zero Alpha", detail: "playable release", x: 1080, y: 145, width: 240, height: 124 },
      { id: "question:security-adversarial-trajectory", label: "Adversarial trajectory", detail: "what does success mean?", x: 770, y: 430, width: 250, height: 132 },
      { id: "article:winning-move-loses-contest", label: "Security Round 1", detail: "multidimensional outcome report", x: 1080, y: 430, width: 240, height: 124 },
    ],
    edges: [
      { id: "research-smallest-core", type: "documents", source: "article:smaller-core-strong-baselines", target: "question:computing-smallest-core" },
      { id: "research-thin-host", type: "documents", source: "article:thin-host-without-hidden-planner", target: "question:host-general-goal" },
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
