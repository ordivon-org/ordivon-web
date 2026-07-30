import {
  getNode,
  getNodesByKind,
  getProjectForQuestion,
  graphEvents,
  graphRelations,
} from "@/lib/graph";
import type {
  ArticleNode,
  DecisionNode,
  ExperimentNode,
  FindingNode,
  GraphEvent,
  GraphNode,
  GraphRelation,
  ProjectNode,
  QuestionNode,
} from "@/lib/graph/types";

export type ResearchEvidenceNode = ExperimentNode | FindingNode | DecisionNode;

export type ResearchQuestionSummary = {
  question: QuestionNode;
  project?: ProjectNode;
  experimentCount: number;
  findingCount: number;
  decisionCount: number;
  articleCount: number;
  evidenceCount: number;
  latestEvidenceDate?: string;
};

export type ResearchDossier = ResearchQuestionSummary & {
  experiments: ExperimentNode[];
  findings: FindingNode[];
  decisions: DecisionNode[];
  articles: ArticleNode[];
  events: GraphEvent[];
  relations: GraphRelation[];
  relatedQuestions: QuestionNode[];
};

const stateOrder: Record<QuestionNode["state"], number> = {
  testing: 0,
  open: 1,
  reframed: 2,
  answered: 3,
};

function nodeDate(node: GraphNode) {
  if (node.kind === "experiment" || node.kind === "finding" || node.kind === "decision" || node.kind === "article") return node.date;
  return node.updatedAt;
}

function byNewest<T extends GraphNode>(left: T, right: T) {
  return (nodeDate(right) || "").localeCompare(nodeDate(left) || "") || left.title.localeCompare(right.title);
}

function uniqueNodes<T extends GraphNode>(nodes: T[]) {
  return [...new Map(nodes.map((node) => [node.id, node])).values()];
}

function nodesFromRelations<T extends GraphNode["kind"]>(
  kind: T,
  predicate: (relation: GraphRelation) => boolean,
  endpoint: "source" | "target",
) {
  return graphRelations
    .filter(predicate)
    .map((relation) => getNode(relation[endpoint]))
    .filter((node): node is Extract<GraphNode, { kind: T }> => node?.kind === kind);
}

function projectQuestions(projectId: string) {
  return graphRelations
    .filter((relation) => relation.type === "raises" && relation.source === projectId)
    .map((relation) => getNode(relation.target))
    .filter((node): node is QuestionNode => node?.kind === "question");
}

export function getResearchQuestions() {
  return [...getNodesByKind("question")].sort((left, right) => {
    const state = stateOrder[left.state] - stateOrder[right.state];
    if (state) return state;
    const leftProject = getProjectForQuestion(left.id)?.title || "";
    const rightProject = getProjectForQuestion(right.id)?.title || "";
    return leftProject.localeCompare(rightProject) || left.title.localeCompare(right.title);
  });
}

export function getResearchQuestionBySlug(slug: string) {
  return getNodesByKind("question").find((question) => question.slug === slug);
}

export function getResearchDossier(questionOrSlug: QuestionNode | string): ResearchDossier | undefined {
  const question = typeof questionOrSlug === "string" ? getResearchQuestionBySlug(questionOrSlug) : questionOrSlug;
  if (!question) return undefined;

  const project = getProjectForQuestion(question.id);
  const directExperiments = nodesFromRelations(
    "experiment",
    (relation) => relation.type === "tests" && relation.target === question.id,
    "source",
  );
  const directFindings = nodesFromRelations(
    "finding",
    (relation) => relation.type === "supports" && relation.target === question.id,
    "source",
  );
  const directFindingIds = new Set(directFindings.map((finding) => finding.id));
  const upstreamExperiments = nodesFromRelations(
    "experiment",
    (relation) => relation.type === "supports" && directFindingIds.has(relation.target),
    "source",
  );
  const experiments = uniqueNodes([...directExperiments, ...upstreamExperiments]).sort(byNewest);
  const experimentIds = new Set(experiments.map((experiment) => experiment.id));
  const experimentFindings = nodesFromRelations(
    "finding",
    (relation) => relation.type === "supports" && experimentIds.has(relation.source),
    "target",
  );
  const findings = uniqueNodes([...directFindings, ...experimentFindings]).sort(byNewest);

  const directDecisions = nodesFromRelations(
    "decision",
    (relation) => relation.type === "implements" && relation.target === question.id,
    "source",
  );
  const findingIds = new Set(findings.map((finding) => finding.id));
  const findingDecisions = nodesFromRelations(
    "decision",
    (relation) => relation.type === "supports" && findingIds.has(relation.source),
    "target",
  );
  const decisions = uniqueNodes([...directDecisions, ...findingDecisions]).sort(byNewest);

  const evidenceIds = new Set([
    question.id,
    ...(project ? [project.id] : []),
    ...experiments.map((node) => node.id),
    ...findings.map((node) => node.id),
    ...decisions.map((node) => node.id),
  ]);
  const articles = uniqueNodes(nodesFromRelations(
    "article",
    (relation) => relation.type === "documents" && evidenceIds.has(relation.target),
    "source",
  )).sort(byNewest);
  for (const article of articles) evidenceIds.add(article.id);

  const events = graphEvents
    .filter((event) => event.nodeIds.some((id) => evidenceIds.has(id)))
    .sort((left, right) => right.date.localeCompare(left.date) || left.title.localeCompare(right.title));

  const relations = graphRelations.filter((relation) => evidenceIds.has(relation.source) && evidenceIds.has(relation.target));
  const relatedQuestions = project
    ? projectQuestions(project.id).filter((candidate) => candidate.id !== question.id).sort((left, right) => stateOrder[left.state] - stateOrder[right.state])
    : [];
  const latestEvidenceDate = [...experiments, ...findings, ...decisions, ...articles]
    .map((node) => nodeDate(node))
    .filter((date): date is string => Boolean(date))
    .sort((left, right) => right.localeCompare(left))[0];

  return {
    question,
    project,
    experiments,
    findings,
    decisions,
    articles,
    events,
    relations,
    relatedQuestions,
    experimentCount: experiments.length,
    findingCount: findings.length,
    decisionCount: decisions.length,
    articleCount: articles.length,
    evidenceCount: experiments.length + findings.length + decisions.length,
    latestEvidenceDate,
  };
}

export function getResearchQuestionSummaries(): ResearchQuestionSummary[] {
  return getResearchQuestions().map((question) => {
    const dossier = getResearchDossier(question);
    if (!dossier) throw new Error(`missing research dossier for ${question.id}`);
    return {
      question: dossier.question,
      project: dossier.project,
      experimentCount: dossier.experimentCount,
      findingCount: dossier.findingCount,
      decisionCount: dossier.decisionCount,
      articleCount: dossier.articleCount,
      evidenceCount: dossier.evidenceCount,
      latestEvidenceDate: dossier.latestEvidenceDate,
    };
  });
}
