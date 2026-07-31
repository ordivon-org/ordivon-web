import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { formatDate } from "@/lib/content";
import { getResearchQuestionSummaries } from "@/lib/research";
import { currentUpdatedAt, getCurrentProjects, getRecentPublications, getRecentlyUpdatedQuestions } from "@/lib/updates";

export const metadata: Metadata = {
  title: "Current",
  description: `The active Ordivon research frontier and recent public record as of ${formatDate(currentUpdatedAt)}.`,
  alternates: { canonical: "/now" },
};

export default function NowPage() {
  const frontier = getResearchQuestionSummaries().filter((item) => item.question.state === "testing").slice(0, 6);
  const publications = getRecentPublications(8);
  const projects = getCurrentProjects();
  const revisedQuestions = getRecentlyUpdatedQuestions(6);

  return (
    <div className="page-shell page-top now-page">
      <header className="index-hero">
        <p className="eyebrow">Current · {formatDate(currentUpdatedAt)}</p>
        <h1>The frontier is what could still change the map.</h1>
        <p>This page is derived from active Questions, current Project boundaries, and dated publications. It does not maintain a second event ledger beside the work itself.</p>
      </header>

      <section className="now-frontier" aria-labelledby="now-frontier-title">
        <SectionHeading eyebrow="Under test" title="Questions currently receiving real pressure." description="A Question remains active while another workload or experiment can still change its judgment, project boundary, or next action." />
        <div className="now-frontier-grid">
          {frontier.map((item) => (
            <Link href={`/research/${item.question.slug}`} key={item.question.id}>
              <div><span>{item.project?.title || "Independent research"}</span><span>{item.articleCount} publications</span></div>
              <h3>{item.question.title}</h3><p>{item.question.currentJudgment}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="now-signals" aria-labelledby="now-signals-title">
        <SectionHeading eyebrow="Recent publications" title="The newest complete public arguments." description="Major research, engineering, release, and design claims are preserved as dated articles with explicit evidence links and limits." />
        <div className="now-signal-grid">
          {publications.slice(0, 4).map((article) => (
            <Link className="kind-article" href={`/writing/${article.slug}`} key={article.slug}>
              <span>{article.type}</span><h3>{article.title}</h3><p>{article.description}</p>
              <time dateTime={article.date}>{formatDate(article.date)}</time>
            </Link>
          ))}
        </div>
      </section>

      <section className="now-exits" aria-labelledby="now-projects-title">
        <SectionHeading eyebrow="Current boundaries" title="What each public project owns now." description="Project pages state the current boundary. Repositories retain implementation truth, tests, receipts, and release identity." />
        <div className="now-exit-grid">
          {projects.map((project) => (
            <article className={`kind-project status-${project.status}`} key={project.id}>
              <span>{project.status}</span><h3>{project.title}</h3><p>{project.state}</p>
              <Link href={`/projects/${project.slug}`}>Open current project ↗</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="now-timeline-section" aria-labelledby="now-questions-title">
        <SectionHeading eyebrow="Judgment updates" title="Recently revised Question dossiers." description="The dossier carries current judgment and the next falsifier. Supporting publications carry the full evidence and argument." />
        <div className="now-timeline">
          {revisedQuestions.map((question) => (
            <Link href={`/research/${question.slug}`} key={question.id}>
              <div><span>{question.state}</span><time dateTime={question.updatedAt}>{question.updatedAt ? formatDate(question.updatedAt) : "Undated"}</time></div>
              <h3>{question.title}</h3><p>{question.currentJudgment}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="now-discipline">
        <p className="section-index">Current discipline</p><h2>Prefer observed use over speculative expansion.</h2>
        <p>New abstractions begin with a concrete failure, missing explanation, or recurring need. The public model stays small: Projects, Questions, and Articles.</p>
        <Link className="button primary" href="/research">Explore the Research index <span aria-hidden="true">↗</span></Link>
      </section>
    </div>
  );
}
