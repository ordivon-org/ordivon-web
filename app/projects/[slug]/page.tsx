import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectMechanism } from "@/components/project-mechanism";
import { articles } from "@/lib/content";
import { getProject, projects } from "@/lib/projects";

export const dynamicParams = false;
export function generateStaticParams() { return projects.map((project) => ({ slug: project.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.title, description: project.summary, alternates: { canonical: `/projects/${project.slug}` } };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const related = project.relatedWriting.map((articleSlug) => articles.find((article) => article.slug === articleSlug)).filter(Boolean);
  return (
    <div className={`project-page project-${project.slug}`}>
      <header className="project-hero page-shell page-top">
        <div className="project-hero-meta"><p>{project.group}</p><span>{project.index} / {String(projects.length).padStart(2, "0")}</span></div>
        <h1>{project.thesis}</h1>
        <div className="project-intro"><p>{project.summary}</p><a className="button primary" href={project.repository}>Repository <span>↗</span></a></div>
      </header>
      <section className="project-question page-shell"><p>Central question</p><h2>{project.question}</h2></section>
      <section className="project-model-wrap page-shell"><ProjectMechanism project={project} /></section>
      <section className="project-facts page-shell">
        <div className="project-fact-copy"><p className="section-index">Current state</p><h2>{project.state}</h2><p>The page states the present boundary; the repository owns the live implementation, tests, and receipts.</p></div>
        <div className="evidence-metrics">{project.evidence.map((item) => <div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div>
      </section>
      <section className="ownership-grid page-shell">
        <div><p className="section-index">Owns</p><h2>Facts this project is allowed to commit.</h2><ul>{project.owns.map((item) => <li key={item}>{item}</li>)}</ul></div>
        <div><p className="section-index">Hard boundary</p><h2>Claims it must leave to another owner.</h2><ul>{project.boundary.map((item) => <li key={item}>{item}</li>)}</ul></div>
      </section>
      <section className="open-questions page-shell"><p className="section-index">Open questions</p><div>{project.openQuestions.map((question, index) => <article key={question}><span>{String(index + 1).padStart(2, "0")}</span><h2>{question}</h2></article>)}</div></section>
      <section className="project-related page-shell"><p className="section-index">Related writing</p><div>{related.map((article) => article && <Link href={`/writing/${article.slug}`} key={article.slug}><span>{article.type}</span><h2>{article.title}</h2><b>{article.readMinutes} min ↗</b></Link>)}</div></section>
    </div>
  );
}
