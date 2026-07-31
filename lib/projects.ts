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
  problem: string;
  capability: string;
  maturity: string;
  audience: string;
  latestProof: string;
  flagshipSlug: string;
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

const questionPriority = { testing: 0, open: 1, reframed: 2, answered: 3 } as const;

function required(value: string | undefined, project: string, field: string) {
  if (!value) throw new Error(`${project} is missing public project field ${field}`);
  return value;
}

export const projects: Project[] = projectDefinitions
  .filter((project) => project.publicPage && project.systemNodeId)
  .map((project) => {
    const system = getSystemById(project.systemNodeId!);
    if (!system) throw new Error(`${project.id} references missing system ${project.systemNodeId}`);
    const openQuestions = questions
      .filter((question) => getProjectForQuestion(question.id)?.id === project.id)
      .sort((left, right) => questionPriority[left.state] - questionPriority[right.state])
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
      problem: required(project.problem, project.id, "problem"),
      capability: required(project.capability, project.id, "capability"),
      maturity: required(project.maturity, project.id, "maturity"),
      audience: required(project.audience, project.id, "audience"),
      latestProof: required(project.latestProof, project.id, "latestProof"),
      flagshipSlug: required(project.flagshipSlug, project.id, "flagshipSlug"),
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
