"use client";

import { useState } from "react";

type Boundary = { label: string; detail: string };

export function DecisionComparison({ before, after }: { before: Boundary[]; after: Boundary }) {
  const [view, setView] = useState<"before" | "after">("after");
  const active = view === "before" ? before : [after];

  return (
    <section className="decision-comparison" aria-label="Architecture decision comparison">
      <div className="decision-comparison-head">
        <p>Boundary decision</p>
        <div role="group" aria-label="Compare repository boundaries">
          <button type="button" className={view === "before" ? "active" : ""} onClick={() => setView("before")}>Before</button>
          <button type="button" className={view === "after" ? "active" : ""} onClick={() => setView("after")}>Current</button>
        </div>
      </div>
      <div className={`decision-comparison-model ${view}`}>
        {active.map((item) => (
          <article key={item.label}>
            <span>{view === "before" ? "Independent repository" : "Unified research object"}</span>
            <strong>{item.label}</strong>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
      <p className="decision-comparison-note">
        {view === "before"
          ? "The split isolated useful mechanisms but forced one external interaction across two project boundaries."
          : "Connectivity and external action remain distinct internal planes, while continuity is modeled where they meet."}
      </p>
    </section>
  );
}
