"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type WritingSummary = { slug: string; title: string; description: string; type: string; project: string; date: string; readMinutes: number };

export function WritingFilter({ articles }: { articles: WritingSummary[] }) {
  const types = ["All", ...new Set(articles.map((article) => article.type))];
  const [active, setActive] = useState("All");
  const filtered = useMemo(() => active === "All" ? articles : articles.filter((article) => article.type === active), [active, articles]);
  return (
    <section className="writing-browser" aria-label="Writing archive">
      <div className="filter-row" role="group" aria-label="Filter writing by type">
        {types.map((type) => <button className={active === type ? "active" : ""} key={type} onClick={() => setActive(type)}>{type}</button>)}
      </div>
      <div className="writing-list">
        {filtered.map((article, index) => (
          <Link className="writing-row" href={`/writing/${article.slug}`} key={article.slug}>
            <span className="writing-number">{String(index + 1).padStart(2, "0")}</span>
            <div className="writing-copy"><p>{article.type} · {article.project}</p><h2>{article.title}</h2><span>{article.description}</span></div>
            <div className="writing-meta"><time dateTime={article.date}>{article.date}</time><span>{article.readMinutes} min</span><b aria-hidden="true">↗</b></div>
          </Link>
        ))}
      </div>
    </section>
  );
}
