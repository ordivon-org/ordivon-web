import Link from "next/link";
import type { ArticleMetadata } from "@/content/articles/schema";
import { claimLabels, evidenceLabels } from "@/lib/publication";

export function PublicationBrief({ article }: { article: ArticleMetadata }) {
  return (
    <aside className="publication-brief" aria-labelledby="publication-brief-title">
      <div className="publication-brief-status">
        <span>{article.status}</span>
        <span>{claimLabels[article.claimClass]}</span>
        <span>{article.evidenceLevel} · {evidenceLabels[article.evidenceLevel]}</span>
        <details className="publication-label-decoder">
          <summary>How to read these labels</summary>
          <dl>
            <div><dt>Status</dt><dd>Whether this dated publication is current, revised, superseded, or historical.</dd></div>
            <div><dt>Claim class</dt><dd>What kind of statement is being made; an observation, experiment, inference, decision, thesis, forecast, or aspiration.</dd></div>
            <div><dt>Evidence</dt><dd>E0 assertion · E1 reasoned argument · E2 observed dogfood · E3 bounded experiment · E4 reproducible engineering evidence · E5 external replication or sustained operation.</dd></div>
          </dl>
          <p>E2 may honestly rely on owner-retained primary records that are not public. It is a different evidence boundary, not a failed E4.</p>
        </details>
      </div>
      <div className="publication-brief-copy">
        <p className="section-index">Publication brief</p>
        <h2 id="publication-brief-title">What to retain from this argument.</h2>
        <ol>{article.takeaways.map((item) => <li key={item}>{item}</li>)}</ol>
      </div>
      <details className="publication-limitations">
        <summary>Scope and limitations</summary>
        <ul>{article.limitations.map((item) => <li key={item}>{item}</li>)}</ul>
        {article.canonicalResearchRecord && <Link href={article.canonicalResearchRecord}>Open the canonical research record ↗</Link>}
      </details>
    </aside>
  );
}

export function PublicationStatusNotice({ article, replacementTitle }: { article: ArticleMetadata; replacementTitle?: string }) {
  if (article.status === "current") return null;
  const label = article.status === "historical" ? "Historical publication" : article.status === "superseded" ? "Superseded publication" : "Revised publication";
  return <aside className={`publication-status-notice status-${article.status}`}><strong>{label}</strong><p>{article.status === "historical" ? "This page preserves a dated release or judgment. Current project pages may describe later capability without rewriting what was true here." : replacementTitle ? `A later publication now carries the current judgment: ${replacementTitle}.` : "This article remains dated; substantive changes are recorded rather than silently replacing the original argument."}</p></aside>;
}
