import { articles } from "@/lib/content";
import { getProjectBySlug, getProjectForQuestion, getSystemById, projects as projectDefinitions, questions } from "@/content/model";

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
  openQuestions: { title: string; href: string; state: string }[];
  repository: string;
  relatedWriting: string[];
};

export const projects: Project[] = projectDefinitions
  .filter((project) => project.publicPage && project.systemNodeId)
  .map((project) => {
    const system = getSystemById(project.systemNodeId!);
    if (!system) throw new Error(`${project.id} references missing system ${project.systemNodeId}`);
    const openQuestions = questions
      .filter((question) => getProjectForQuestion(question.id)?.id === project.id)
      .map((question) => ({ title: question.title, href: `/research/${question.slug}`, state: question.state }));
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
      relatedWriting: articles.filter((article) => article.projectSlugs.includes(project.slug)).map((article) => article.slug),
    };
  })
  .sort((a, b) => a.index.localeCompare(b.index));

export function getProject(slug: string) { return projects.find((project) => project.slug === slug); }
export { getProjectBySlug };
