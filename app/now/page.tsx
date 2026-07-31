import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { formatDate } from "@/lib/content";
import { getNodesByKind, getRecentEvents, graphUpdatedAt } from "@/lib/graph";
import { getResearchQuestionSummaries } from "@/lib/graph/research";
import type { GraphNode } from "@/lib/graph/types";

export const metadata: Metadata = {
  title: "Current",
  description: `The active Ordivon evidence frontier and recent structural changes as of ${formatDate(graphUpdatedAt)}.`,
  alternates: { canonical: "/now" },
};

function dateOf(node: GraphNode) {
  if (node.kind === "experiment" || node.kind === "finding" || node.kind === "decision" || node.kind === "article") return node.date;
  return node.updatedAt || graphUpdatedAt;
}

export default function NowPage() {
  const frontier = getResearchQuestionSummaries().filter((item) => item.question.state === "testing").slice(0, 6);
  const latestExperiment = [...getNodesByKind("experiment")].sort((a, b) => b.date.localeCompare(a.date))[0];
  const latestFinding = [...getNodesByKind("finding")].sort((a, b) => b.date.localeCompare(a.date))[0];
  const latestDecision = [...getNodesByKind("decision")].sort((a, b) => b.date.localeCompare(a.date))[0];
  const latestArticle = [...getNodesByKind("article")].sort((a, b) => b.date.localeCompare(a.date))[0];
  const signals = [latestExperiment, latestFinding, latestDecision, latestArticle].filter((node): node is NonNullable<typeof node> => Boolean(node));
  const exits = getNodesByKind("decision").filter((decision) => [
    "decision:no-task-runtime",
    "decision:no-context-kernel",
    "decision:no-custom-cyber-range",
    "decision:embedded-game-host",
    "decision:unify-world",
    "decision:thin-web-release",
  ].includes(decision.id));
  const events = getRecentEvents(5);

  return (
    <div className="page-shell page-top now-page">
      <header className="index-hero">
        <p className="eyebrow">Current · {formatDate(graphUpdatedAt)}</p>
        <h1>The frontier is what could still change the map.</h1>
        <p>
          This page is a dated evidence view, not a delivery forecast. It separates Questions under test, the latest
          admitted signals, and structures that evidence caused us to extract, merge, or delete.
        </p>
      </header>

      <section className="now-frontier" aria-labelledby="now-frontier-title">
        <SectionHeading
          eyebrow="Under test"
          title="Questions currently receiving real pressure."
          description="A Question remains on the frontier while an admitted experiment or workload can still change its judgment, project boundary, or next action."
        />
        <div className="now-frontier-grid">
          {frontier.map((item) => (
            <Link href={`/research/${item.question.slug}`} key={item.question.id}>
              <div><span>{item.project?.title || "Independent research"}</span><span>{item.evidenceCount} evidence objects</span></div>
              <h3>{item.question.title}</h3>
              <p>{item.question.currentJudgment}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="now-signals" aria-labelledby="now-signals-title">
        <SectionHeading
          eyebrow="Latest signals"
          title="The newest objects admitted as evidence or public record."
          description="Recency does not imply confidence. Each object keeps its own type, status, and date rather than being flattened into a generic update."
        />
        <div className="now-signal-grid">
          {signals.map((node) => (
            <article className={`kind-${node.kind}`} key={node.id}>
              <span>{node.kind}</span>
              <h3>{node.title}</h3>
              <p>{node.summary}</p>
              <time dateTime={dateOf(node)}>{formatDate(dateOf(node))}</time>
            </article>
          ))}
        </div>
      </section>

      <section className="now-exits" aria-labelledby="now-exits-title">
        <SectionHeading
          eyebrow="Structural exits"
          title="Progress includes removing boundaries that no longer earn themselves."
          description="These decisions changed repository ownership, reduced governance, or replaced a migration compromise. They remain visible because deletion is part of the research result."
        />
        <div className="now-exit-grid">
          {exits.map((decision) => (
            <article className="kind-decision" key={decision.id}>
              <span>decision</span>
              <h3>{decision.title}</h3>
              <p>{decision.rationale}</p>
              <time dateTime={decision.date}>{formatDate(decision.date)}</time>
            </article>
          ))}
        </div>
      </section>

      <section className="now-timeline-section" aria-labelledby="now-timeline-title">
        <SectionHeading
          eyebrow="Change ledger"
          title="What changed the working model."
          description="Events are short dated records. Their connected Questions and evidence objects carry the longer argument."
        />
        <div className="now-timeline">
          {events.map((event) => (
            <article key={event.id}>
              <div><span>{event.type}</span><time dateTime={event.date}>{formatDate(event.date)}</time></div>
              <h3>{event.title}</h3>
              <p>{event.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="now-discipline">
        <p className="section-index">Current discipline</p>
        <h2>Prefer observed use over speculative expansion.</h2>
        <p>
          New abstractions begin with a concrete failure, missing explanation, or recurring need. The Research atlas keeps
          each uncertainty public without pretending that every Question has already earned an experiment or conclusion.
        </p>
        <Link className="button primary" href="/research">Explore the Research atlas <span aria-hidden="true">↗</span></Link>
      </section>
    </div>
  );
}
