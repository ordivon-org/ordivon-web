import type { TocEntry } from "@/lib/content";

export function ArticleToc({ entries }: { entries: readonly TocEntry[] }) {
  return (
    <>
      <aside className="article-rail" aria-label="Article sections">
        <p>In this article</p>
        <ol>{entries.map((entry) => <li key={entry.id}><a href={`#${entry.id}`}>{entry.label}</a></li>)}</ol>
      </aside>
      <details className="article-toc-mobile">
        <summary>In this article <span>{entries.length} sections</span></summary>
        <ol>{entries.map((entry) => <li key={entry.id}><a href={`#${entry.id}`}>{entry.label}</a></li>)}</ol>
      </details>
    </>
  );
}
