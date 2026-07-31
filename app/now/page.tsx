import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { formatDate } from "@/lib/content";
import { getResearchQuestionSummaries } from "@/lib/research";
import { currentUpdatedAt, getCurrentProjects, getRecentPublications, getRecentlyUpdatedQuestions } from "@/lib/updates";

export const metadata: Metadata = {
  title: "Now",
  description: `An authored summary of what changed across Ordivon, what evidence changed the architecture, what was removed, and what is being tested next as of ${formatDate(currentUpdatedAt)}.`,
  alternates: { canonical: "/now" },
};

const authoredSummary = [
  {
    label: "What changed",
    title: "The harness boundary closed around replacement, not uniformity.",
    body: "Codex and Hermes completed one repository task in both replacement orders. The durable Host-owned assignment, run receipt, generation fence, and completion admission survived; a shared provider lifecycle did not.",
  },
  {
    label: "What we learned",
    title: "Strong baselines made the proposed core smaller.",
    body: "LangGraph, Temporal, current-revision retrieval, idempotency, durable activities, and provider-native harnesses carried more of the workload than an Ordivon-specific platform needed to own.",
  },
  {
    label: "What we removed",
    title: "Duplicate structure lost its claim to permanence.",
    body: "Link and Edge were retired as separate projects and unified into World. Game deleted thirteen duplicate truth tables. Security retained its experiment method without promoting a campaign engine or strategic ontology.",
  },
  {
    label: "What comes next",
    title: "The next work is narrower and easier to falsify.",
    body: "Build the smallest Ordivon Harness for bare model APIs, run World W1 against direct Host integration, test a broader repository goal, and measure when an agent should act, wait, reconcile, or ask.",
  },
] as const;

export default function NowPage() {
  const frontier = getResearchQuestionSummaries().filter((item) => item.question.state === "testing").slice(0, 6);
  const publications = getRecentPublications(8);
  const projects = getCurrentProjects();
  const revisedQuestions = getRecentlyUpdatedQuestions(6);

  return (
    <div className="page-shell page-top now-page">
      <header className="index-hero now-hero">
        <p className="eyebrow">Now · {formatDate(currentUpdatedAt)}</p>
        <h1>What changed, what we learned, what we removed, and what we are testing now.</h1>
        <p>This is the current editorial judgment across Ordivon. Generated project, publication, and research views follow below as evidence and navigation—not as a substitute for the synthesis.</p>
      </header>

      <section className="now-brief" aria-labelledby="now-brief-title">
        <div className="now-brief-intro"><p className="section-index">Current synthesis</p><h2 id="now-brief-title">The system became smaller where evidence was strong and more explicit where uncertainty remained.</h2></div>
        <div className="now-brief-grid">
          {authoredSummary.map((item, index) => (
            <article key={item.label}><span>{String(index + 1).padStart(2, "0")} / {item.label}</span><h3>{item.title}</h3><p>{item.body}</p></article>
          ))}
        </div>
      </section>

      <section className="now-frontier" aria-labelledby="now-frontier-title">
        <SectionHeading eyebrow="Under real pressure" title="The next experiments that could still change the system." description="These questions remain active because another workload, failure, or comparison could move a boundary, delete a component, or change the next investment." />
        <div className="now-frontier-grid">
          {frontier.map((item) => (
            <Link href={`/research/${item.question.slug}`} key={item.question.id}>
              <div><span>{item.project?.title || "Independent research"}</span><span>{item.articleCount} supporting publications</span></div>
              <h3>{item.question.title}</h3><p>{item.question.nextStep}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="now-signals" aria-labelledby="now-signals-title">
        <SectionHeading eyebrow="Evidence behind the changes" title="Read the arguments and reports that changed the judgment." description="The most recent publication is not automatically the most important change. These dated articles preserve the evidence, limitations, and reasoning behind current decisions." />
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
        <SectionHeading eyebrow="Current project boundaries" title="What is tested, experimental, or still waiting for proof." description="Project pages explain the current capability and boundary. Repositories retain implementation truth, tests, receipts, and release identity." />
        <div className="now-exit-grid">
          {projects.map((project) => (
            <article className={`kind-project status-${project.status}`} key={project.id}>
              <span>{project.status}</span><h3>{project.title}</h3><p>{project.state}</p>
              <Link href={`/projects/${project.slug}`}>Open project boundary ↗</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="now-timeline-section" aria-labelledby="now-questions-title">
        <SectionHeading eyebrow="Recently revised judgments" title="Questions whose current answer changed." description="Each research page states the present judgment, the next decisive test, and what evidence would make the current boundary unnecessary." />
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
        <p className="section-index">Operating discipline</p><h2>Prefer observed use over speculative expansion.</h2>
        <p>New abstractions begin with a concrete failure, missing explanation, or recurring need. They remain only when another real trajectory proves that a simpler owner or mature system cannot carry the responsibility.</p>
        <Link className="button primary" href="/research">Explore the research frontier <span aria-hidden="true">↗</span></Link>
      </section>
    </div>
  );
}
