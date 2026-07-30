import { graphEvents } from "@/content/graph/events";
import { graphNodes, graphUpdatedAt } from "@/content/graph/nodes";
import { graphRelations } from "@/content/graph/relations";
import type { ArticleNode, GraphNode, NodeKind, ProjectNode, QuestionNode, SystemNode } from "./types";

const nodeById = new Map(graphNodes.map((node) => [node.id, node]));

function validateDate(value: string, label: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    throw new Error(`${label} has invalid date ${value}`);
  }
}

function validateGraph() {
  if (nodeById.size !== graphNodes.length) throw new Error("graph contains duplicate node IDs");
  const relationIds = new Set<string>();
  for (const relation of graphRelations) {
    if (relationIds.has(relation.id)) throw new Error(`duplicate relation ID ${relation.id}`);
    relationIds.add(relation.id);
    if (!nodeById.has(relation.source)) throw new Error(`${relation.id} has missing source ${relation.source}`);
    if (!nodeById.has(relation.target)) throw new Error(`${relation.id} has missing target ${relation.target}`);
    if (relation.source === relation.target) throw new Error(`${relation.id} cannot self-reference`);
  }
  for (const node of graphNodes) {
    if (node.updatedAt) validateDate(node.updatedAt, node.id);
    if (node.kind === "experiment" || node.kind === "finding" || node.kind === "decision" || node.kind === "article") validateDate(node.date, node.id);
  }
  for (const event of graphEvents) {
    validateDate(event.date, event.id);
    for (const nodeId of event.nodeIds) if (!nodeById.has(nodeId)) throw new Error(`${event.id} references missing node ${nodeId}`);
  }
}

validateGraph();

export { graphEvents, graphNodes, graphRelations, graphUpdatedAt };
export type { GraphEvent, GraphNode, GraphRelation, NodeKind } from "./types";

export function getNode(id: string) {
  return nodeById.get(id);
}

export function getNodesByKind<K extends NodeKind>(kind: K) {
  return graphNodes.filter((node): node is Extract<GraphNode, { kind: K }> => node.kind === kind);
}

export function getRelationsForNode(id: string) {
  return graphRelations.filter((relation) => relation.source === id || relation.target === id);
}

export function getNeighbors(id: string) {
  return getRelationsForNode(id)
    .map((relation) => nodeById.get(relation.source === id ? relation.target : relation.source))
    .filter((node): node is GraphNode => Boolean(node));
}

export function getSubgraph(nodeIds: Iterable<string>) {
  const ids = new Set(nodeIds);
  return {
    nodes: graphNodes.filter((node) => ids.has(node.id)),
    relations: graphRelations.filter((relation) => ids.has(relation.source) && ids.has(relation.target)),
  };
}

export function getActiveQuestions() {
  return getNodesByKind("question").filter((node) => node.status === "active" || node.status === "experimental");
}

export function getRecentEvents(limit = 6) {
  return [...graphEvents].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}

export function getRelatedArticles(nodeId: string) {
  const articleIds = graphRelations
    .filter((relation) => relation.type === "documents" && relation.target === nodeId && relation.source.startsWith("article:"))
    .map((relation) => relation.source);
  return articleIds.map((id) => nodeById.get(id)).filter((node): node is ArticleNode => node?.kind === "article");
}

export function getProjectResearch(projectId: string) {
  const questionIds = graphRelations
    .filter((relation) => relation.source === projectId && relation.type === "raises")
    .map((relation) => relation.target);
  const connectedIds = new Set([projectId, ...questionIds]);
  for (const relation of graphRelations) if (questionIds.includes(relation.target)) connectedIds.add(relation.source);
  return getSubgraph(connectedIds);
}

export function getProjectNodeBySlug(slug: string) {
  return getNodesByKind("project").find((node): node is ProjectNode => node.slug === slug);
}

export function getSystemNode(id: string) {
  const node = nodeById.get(id);
  return node?.kind === "system" ? (node as SystemNode) : undefined;
}

export function getProjectForQuestion(questionId: string) {
  const relation = graphRelations.find((item) => item.type === "raises" && item.target === questionId);
  const node = relation ? nodeById.get(relation.source) : undefined;
  return node?.kind === "project" ? (node as ProjectNode) : undefined;
}

export function getQuestion(id: string) {
  const node = nodeById.get(id);
  return node?.kind === "question" ? (node as QuestionNode) : undefined;
}
