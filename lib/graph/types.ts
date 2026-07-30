export type NodeStatus = "active" | "experimental" | "paused" | "retired" | "historical";
export type NodeKind = "system" | "project" | "question" | "experiment" | "finding" | "decision" | "article";
export type RelationType = "defines" | "depends_on" | "tests" | "supports" | "contradicts" | "supersedes" | "implements" | "documents" | "raises";

export type EvidenceMetric = { value: string; label: string };

export type BaseNode = {
  id: string;
  kind: NodeKind;
  title: string;
  summary: string;
  status: NodeStatus;
  href?: string;
  updatedAt?: string;
  tags?: string[];
};

export type SystemNode = BaseNode & {
  kind: "system";
  slug: string;
  index: string;
  thesis: string;
  question: string;
  owns: string[];
  boundary: string[];
};

export type ProjectNode = BaseNode & {
  kind: "project";
  slug: string;
  group: string;
  label: string;
  repository: string;
  state: string;
  evidence: EvidenceMetric[];
  systemNodeId?: string;
  publicPage: boolean;
};

export type QuestionNode = BaseNode & {
  kind: "question";
  state: "open" | "testing" | "answered" | "reframed";
};

export type ExperimentNode = BaseNode & {
  kind: "experiment";
  state: "planned" | "running" | "completed" | "stopped";
  date: string;
};

export type FindingNode = BaseNode & {
  kind: "finding";
  confidence: "tentative" | "supported" | "strong";
  date: string;
};

export type DecisionNode = BaseNode & {
  kind: "decision";
  rationale: string;
  date: string;
};

export type ArticleNode = BaseNode & {
  kind: "article";
  slug: string;
  articleType: string;
  project: string;
  date: string;
};

export type GraphNode = SystemNode | ProjectNode | QuestionNode | ExperimentNode | FindingNode | DecisionNode | ArticleNode;

export type GraphRelation = {
  id: string;
  type: RelationType;
  source: string;
  target: string;
  label?: string;
};

export type GraphEvent = {
  id: string;
  date: string;
  type: "experiment" | "finding" | "decision" | "publication" | "project";
  title: string;
  summary: string;
  nodeIds: string[];
};
