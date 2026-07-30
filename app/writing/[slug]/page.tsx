import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleToc } from "@/components/article-toc";
import { ReadingProgress } from "@/components/reading-progress";
import { articles, formatDate, getArticle } from "@/lib/content";
import { getWritingArgument } from "@/lib/graph/writing";

export const dynamicParams = false;
export function generateStaticParams() { return articles.map((article) => ({ slug: article.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/writing/${article.slug}` },
    openGraph: { type: "article", title: article.title, description: article.description, publishedTime: article.date, authors: [article.author], images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Ordivon — persistent work for capable agents" }] },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  const argument = getWritingArgument(slug);
  if (!article || !argument) notFound();
  const Content = article.Content;
  const index = articles.findIndex((item) => item.slug === article.slug);
  const previous = articles[index + 1];
  const next = articles[index - 1];
  const related = argument.related.slice(0, 3);
  const schema = { "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.description, datePublished: article.date, author: { "@type": "Person", name: article.author }, publisher: { "@type": "Organization", name: "Ordivon" }, mainEntityOfPage: `https://ordivon.com/writing/${article.slug}` };
  return (
    <article className={`article-page article-${article.slug}`} id="top">
      <ReadingProgress />
      <header className="article-hero page-shell page-top">
        <div className="article-kicker"><span>{article.type}</span><span>{article.project}</span></div>
        <h1>{article.title}</h1><p className="article-deck">{article.deck}</p>
        <div className="article-meta"><span>By {article.author}</span><time dateTime={article.date}>{formatDate(article.date)}</time><span>{article.readMinutes} min read</span><span>{argument.anchors.length} graph anchors</span></div>
      </header>
      <div className="article-layout page-shell">
        <ArticleToc entries={article.toc} />
        <div className="article-column">
          <p className="article-lead">{article.lead}</p>
          <div className="article-body"><Content /></div>
        </div>
      </div>

      <aside className="article-argument-context page-shell" aria-labelledby="argument-context-title">
        <div className="article-argument-intro">
          <p className="section-index">Argument position</p>
          <h2 id="argument-context-title">What this article documents in the research graph.</h2>
          <p>These connections are derived from typed relations. They replace the former hand-maintained related-reading list.</p>
        </div>
        <div className="article-anchor-grid">
          {argument.anchors.map((anchor) => anchor.href
            ? <Link className={`kind-${anchor.kind}`} href={anchor.href} key={anchor.id}><span>{anchor.kind}</span><h3>{anchor.title}</h3><p>{anchor.summary}</p><b>Open object ↗</b></Link>
            : <article className={`kind-${anchor.kind}`} key={anchor.id}><span>{anchor.kind}</span><h3>{anchor.title}</h3><p>{anchor.summary}</p><b>Graph evidence</b></article>)}
        </div>
      </aside>

      <aside className="related-reading page-shell">
        <p className="section-index">Nearest arguments</p>
        <h2>Continue through shared research objects.</h2>
        <div>
          {related.map((connection) => (
            <Link href={`/writing/${connection.article.slug}`} key={connection.article.id}>
              <span>{connection.sharedAnchors.map((anchor) => anchor.title).join(" · ")}</span>
              <strong>{connection.article.title}</strong>
              <b>score {connection.score} ↗</b>
            </Link>
          ))}
        </div>
      </aside>

      <nav className="article-pagination page-shell" aria-label="Adjacent articles by publication date">
        {previous ? <Link href={`/writing/${previous.slug}`}><span>Earlier publication</span><strong>{previous.title}</strong></Link> : <span />}
        {next ? <Link href={`/writing/${next.slug}`}><span>Later publication</span><strong>{next.title}</strong></Link> : <span />}
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </article>
  );
}
