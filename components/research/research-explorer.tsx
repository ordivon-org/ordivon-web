"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import type { ResearchQuestionSummary } from "@/lib/research";

export type ResearchTimelineItem = {
  id: string;
  date: string;
  displayDate: string;
  type: string;
  title: string;
  summary: string;
  href?: string;
};

type ResearchView = "questions" | "projects" | "timeline" | "status";

const subscribeToHydration = () => () => undefined;

function QuestionCard({ item, index }: { item: ResearchQuestionSummary; index: number }) {
  const { question, project } = item;
  return (
    <Link className={`research-question-card kind-question status-${question.status}`} href={`/research/${question.slug}`}>
      <div className="research-question-meta">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <b>{project?.title || "Independent research"}</b>
        <i>{question.state}</i>
      </div>
      <h3>{question.title}</h3>
      <p>{question.summary}</p>
      <div className="research-question-judgment">
        <span>Current judgment</span>
        <strong>{question.currentJudgment}</strong>
      </div>
      <footer>
        <span>{item.articleCount} supporting publications</span>
        <span>{item.latestPublicationDate || question.updatedAt || "Unpublished"}</span>
        <b aria-hidden="true">↗</b>
      </footer>
    </Link>
  );
}

export function ResearchExplorer({ questions, timeline }: { questions: ResearchQuestionSummary[]; timeline: ResearchTimelineItem[] }) {
  const ready = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const [view, setView] = useState<ResearchView>("questions");
  const projectGroups = useMemo(() => {
    const groups = new Map<string, ResearchQuestionSummary[]>();
    for (const item of questions) {
      const key = item.project?.title || "Independent research";
      groups.set(key, [...(groups.get(key) || []), item]);
    }
    return [...groups.entries()];
  }, [questions]);
  const stateGroups = useMemo(() => {
    const order: ResearchQuestionSummary["question"]["state"][] = ["testing", "open", "reframed", "answered"];
    return order.map((state) => [state, questions.filter((item) => item.question.state === state)] as const).filter(([, items]) => items.length);
  }, [questions]);

  const views: { id: ResearchView; label: string; detail: string }[] = [
    { id: "questions", label: "Questions", detail: "the active frontier" },
    { id: "projects", label: "Projects", detail: "where pressure accumulates" },
    { id: "timeline", label: "Publications", detail: "dated complete arguments" },
    { id: "status", label: "Status", detail: "testing, open, resolved" },
  ];

  return (
    <section className="research-explorer" aria-labelledby="research-explorer-title" aria-busy={!ready} data-ready={ready ? "true" : "false"}>
      <div className="research-explorer-head">
        <div>
          <p>Research atlas</p>
          <h2 id="research-explorer-title">The same work, organized by the question you need to answer.</h2>
        </div>
        <div className="research-view-switcher" role="group" aria-label="Research view">
          {views.map((item) => (
            <button type="button" key={item.id} aria-pressed={view === item.id} onClick={() => setView(item.id)}>
              <span>{item.label}</span>
              <small>{item.detail}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="research-explorer-content">
        {view === "questions" && (
          <div className="research-question-grid" data-view="questions">
            {questions.map((item, index) => <QuestionCard item={item} index={index} key={item.question.id} />)}
          </div>
        )}

        {view === "projects" && (
          <div className="research-project-groups" data-view="projects">
            {projectGroups.map(([project, items]) => (
              <section key={project}>
                <header><span>{String(items.length).padStart(2, "0")}</span><h3>{project}</h3></header>
                <div>{items.map((item, index) => <QuestionCard item={item} index={index} key={item.question.id} />)}</div>
              </section>
            ))}
          </div>
        )}

        {view === "timeline" && (
          <div className="research-timeline" data-view="timeline">
            {timeline.map((event, index) => {
              const content = (
                <>
                  <div><span>{String(index + 1).padStart(2, "0")}</span><time dateTime={event.date}>{event.displayDate}</time><i>{event.type}</i></div>
                  <h3>{event.title}</h3>
                  <p>{event.summary}</p>
                  {event.href && <b>Open publication ↗</b>}
                </>
              );
              return event.href
                ? <Link href={event.href} key={event.id}>{content}</Link>
                : <article key={event.id}>{content}</article>;
            })}
          </div>
        )}

        {view === "status" && (
          <div className="research-status-board" data-view="status">
            {stateGroups.map(([state, items]) => (
              <section key={state}>
                <header><span>{state}</span><b>{items.length}</b></header>
                <div>
                  {items.map((item) => (
                    <Link href={`/research/${item.question.slug}`} key={item.question.id}>
                      <span>{item.project?.title || "Independent"}</span>
                      <h3>{item.question.title}</h3>
                      <p>{item.question.currentJudgment}</p>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
