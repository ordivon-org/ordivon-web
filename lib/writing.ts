import { getProjectBySlug, getProjectForQuestion, getQuestionBySlug, questions } from "@/content/model";
import { articles, type Article } from "@/lib/content";
import type { ProjectDefinition, QuestionDefinition } from "@/lib/model/types";

export type WritingAnchor =
  | { kind: "project"; id: string; title: string; summary: string; href: string; object: ProjectDefinition }
  | { kind: "question"; id: string; title: string; summary: string; href: string; object: QuestionDefinition };

export type WritingConnection = { article: Article; sharedProjects: ProjectDefinition[]; sharedQuestions: QuestionDefinition[]; score: number };
export type ArticleContext = { article: Article; anchors: WritingAnchor[]; related: WritingConnection[] };

function articleDate(article: Article) { return article.modifiedDate || article.date; }
function byDate(left: Article, right: Article) { return articleDate(right).localeCompare(articleDate(left)); }

export function getArticleAnchors(article: Article): WritingAnchor[] {
  const projectAnchors = article.projectSlugs.map(getProjectBySlug).filter((item): item is ProjectDefinition => Boolean(item)).map((project) => ({
    kind: "project" as const, id: project.id, title: project.title, summary: project.summary, href: project.publicPage ? `/projects/${project.slug}` : project.repository, object: project,
  }));
  const questionAnchors = article.questionSlugs.map(getQuestionBySlug).filter((item): item is QuestionDefinition => Boolean(item)).map((question) => ({
    kind: "question" as const, id: question.id, title: question.title, summary: question.summary, href: `/research/${question.slug}`, object: question,
  }));
  return [...questionAnchors, ...projectAnchors];
}

export function getArticleContext(slug: string): ArticleContext | undefined {
  const article = articles.find((item) => item.slug === slug);
  if (!article) return undefined;
  const projectSet = new Set(article.projectSlugs);
  const questionSet = new Set(article.questionSlugs);
  const related = articles.filter((candidate) => candidate.slug !== slug).map((candidate) => {
    const sharedProjects = candidate.projectSlugs.filter((item) => projectSet.has(item)).map(getProjectBySlug).filter((item): item is ProjectDefinition => Boolean(item));
    const sharedQuestions = candidate.questionSlugs.filter((item) => questionSet.has(item)).map(getQuestionBySlug).filter((item): item is QuestionDefinition => Boolean(item));
    return { article: candidate, sharedProjects, sharedQuestions, score: sharedQuestions.length * 5 + sharedProjects.length * 2 };
  }).filter((item) => item.score > 0).sort((left, right) => right.score - left.score || byDate(left.article, right.article));
  return { article, anchors: getArticleAnchors(article), related };
}

export function getFeaturedWriting(limit = 3) {
  const longForm = [...articles].filter((article) => article.type !== "Research note").sort(byDate);
  return longForm.slice(0, limit);
}

export function getWritingTopics() {
  return questions.map((question) => ({
    question,
    project: getProjectForQuestion(question.id),
    articles: articles.filter((article) => article.questionSlugs.includes(question.slug)).sort(byDate),
  })).filter((item) => item.articles.length).sort((left, right) => right.articles.length - left.articles.length || left.question.title.localeCompare(right.question.title));
}
