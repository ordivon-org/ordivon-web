import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { SystemMap } from "@/components/system-map";
import { articles, formatDate } from "@/lib/content";
import { getNodesByKind, getRecentEvents, graphRelations, graphUpdatedAt } from "@/lib/graph";
import { getResearchQuestionSummaries } from "@/lib/graph/research";
import { getFeaturedWriting } from "@/lib/graph/writing";
import { projects } from "@/lib/projects";

export default function HomePage() {
  const research = getResearchQuestionSummaries();
  const testing = research
    .filter((item) => item.question.state === "testing")
    .sort((left, right) => right.evidenceCount - left.evidenceCount || (right.latestEvidenceDate || "").localeCompare(left.latestEvidenceDate || ""));
  const frontier = testing[0] || research[0];
  const featured = getFeaturedWriting(3).map((argument) => {
    const article = articles.find((candidate) => candidate.slug === argument.article.slug);
    if (!article) throw new Error(`missing content article ${argument.article.slug}`);
    return { article, argument };
  });
  const evidenceCount = getNodesByKind("experiment").length + getNodesByKind("finding").length + getNodesByKind("decision").length;
  const documentRelationCount = graphRelations.filter((relation) => relation.type === "documents").length;
  const latestEvent = getRecentEvents(1)[0];
  const currentMetrics = frontier ? [
    { value: String(frontier.evidenceCount), label: "admitted evidence objects" },
    { value: String(frontier.articleCount), label: "connected public records" },
    { value: frontier.question.state.toUpperCase(), label: "question state" },
    { value: frontier.project?.title.replace("Ordivon ", "") || "ORDIVON", label: "current project line" },
  ] : [];

  return (
    <>
      <section className="home-hero page-shell">
        <div className="hero-copy">
          <p className="eyebrow"><span>Independent research + engineering</span><b>{formatDate(graphUpdatedAt)}</b></p>
          <h1>Agents should outlive the sessions that think for them.</h1>
          <p className="hero-lede">Ordivon builds the layers that let capable agents continue work, commit actions, reconcile external interactions, preserve evidence, and change models without starting over.</p>
          <div className="actions"><Link className="button primary" href="/system">Explore the system</Link><Link className="button text" href="/research">Inspect the frontier <span>↗</span></Link></div>
        </div>
        <div className="hero-proof" aria-label="Current graph status">
          <div className="proof-label"><span>Graph-derived snapshot</span><time dateTime={graphUpdatedAt}>{formatDate(graphUpdatedAt)}</time></div>
          <dl>
            <div><dt>State owners</dt><dd>{getNodesByKind("system").length} independent system layers</dd></div>
            <div><dt>Research frontier</dt><dd>{research.length} Questions · {testing.length} currently under test</dd></div>
            <div><dt>Admitted evidence</dt><dd>{evidenceCount} experiments, findings, and decisions</dd></div>
            <div><dt>Public argument</dt><dd>{articles.length} articles · {documentRelationCount} typed document relations</dd></div>
          </dl>
        </div>
      </section>

      <section className="map-section page-shell">
        <SectionHeading index="01" eyebrow="The system" title="One graph. Four independent state owners." description="Ordivon is not a monolithic agent framework. Each project owns facts that the others must not fabricate." />
        <SystemMap />
      </section>

      <section className="failure-section page-shell">
        <SectionHeading index="02" eyebrow="Why it exists" title="Intelligence is cheap to restart. Consequences are not." description="A strong model can reconstruct a plan. It cannot safely infer what crossed into reality while it was gone." />
        <div className="failure-grid">
          {[
            ["Session ends", "The Goal remains, but the model no longer owns the Task state."],
            ["Response disappears", "The caller cannot know whether the operation committed or only timed out."],
            ["Path changes", "The endpoint still matters even when the route, identity, or carrier changes."],
            ["Evidence fragments", "A later agent cannot continue when source, output, and receipts are separated."],
          ].map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="project-preview page-shell">
        <SectionHeading index="03" eyebrow="Maintained projects" title="Different layers earn different boundaries." description="The repositories share a thesis, not a database. Their source, tests, receipts, and current documents remain canonical." />
        <div className="project-preview-list">
          {projects.map((project) => (
            <Link href={`/projects/${project.slug}`} className="project-preview-row" key={project.slug}>
              <span>{project.index}</span><div><p>{project.group}</p><h3>{project.title}</h3></div><strong>{project.label}</strong><b aria-hidden="true">↗</b>
            </Link>
          ))}
        </div>
      </section>

      {frontier && (
        <section className="current-feature page-shell">
          <div className="current-copy">
            <p className="section-index">Current frontier · {frontier.project?.title || "Ordivon"}</p>
            <h2>{frontier.question.title}</h2>
            <p>{frontier.question.currentJudgment}</p>
            <Link className="text-link" href={`/research/${frontier.question.slug}`}>Open the Question dossier <span>↗</span></Link>
          </div>
          <div className="current-metrics">
            {currentMetrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}
          </div>
        </section>
      )}

      <section className="writing-preview page-shell">
        <SectionHeading index="04" eyebrow="Writing network" title="Arguments are selected by connection, not recency alone." description="The featured positions are the most connected articles in the current graph. Their rank changes when Questions, findings, decisions, or project boundaries change." />
        <div className="featured-writing">
          {featured.map(({ article, argument }, index) => (
            <Link href={`/writing/${article.slug}`} key={article.slug} className={index === 0 ? "featured-article lead" : "featured-article"}>
              <div><span>{article.type} · {argument.anchors.length} anchors</span><time dateTime={article.date}>{formatDate(article.date)}</time></div><h3>{article.title}</h3><p>{article.description}</p><b>{article.readMinutes} min · centrality {argument.centrality} ↗</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="closing-statement page-shell">
        <p>{latestEvent ? `Latest model change · ${latestEvent.title}` : "Ordivon is built around one operational belief."}</p>
        <h2>Move faster by making failure local, evidence durable, and cognition replaceable.</h2>
        <div className="actions"><Link className="button primary inverse" href="/writing">Explore the argument network</Link><a className="button text inverse" href="https://github.com/zycxfyh">Inspect the repositories ↗</a></div>
      </section>
    </>
  );
}
