import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { articles } from "@/lib/content";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Compare the problems, capabilities, maturity, latest evidence, and open questions across Ordivon Computing, Host, Runtime, and World.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="page-shell page-top projects-page">
      <header className="index-hero projects-hero">
        <p className="eyebrow">Projects</p>
        <h1>Four projects preserve different parts of one durable work trajectory.</h1>
        <p>Start from the failure each project prevents, the capability it currently provides, and the evidence that supports its maturity. Ownership details remain on the project page.</p>
      </header>

      <section className="project-capability-directory" aria-label="Ordivon project capabilities">
        {projects.map((project) => {
          const proofArticle = articles.find((article) => article.slug === project.flagshipSlug);
          const openQuestion = project.openQuestions[0];
          if (!proofArticle || !openQuestion) throw new Error(`${project.slug} is missing public proof or an open question`);
          return (
            <article className={`project-capability-card status-${project.lifecycle}`} key={project.slug}>
              <header>
                <div><span>{project.index}</span><b>{project.group}</b></div>
                <i>{project.maturity}</i>
              </header>
              <h2><Link href={`/projects/${project.slug}`}>{project.title}</Link></h2>
              <section><span>Problem</span><p>{project.problem}</p></section>
              <section><span>What it does</span><p>{project.capability}</p></section>
              <section className="project-card-proof"><span>Latest proof</span><p>{project.latestProof}</p><Link href={`/writing/${proofArticle.slug}`}>{proofArticle.title} ↗</Link></section>
              <section className="project-card-question"><span>Open question · {openQuestion.state}</span><p>{openQuestion.title}</p><Link href={openQuestion.href}>See the next test ↗</Link></section>
              <footer><Link href={`/projects/${project.slug}`}>Open project</Link><a href={project.repository}>Repository ↗</a></footer>
            </article>
          );
        })}
      </section>

      <section className="portfolio-boundary">
        <SectionHeading eyebrow="How they connect" title="The projects cooperate without becoming one mandatory pipeline." description="A local Runtime job may never reach an external service. World can observe a path before Host admits a task. Computing can delete a proposed contract without owning production state." />
        <div><p>Host owns the meaning and accepted progress of durable work. Runtime owns local execution facts. World owns conditioned external interaction. Computing tests which shared contracts remain necessary across those boundaries.</p><p>Source, tests, releases, receipts, and each repository&apos;s current documents remain the technical authority. This site provides orientation, evidence paths, and dated judgment.</p></div>
      </section>
    </div>
  );
}
