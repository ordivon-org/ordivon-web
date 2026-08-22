import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { formatDate } from "@/lib/content";
import { editorialSelections } from "@/content/editorial/selections";
import { getProjectBySlug, getQuestionBySlug } from "@/content/model";
import { getResearchQuestionSummaries } from "@/lib/research";
import { currentUpdatedAt, getCurrentProjects, getRecentPublications } from "@/lib/updates";

export const metadata: Metadata = {
  title: "Now",
  description: `A dated editorial summary of what is usable, implemented, playable, under research, or historical across Ordivon as of ${formatDate(currentUpdatedAt)}.`,
  alternates: { canonical: "/now" },
};

const authoredSummary = [
  { label: "Durable work", title: "Host contracted; Harness and Runtime became more explicit about what they do not own.", projectSlugs: ["host", "harness", "runtime"] },
  { label: "Reality-facing systems", title: "Game and Finance now expose materially different consequences instead of serving as demonstrations of one platform.", projectSlugs: ["game", "finance"] },
  { label: "Mediation and external relation", title: "Media is now the top-level mediation owner; World remains a narrow cross-owner relation boundary.", projectSlugs: ["studio", "world"] },
  { label: "Research and knowledge", title: "Computing, Human, and Security retain bounded research while mature results descend into Knowledge or owner-local practice.", projectSlugs: ["computing", "human", "security"] },
] as const;

const availabilityLabel = {
  operational: "usable now",
  prototype: "implemented prototype",
  playable: "playable now",
  research: "research",
  internal: "internal",
} as const;

export default function NowPage() {
  const frontier = getResearchQuestionSummaries().filter((item) => item.question.state === "testing" || item.question.state === "open").slice(0, 6);
  const publications = getRecentPublications(8);
  const projects = getCurrentProjects();
  const summary = authoredSummary.map((item) => ({
    ...item,
    body: item.projectSlugs.map((slug) => getProjectBySlug(slug)?.state).filter(Boolean).join(" "),
  }));
  const revisedQuestions = editorialSelections.now.judgmentChanges.map(getQuestionBySlug).filter((question): question is NonNullable<typeof question> => Boolean(question));

  return (
    <div className="page-shell page-top now-page">
      <header className="index-hero now-hero">
        <p className="eyebrow">Now · {formatDate(currentUpdatedAt)}</p>
        <h1>What can be used, what has been implemented, what remains research, and what became historical.</h1>
        <p>This is a dated editorial synthesis across the project family. Project repositories remain authoritative for exact capability, operation, release, and research evidence.</p>
      </header>

      <section className="now-brief" aria-labelledby="now-brief-title">
        <div className="now-brief-intro"><p className="section-index">Current synthesis</p><h2 id="now-brief-title">The public map now distinguishes capability from prototype, product, research, and history.</h2></div>
        <div className="now-brief-grid">{summary.map((item, index) => <article key={item.label}><span>{String(index + 1).padStart(2, "0")} / {item.label}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>
      </section>

      <section className="now-frontier" aria-labelledby="now-frontier-title">
        <SectionHeading eyebrow="Under real pressure" title="Experiments that can still change a boundary or delete an idea." description="These questions remain active because another workload, failure, or comparison can change where responsibility belongs." />
        <div className="now-frontier-grid">{frontier.map((item) => <Link href={`/research/${item.question.slug}`} key={item.question.id}><div><span>{item.project?.title || "Independent research"}</span><span>{item.articleCount} supporting publications</span></div><h3>{item.question.title}</h3><p>{item.question.nextStep}</p></Link>)}</div>
      </section>

      <section className="now-signals" aria-labelledby="now-signals-title">
        <SectionHeading eyebrow="Dated evidence" title="Read the arguments and reports that changed the judgment." description="A current page summarizes today. A publication preserves the evidence, limits, and interpretation at its publication or revision date." />
        <div className="now-signal-grid">{publications.slice(0, 4).map((article) => <Link className="kind-article" href={`/writing/${article.slug}`} key={article.slug}><span>{article.status === "historical" ? `Historical · ${article.type}` : article.type}</span><h3>{article.title}</h3><p>{article.description}</p><time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time></Link>)}</div>
      </section>

      <section className="now-exits" aria-labelledby="now-projects-title">
        <SectionHeading eyebrow="Current project map" title={`${projects.length} public projects with explicit maturity and boundaries.`} description="Open the project page for orientation; follow the repository for exact implementation, operation, release, or research authority." />
        <div className="now-exit-grid">{projects.map((project) => <article className={`kind-project status-${project.lifecycle}`} key={project.id}><span>{availabilityLabel[project.availability]}</span><h3>{project.title}</h3><p>{project.state}</p><Link href={`/projects/${project.slug}`}>Open project ↗</Link></article>)}</div>
      </section>

      <section className="now-timeline-section" aria-labelledby="now-questions-title">
        <SectionHeading eyebrow="Judgments selected for review" title="Questions carrying the current architectural and research pressure." description="This authored set highlights judgments that currently matter; date order does not decide importance." />
        <div className="now-timeline">{revisedQuestions.map((question) => <Link href={`/research/${question.slug}`} key={question.id}><div><span>{question.state}</span><time dateTime={question.updatedAt}>{question.updatedAt ? formatDate(question.updatedAt) : "Undated"}</time></div><h3>{question.title}</h3><p>{question.currentJudgment}</p></Link>)}</div>
      </section>

      <section className="now-discipline"><p className="section-index">Operating discipline</p><h2>Prefer observed use over speculative expansion.</h2><p>New abstractions begin with a concrete failure or recurring need. They remain only when another real trajectory proves that a simpler owner or mature system cannot carry the responsibility.</p><Link className="button primary" href="/research">Explore the research frontier <span aria-hidden="true">↗</span></Link></section>
    </div>
  );
}
