import type { Metadata } from "next";
import { formatDate } from "@/lib/content";
import { getActiveQuestions, getProjectForQuestion, getRecentEvents, graphUpdatedAt } from "@/lib/graph";

export const metadata: Metadata = {
  title: "Current",
  description: `The active Ordivon questions and recent structural changes as of ${formatDate(graphUpdatedAt)}.`,
  alternates: { canonical: "/now" },
};

export default function NowPage() {
  const questions = getActiveQuestions().filter((question) => question.state === "testing").slice(0, 6);
  const events = getRecentEvents(6);

  return (
    <div className="page-shell page-top now-page">
      <header className="index-hero">
        <p className="eyebrow">Current · {formatDate(graphUpdatedAt)}</p>
        <h1>The next useful result may be a capability, a deletion, or a changed boundary.</h1>
        <p>This is an evidence frontier, not a promise of dates. Priorities move when implementation and repeated use change the underlying model.</p>
      </header>

      <section className="now-list" aria-label="Active research questions">
        {questions.map((question, index) => {
          const project = getProjectForQuestion(question.id);
          const href = project?.publicPage ? `/projects/${project.slug}` : project?.repository || "/projects";
          return (
            <a href={href} key={question.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <p>{project?.title || "Ordivon"} · {question.state}</p>
                <h2>{question.title}</h2>
                <strong>{question.summary}</strong>
              </div>
              <b aria-hidden="true">↗</b>
            </a>
          );
        })}
      </section>

      <section className="now-events" aria-labelledby="recent-events-title">
        <div>
          <p className="section-index">Recent changes</p>
          <h2 id="recent-events-title">What changed the model.</h2>
        </div>
        <div className="now-event-list">
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
        <p>New abstractions should begin with a concrete failure, missing explanation, or recurring need. Until then, the preferred moves are to use mature systems, improve the public explanation, remove stale structure, and keep uncertainty explicit.</p>
      </section>
    </div>
  );
}
