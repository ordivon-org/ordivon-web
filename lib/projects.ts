import { getNode, getNodesByKind, getRelatedArticles, getSystemNode, graphRelations } from "@/lib/graph";

export type Project = {
  id: string;
  slug: string;
  index: string;
  group: string;
  title: string;
  label: string;
  thesis: string;
  summary: string;
  question: string;
  state: string;
  status: "active" | "experimental" | "paused" | "retired" | "historical";
  owns: string[];
  boundary: string[];
  evidence: { value: string; label: string }[];
  openQuestions: string[];
  repository: string;
  relatedWriting: string[];
};

export const projects: Project[] = getNodesByKind("project")
  .filter((project) => project.publicPage && project.systemNodeId)
  .map((project) => {
    const system = getSystemNode(project.systemNodeId!);
    if (!system) throw new Error(`${project.id} references missing system ${project.systemNodeId}`);
    const openQuestions = graphRelations
      .filter((relation) => relation.source === project.id && relation.type === "raises")
      .map((relation) => getNode(relation.target))
      .filter((node) => node?.kind === "question")
      .map((node) => node.title);
    return {
      id: project.id,
      slug: project.slug,
      index: system.index,
      group: project.group,
      title: project.title,
      label: project.label,
      thesis: system.thesis,
      summary: project.summary,
      question: system.question,
      state: project.state,
      status: project.status,
      owns: [...system.owns],
      boundary: [...system.boundary],
      evidence: [...project.evidence],
      openQuestions,
      repository: project.repository,
      relatedWriting: getRelatedArticles(project.id).map((article) => article.slug),
    };
  })
  .sort((a, b) => a.index.localeCompare(b.index));

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
