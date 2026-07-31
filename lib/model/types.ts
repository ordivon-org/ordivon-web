export type ProjectLifecycle = "active" | "paused" | "retired" | "historical";
export type BoundaryMaturity = "tested" | "experimental";
export type ResearchPlaneStatus = "active" | "paused" | "retired";
export type QuestionState = "open" | "testing" | "answered" | "reframed";
export type EvidenceMetric = { value: string; label: string };

type ArchitectureRoleBase = {
  id: string; slug: string; index: string; title: string; summary: string;
  thesis: string; question: string; owns: string[]; boundary: string[]; href?: string; updatedAt?: string;
};
export type BoundaryDefinition = ArchitectureRoleBase & { kind: "boundary"; maturity: BoundaryMaturity };
export type ResearchPlaneDefinition = ArchitectureRoleBase & { kind: "research-plane"; status: ResearchPlaneStatus };
export type ArchitectureRoleDefinition = BoundaryDefinition | ResearchPlaneDefinition;

export type ProjectDefinition = {
  id: string; kind: "project"; slug: string; title: string; summary: string; lifecycle: ProjectLifecycle; group: string; label: string;
  repository: string; state: string; evidence: EvidenceMetric[]; architectureRoleId?: string; publicPage: boolean; href?: string; updatedAt?: string;
  problem?: string; capability?: string; maturity?: string; audience?: string; latestProof?: string; flagshipSlug?: string;
};

export type QuestionDefinition = {
  id: string; kind: "question"; slug: string; projectSlug: string; title: string; summary: string;
  state: QuestionState; importance: string; hypothesis: string; currentJudgment: string;
  nextStep: string; falsifier: string; href?: string; updatedAt?: string;
};

export type PublicObject = ArchitectureRoleDefinition | ProjectDefinition | QuestionDefinition;
