export type ContentStatus = "active" | "experimental" | "paused" | "retired" | "historical";
export type EvidenceMetric = { value: string; label: string };

export type SystemDefinition = {
  id: string; kind: "system"; slug: string; index: string; title: string; summary: string; status: ContentStatus;
  thesis: string; question: string; owns: string[]; boundary: string[]; href?: string; updatedAt?: string;
};

export type ProjectDefinition = {
  id: string; kind: "project"; slug: string; title: string; summary: string; status: ContentStatus; group: string; label: string;
  repository: string; state: string; evidence: EvidenceMetric[]; systemNodeId?: string; publicPage: boolean; href?: string; updatedAt?: string;
  problem?: string; capability?: string; maturity?: string; audience?: string; latestProof?: string; flagshipSlug?: string;
};

export type QuestionDefinition = {
  id: string; kind: "question"; slug: string; projectSlug: string; title: string; summary: string; status: ContentStatus;
  state: "open" | "testing" | "answered" | "reframed"; importance: string; hypothesis: string; currentJudgment: string;
  nextStep: string; falsifier: string; href?: string; updatedAt?: string;
};

export type PublicObject = SystemDefinition | ProjectDefinition | QuestionDefinition;
