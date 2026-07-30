import { getNode, getNodesByKind, graphRelations } from "@/lib/graph";
import type { ArticleNode, GraphNode, NodeStatus } from "@/lib/graph/types";

export type WritingAnchorKind = "project" | "question" | "finding" | "decision";

export type WritingAnchor = {
  id: string;
  kind: WritingAnchorKind;
  title: string;
  summary: string;
  status: NodeStatus;
  href?: string;
};

export type WritingConnection = {
  article: ArticleNode;
  sharedAnchors: WritingAnchor[];
  score: number;
};

export type WritingArgument = {
  article: ArticleNode;
  anchors: WritingAnchor[];
  related: WritingConnection[];
  centrality: number;
};

export type WritingNetworkEdge = {
  id: string;
  articleId: string;
  anchorId: string;
};

export type WritingNetwork = {
  arguments: WritingArgument[];
  anchors: WritingAnchor[];
  edges: WritingNetworkEdge[];
};

const anchorKinds = new Set<GraphNode["kind"]>(["project", "question", "finding", "decision"]);
const anchorWeight: Record<WritingAnchorKind, number> = {
  question: 5,
  finding: 4,
  decision: 4,
  project: 2,
};

function anchorHref(node: GraphNode) {
  if (node.kind === "question") return `/research/${node.slug}`;
  if (node.kind === "project") return node.publicPage ? `/projects/${node.slug}` : node.repository;
  return undefined;
}

function toAnchor(node: GraphNode): WritingAnchor | undefined {
  if (!anchorKinds.has(node.kind)) return undefined;
  return {
    id: node.id,
    kind: node.kind as WritingAnchorKind,
    title: node.title,
    summary: node.summary,
    status: node.status,
    href: anchorHref(node),
  };
}

function byDateThenTitle(left: ArticleNode, right: ArticleNode) {
  return right.date.localeCompare(left.date) || left.title.localeCompare(right.title);
}

export function getArticleNodeBySlug(slug: string) {
  return getNodesByKind("article").find((article) => article.slug === slug);
}

export function getArticleAnchors(articleId: string) {
  return graphRelations
    .filter((relation) => relation.type === "documents" && relation.source === articleId)
    .map((relation) => getNode(relation.target))
    .filter((node): node is GraphNode => Boolean(node))
    .map(toAnchor)
    .filter((anchor): anchor is WritingAnchor => Boolean(anchor))
    .sort((left, right) => anchorWeight[right.kind] - anchorWeight[left.kind] || left.title.localeCompare(right.title));
}

export function getWritingNetwork(): WritingNetwork {
  const articles = [...getNodesByKind("article")].sort(byDateThenTitle);
  const anchorsByArticle = new Map(articles.map((article) => [article.id, getArticleAnchors(article.id)]));
  const anchors = [...new Map(
    [...anchorsByArticle.values()].flat().map((anchor) => [anchor.id, anchor]),
  ).values()].sort((left, right) => anchorWeight[right.kind] - anchorWeight[left.kind] || left.title.localeCompare(right.title));

  const argumentsById = new Map<string, WritingArgument>();
  for (const article of articles) {
    const articleAnchors = anchorsByArticle.get(article.id) || [];
    const articleAnchorIds = new Set(articleAnchors.map((anchor) => anchor.id));
    const related = articles
      .filter((candidate) => candidate.id !== article.id)
      .map((candidate) => {
        const sharedAnchors = (anchorsByArticle.get(candidate.id) || []).filter((anchor) => articleAnchorIds.has(anchor.id));
        const score = sharedAnchors.reduce((total, anchor) => total + anchorWeight[anchor.kind], 0);
        return { article: candidate, sharedAnchors, score };
      })
      .filter((connection) => connection.score > 0)
      .sort((left, right) => right.score - left.score || byDateThenTitle(left.article, right.article));
    const centrality = articleAnchors.reduce((total, anchor) => total + anchorWeight[anchor.kind], 0)
      + related.reduce((total, connection) => total + connection.score, 0);
    argumentsById.set(article.id, { article, anchors: articleAnchors, related, centrality });
  }

  return {
    arguments: articles.map((article) => argumentsById.get(article.id)!),
    anchors,
    edges: articles.flatMap((article) => (anchorsByArticle.get(article.id) || []).map((anchor) => ({
      id: `writing-edge:${article.id}:${anchor.id}`,
      articleId: article.id,
      anchorId: anchor.id,
    }))),
  };
}

export function getWritingArgument(slug: string) {
  return getWritingNetwork().arguments.find((argument) => argument.article.slug === slug);
}

export function getFeaturedWriting(limit = 3) {
  return [...getWritingNetwork().arguments]
    .sort((left, right) => right.centrality - left.centrality || byDateThenTitle(left.article, right.article))
    .slice(0, limit);
}
