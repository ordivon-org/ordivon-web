import type { Metadata } from "next";
import Link from "next/link";
import { ResearchExplorer, type ResearchTimelineItem } from "@/components/research/research-explorer";
import { SectionHeading } from "@/components/section-heading";
import { siteUpdatedAt } from "@/content/model";
import { articles, formatDate, getArticle } from "@/lib/content";
import { getResearchDossier, getResearchQuestionSummaries } from "@/lib/research";
import { editorialSelections } from "@/content/editorial/selections";

export const metadata: Metadata = {
  title: "Research",
  description: "Start with the current question under test, the most recently answered boundary, and the experiment that most reduced the architecture before browsing the full research index.",
  alternates: { canonical: "/research" },
};

const evidence = [
  ["200", "source-locked historical trajectories through HD5"],
  ["60", "historical Deep Anchors through 1969"],
  ["156", "historical replay Provider calls through HD5"],
  [String(articles.length), "dated public arguments"],
] as const;

const method = [
  ["Question", "A bounded uncertainty whose answer can change structure, priority, or project scope."],
  ["Publication", "A dated complete argument that records evidence, limits, conclusions, and the next test."],
  ["Source", "The owning repository, receipt, release, or report that remains authoritative for exact technical facts."],
] as const;

export default function ResearchPage() {
  const questions = getResearchQuestionSummaries();
  const current = getResearchDossier(editorialSelections.research.currentQuestion);
  const answered = getResearchDossier(editorialSelections.research.recentlyAnswered);
  const changed = getResearchDossier("world-minimal-boundary");
  const changedArticle = getArticle(editorialSelections.research.architectureChangingExperiment);
  if (!current || !answered || !changed || !changedArticle) throw new Error("research editorial entry is incomplete");
  const timeline: ResearchTimelineItem[] = [...articles]
    .sort((left, right) => (right.revisedAt || right.publishedAt).localeCompare(left.revisedAt || left.publishedAt))
    .map((article) => ({ id: article.slug, date: article.revisedAt || article.publishedAt, displayDate: formatDate(article.revisedAt || article.publishedAt), type: article.type, title: article.title, summary: article.description, href: `/writing/${article.slug}` }));

  return (
    <div className="research-page">
      <header className="research-hero page-shell page-top">
        <div>
          <p className="eyebrow">Research · {formatDate(siteUpdatedAt)}</p>
          <h1>Research here exists to change what we build.</h1>
          <p>Each question is tied to a decision that another experiment can still overturn: keep a boundary, narrow it, move it to a mature system, or delete it.</p>
        </div>
        <dl aria-label="Research evidence summary">
          {evidence.map(([value, label]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>
      </header>

      <div className="page-shell research-main">
        <section className="research-start" aria-labelledby="research-start-title">
          <SectionHeading eyebrow="Start here" title="Three research results define the current frontier." description="Begin with the work that can still change the system, the boundary most recently answered, and the experiment that removed the most proposed machinery." />
          <div className="research-start-grid">
            <Link href={`/research/${current.question.slug}`} className="kind-question">
              <span>Most important question under test</span><h2 id="research-start-title">{current.question.title}</h2><p>{current.question.nextStep}</p><b>{current.articleCount} supporting publications ↗</b>
            </Link>
            <Link href={`/research/${answered.question.slug}`} className="kind-decision">
              <span>Recently answered boundary</span><h2>{answered.question.title}</h2><p>{answered.question.currentJudgment}</p><b>Read the accepted answer ↗</b>
            </Link>
            <Link href={`/writing/${changedArticle.slug}`} className="kind-experiment">
              <span>Experiment that most changed the architecture</span><h2>{changedArticle.title}</h2><p>{changed.question.currentJudgment}</p><b>{changedArticle.readMinutes} min research report ↗</b>
            </Link>
          </div>
        </section>

        <section className="research-explorer-section" aria-labelledby="research-explorer-title">
          <div className="research-editorial-intro"><p className="section-index">Full research index</p><h2 id="research-explorer-title">Browse every active, open, answered, and reframed question.</h2><p>Use the explorer after the current priorities are clear. It groups the same research by question, project, publication date, or status.</p></div>
          <ResearchExplorer questions={questions} timeline={timeline} />
        </section>

        <section className="research-method" aria-labelledby="research-method-title">
          <SectionHeading eyebrow="Research contract" title="Current judgments may change; dated evidence must not." description="Question summaries evolve as evidence accumulates. Publications preserve the complete argument at a date. Repositories, tests, releases, receipts, and observed behavior remain authoritative." />
          <div className="research-method-grid">
            {method.map(([label, description], index) => <article className={`kind-${label.toLowerCase()}`} key={label}><span>{String(index + 1).padStart(2, "0")}</span><h3>{label}</h3><p>{description}</p></article>)}
          </div>
        </section>
        <section className="research-system-link">
          <div><p className="section-index">System context</p><h2>Questions explain why the architecture is still moving.</h2></div>
          <p>Use the System page to follow one work trajectory through the current boundaries. Return here when the useful unit is the uncertainty that could cause a component to change or disappear.</p>
          <Link className="button primary" href="/system">Follow the work trajectory <span aria-hidden="true">↗</span></Link>
        </section>
      </div>
    </div>
  );
}
