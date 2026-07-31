import type { Metadata } from "next";
import Link from "next/link";
import { ResearchExplorer, type ResearchTimelineItem } from "@/components/research/research-explorer";
import { SectionHeading } from "@/components/section-heading";
import { siteUpdatedAt } from "@/content/model";
import { articles, formatDate } from "@/lib/content";
import { getResearchQuestionSummaries } from "@/lib/research";

export const metadata: Metadata = {
  title: "Research",
  description: "Follow the questions and experiments changing Ordivon, including what was proved, rejected, reduced, or left open.",
  alternates: { canonical: "/research" },
};

const method = [
  ["Question", "A bounded uncertainty whose answer can change structure, priority, or project scope."],
  ["Publication", "A dated complete argument that records evidence, limits, conclusions, and the next test."],
  ["Source", "The owning repository, receipt, release, or report that remains authoritative for exact technical facts."],
] as const;

export default function ResearchPage() {
  const questions = getResearchQuestionSummaries();
  const testing = questions.filter((item) => item.question.state === "testing").length;
  const published = questions.filter((item) => item.articleCount > 0).length;
  const projects = new Set(questions.map((item) => item.project?.id).filter(Boolean)).size;
  const timeline: ResearchTimelineItem[] = [...articles]
    .sort((left, right) => (right.modifiedDate || right.date).localeCompare(left.modifiedDate || left.date))
    .map((article) => ({ id: article.slug, date: article.modifiedDate || article.date, displayDate: formatDate(article.modifiedDate || article.date), type: article.type, title: article.title, summary: article.description, href: `/writing/${article.slug}` }));

  return (
    <div className="research-page">
      <header className="research-hero page-shell page-top">
        <div>
          <p className="eyebrow">Research · {formatDate(siteUpdatedAt)}</p>
          <h1>Questions are the durable unit of unfinished work.</h1>
          <p>Each dossier states the present hypothesis, current judgment, next test, deletion condition, and supporting publications. Articles carry the complete public argument; repositories retain exact evidence.</p>
        </div>
        <dl aria-label="Research index summary">
          <div><dt>Question dossiers</dt><dd>{questions.length}</dd></div>
          <div><dt>Under test</dt><dd>{testing}</dd></div>
          <div><dt>With publications</dt><dd>{published}</dd></div>
          <div><dt>Project lines</dt><dd>{projects}</dd></div>
        </dl>
      </header>

      <div className="page-shell research-main">
        <ResearchExplorer questions={questions} timeline={timeline} />
        <section className="research-method" aria-labelledby="research-method-title">
          <SectionHeading eyebrow="Research contract" title="The site organizes claims; it does not replace their sources." description="Question metadata may change as evidence accumulates. Published arguments remain dated. Repositories, tests, releases, receipts, and observed behavior remain authoritative." />
          <div className="research-method-grid">
            {method.map(([label, description], index) => (
              <article className={`kind-${label.toLowerCase()}`} key={label}><span>{String(index + 1).padStart(2, "0")}</span><h3>{label}</h3><p>{description}</p></article>
            ))}
          </div>
        </section>
        <section className="research-system-link">
          <div><p className="section-index">System context</p><h2>Questions explain why the architecture is still moving.</h2></div>
          <p>Use the System explorer for curated ownership and execution views. Return here when the useful unit is the uncertainty that could cause a component to change or disappear.</p>
          <Link className="button primary" href="/system">Open System explorer <span aria-hidden="true">↗</span></Link>
        </section>
      </div>
    </div>
  );
}
