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
  return { title: project.title, description: `${project.problem} ${project.capability}`, alternates: { canonical: `/projects/${project.slug}` } };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const related = project.relatedWriting.map((articleSlug) => articles.find((article) => article.slug === articleSlug)).filter(Boolean);
  const flagship = articles.find((article) => article.slug === project.flagshipSlug);
  if (!flagship) throw new Error(`${project.slug} is missing flagship writing`);
  return (
    <div className={`project-page project-${project.slug}`}>
      <header className="project-hero page-shell page-top">
        <div className="project-hero-meta"><p>{project.group}</p><span>{project.index} / {String(projects.length).padStart(2, "0")}</span></div>
        <h1>{project.title}</h1>
        <p className="project-hero-thesis">{project.thesis}</p>
        <div className="project-intro"><p>{project.summary}</p><div className="actions"><a className="button primary" href={project.repository}>Repository <span>↗</span></a><Link className="button text" href={`/writing/${flagship.slug}`}>Read the latest proof</Link></div></div>
        <dl className="project-use-strip">
          <div><dt>Maturity</dt><dd>{project.maturity}</dd></div>
          <div><dt>Built for</dt><dd>{project.audience}</dd></div>
          <div><dt>Latest proof</dt><dd>{project.latestProof}</dd></div>
        </dl>
      </header>
      <section className="project-question page-shell"><p>Question this project must answer</p><h2>{project.question}</h2></section>
      <section className="project-model-wrap page-shell"><ProjectMechanism project={project} /></section>
      <section className="project-facts page-shell">
        <div className="project-fact-copy"><p className="section-index">Where it stands now</p><h2>{project.maturity}</h2><p>{project.state}</p></div>
        <div><p className="section-index project-evidence-label">Capability evidence</p><div className="evidence-metrics">{project.evidence.map((item) => <div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div></div>
      </section>
      <section className="ownership-grid page-shell">
        <div><p className="section-index">What this project owns</p><h2>Facts it must preserve and may commit.</h2><ul>{project.owns.map((item) => <li key={item}>{item}</li>)}</ul></div>
        <div><p className="section-index">What it leaves elsewhere</p><h2>Responsibilities another owner or mature system should retain.</h2><ul>{project.boundary.map((item) => <li key={item}>{item}</li>)}</ul></div>
      </section>
      <section className="open-questions page-shell"><p className="section-index">Questions that can still change the project</p><div>{project.openQuestions.map((question, index) => <Link href={question.href} key={question.href}><span>{String(index + 1).padStart(2, "0")}</span><div><p>{question.state}</p><h2>{question.title}</h2></div><b aria-hidden="true">↗</b></Link>)}</div></section>
      <section className="project-related page-shell"><p className="section-index">Evidence and related arguments</p><div>{related.map((article) => article && <Link href={`/writing/${article.slug}`} key={article.slug}><span>{article.type}</span><h2>{article.title}</h2><b>{article.readMinutes} min ↗</b></Link>)}</div></section>
    </div>
  );
}
