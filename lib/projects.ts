import { articles } from "@/lib/content";
import { getProjectBySlug, getProjectForQuestion, getArchitectureRoleById, projects as projectDefinitions, questions } from "@/content/model";
import type { ProjectAvailability, ProjectCategory } from "@/lib/model/types";

export type Project = {
  id: string;
  slug: string;
  index: string;
  group: string;
  category: ProjectCategory;
  availability: ProjectAvailability;
  title: string;
  label: string;
  thesis: string;
  summary: string;
  problem: string;
  capability: string;
  maturity: string;
  audience: string;
  latestProof: string;
  flagshipSlug?: string;
  question: string;
  state: string;
  lifecycle: "active" | "paused" | "retired" | "historical";
  owns: string[];
  boundary: string[];
  evidence: { value: string; label: string }[];
  openQuestions: { title: string; href: string; state: string }[];
  repository: string;
  relatedWriting: string[];
  updatedAt?: string;
};

const questionPriority = { testing: 0, open: 1, reframed: 2, answered: 3 } as const;

function required(value: string | undefined, project: string, field: string) {
  if (!value) throw new Error(`${project} is missing public project field ${field}`);
  return value;
}

export const projects: Project[] = projectDefinitions
  .filter((project) => project.publicPage)
  .map((project) => {
    const role = project.architectureRoleId ? getArchitectureRoleById(project.architectureRoleId) : undefined;
    if (project.architectureRoleId && !role) throw new Error(`${project.id} references missing architecture role ${project.architectureRoleId}`);
    const openQuestions = questions
      .filter((question) => getProjectForQuestion(question.id)?.id === project.id)
      .sort((left, right) => questionPriority[left.state] - questionPriority[right.state])
      .map((question) => ({ title: question.title, href: `/research/${question.slug}`, state: question.state }));
    return {
      id: project.id,
      slug: project.slug,
      index: role?.index || required(project.index, project.id, "index"),
      group: project.group,
      category: project.category || "research",
      availability: project.availability || "research",
      title: project.title,
      label: project.label,
      thesis: role?.thesis || required(project.thesis, project.id, "thesis"),
      summary: project.summary,
      problem: required(project.problem, project.id, "problem"),
      capability: required(project.capability, project.id, "capability"),
      maturity: required(project.maturity, project.id, "maturity"),
      audience: required(project.audience, project.id, "audience"),
      latestProof: required(project.latestProof, project.id, "latestProof"),
      flagshipSlug: project.flagshipSlug,
      question: role?.question || required(project.question, project.id, "question"),
      state: project.state,
      lifecycle: project.lifecycle,
      owns: [...(role?.owns || project.owns || [])],
      boundary: [...(role?.boundary || project.boundary || [])],
      evidence: [...project.evidence],
      openQuestions,
      repository: project.repository,
      relatedWriting: articles.filter((article) => article.projectSlugs.includes(project.slug)).map((article) => article.slug),
      updatedAt: project.updatedAt,
    };
  })
  .sort((a, b) => a.index.localeCompare(b.index));

export function getProject(slug: string) { return projects.find((project) => project.slug === slug); }
export { getProjectBySlug };
