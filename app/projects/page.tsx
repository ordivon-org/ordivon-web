import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { articles, formatDate } from "@/lib/content";
import { siteUpdatedAt } from "@/content/model";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "A dated public projection of Ordivon infrastructure, playable applications, operational capability, and bounded research—with explicit maturity, evidence basis, and repository authority.",
  alternates: { canonical: "/projects" },
};

const groups = [
  {
    id: "core-system",
    eyebrow: "Core work system",
    title: "Three boundaries carry durable Agent work.",
    description: "Host preserves the Task, Harness runs one replaceable Agent episode, and Runtime commits physical local execution. They cooperate without sharing one truth store.",
  },
  {
    id: "application",
    eyebrow: "Applications and capability",
    title: "Domain systems test whether the boundaries survive real consequences.",
    description: "Game tests agency, World tests cross-owner reality relations, Finance tests capital judgment and effects, and Studio tests creation, perception, and expression.",
  },
  {
    id: "research",
    eyebrow: "Research and specification",
    title: "Research projects test what should remain, change, or disappear.",
    description: "Computing tests cross-project world-model laws, Human studies practical human trajectories, and Security tests strategic agency under adaptive opposition.",
  },
] as const;

const statusLabel = {
  operational: "Operational capability",
  prototype: "Implemented prototype",
  playable: "Playable application",
  research: "Bounded research",
  internal: "Internal",
} as const;

export default function ProjectsPage() {
  return (
    <div className="page-shell page-top projects-page">
      <header className="index-hero projects-hero">
        <p className="eyebrow">Projects · public projection · {formatDate(siteUpdatedAt)}</p>
        <h1>{projects.length} projects, three kinds of work, no single mandatory stack.</h1>
        <p>Use this page to distinguish operational infrastructure, implemented prototypes, playable applications, retained capability, and research. Each card is a dated Web judgment with its own source/editorial basis; exact current implementation facts remain in each repository.</p>
        <div className="project-status-legend" aria-label="Project status legend">
          {Object.entries(statusLabel).filter(([key]) => key !== "internal").map(([key, label]) => <span key={key} data-status={key}>{label}</span>)}
        </div>
        <nav className="project-quick-index" aria-label="Open a project">
          {projects.map((project) => <Link href={`/projects/${project.slug}`} key={project.slug}><span>{project.index}</span><strong>{project.title}</strong></Link>)}
        </nav>
      </header>

      {groups.map((group) => {
        const members = projects.filter((project) => project.category === group.id);
        return (
          <section className="project-group" key={group.id}>
            <SectionHeading eyebrow={group.eyebrow} title={group.title} description={group.description} />
            <div className="project-capability-directory">
              {members.map((project) => {
                const proofArticle = project.flagshipSlug ? articles.find((article) => article.slug === project.flagshipSlug) : undefined;
                const nextQuestion = project.openQuestions.find((question) => question.state === "testing" || question.state === "open") || project.openQuestions[0];
                return (
                  <article className={`project-capability-card status-${project.lifecycle}`} data-availability={project.availability} key={project.slug}>
                    <header>
                      <div><span>{project.index}</span><b>{statusLabel[project.availability]}</b></div>
                      <i>{project.maturity}</i>{project.updatedAt && <time dateTime={project.updatedAt}>Basis {formatDate(project.updatedAt)}</time>}
                    </header>
                    <h2 id={`project-group-${group.id}-${project.slug}`}><Link href={`/projects/${project.slug}`}>{project.title}</Link></h2>
                    <section><span>Role</span><p>{project.label}</p></section>
                    <section><span>What exists</span><p>{project.capability}</p></section>
                    <section className="project-card-proof"><span>Evidence for this judgment</span><p>{project.latestProof}</p>{proofArticle && <Link href={`/writing/${proofArticle.slug}`}>{proofArticle.status === "historical" ? "Historical evidence" : "Read the evidence"}: {proofArticle.title} ↗</Link>}</section>
                    {nextQuestion && <section className="project-card-question"><span>Question · {nextQuestion.state}</span><p>{nextQuestion.title}</p><Link href={nextQuestion.href}>Open the research dossier ↗</Link></section>}
                    <footer><Link href={`/projects/${project.slug}`}>Open project</Link><a href={project.repository}>Repository ↗</a></footer>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}

      <section className="portfolio-boundary">
        <SectionHeading eyebrow="Authority" title="The website explains the map; repositories own the facts." description="Public status is an authored orientation at a date. Source, tests, releases, receipts, research methods, and operational truth remain with the project that produced them." />
        <div><p>Start with <Link href="/system">How it works</Link> when you need the core work trajectory. Start with <Link href="/research">Research</Link> when the useful unit is an uncertainty that can still change the architecture. Use the repository link whenever exact capability, installation, or evidence matters.</p><p>A project can be valuable without becoming universal infrastructure: Game owns its game semantics, Finance owns capital meaning, Studio owns creative evidence, World owns only the cross-owner reality relations that survived deletion, and Human and Security retain bounded research scopes.</p></div>
      </section>
    </div>
  );
}
