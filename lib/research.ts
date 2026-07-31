import { articles } from "@/lib/content";
import { getProjectForQuestion, getQuestionBySlug, questions } from "@/content/model";
import type { Article } from "@/lib/content";
import type { ProjectDefinition, QuestionDefinition } from "@/lib/model/types";

export type ResearchQuestionSummary = {
  question: QuestionDefinition;
  project?: ProjectDefinition;
  articleCount: number;
  latestPublicationDate?: string;
};

export type ResearchDossier = ResearchQuestionSummary & {
  articles: Article[];
  relatedQuestions: QuestionDefinition[];
};

const stateOrder: Record<QuestionDefinition["state"], number> = { testing: 0, open: 1, reframed: 2, answered: 3 };

function byNewest(left: Article, right: Article) {
  return (right.revisedAt || right.publishedAt).localeCompare(left.revisedAt || left.publishedAt);
}

export function getResearchQuestions() {
  return [...questions].sort((left, right) => {
    const state = stateOrder[left.state] - stateOrder[right.state];
    if (state) return state;
    const leftProject = getProjectForQuestion(left.id)?.title || "";
    const rightProject = getProjectForQuestion(right.id)?.title || "";
    return leftProject.localeCompare(rightProject);
  });
}

export function getResearchQuestionBySlug(slug: string) { return getQuestionBySlug(slug); }

export function getResearchDossier(questionOrSlug: QuestionDefinition | string): ResearchDossier | undefined {
  const question = typeof questionOrSlug === "string" ? getResearchQuestionBySlug(questionOrSlug) : questionOrSlug;
  if (!question) return undefined;
  const project = getProjectForQuestion(question.id);
  const supporting = articles.filter((article) => article.questionSlugs.includes(question.slug)).sort(byNewest);
  const relatedQuestions = project
    ? getResearchQuestions().filter((candidate) => candidate.id !== question.id && getProjectForQuestion(candidate.id)?.id === project.id)
    : [];
  const latestPublicationDate = supporting.map((article) => article.revisedAt || article.publishedAt).sort((a, b) => b.localeCompare(a))[0];
  return { question, project, articles: supporting, relatedQuestions, articleCount: supporting.length, latestPublicationDate };
}

export function getResearchQuestionSummaries(): ResearchQuestionSummary[] {
  return getResearchQuestions().map((question) => {
    const dossier = getResearchDossier(question)!;
    return { question, project: dossier.project, articleCount: dossier.articleCount, latestPublicationDate: dossier.latestPublicationDate };
  });
}
