import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleToc } from "@/components/article-toc";
import { ReadingProgress } from "@/components/reading-progress";
import { articles, formatDate, getArticle } from "@/lib/content";

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
  if (!article) notFound();
  const Content = article.Content;
  const index = articles.findIndex((item) => item.slug === article.slug);
  const previous = articles[index + 1];
  const next = articles[index - 1];
  const schema = { "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.description, datePublished: article.date, author: { "@type": "Person", name: article.author }, publisher: { "@type": "Organization", name: "Ordivon" }, mainEntityOfPage: `https://ordivon.com/writing/${article.slug}` };
  return (
    <article className={`article-page article-${article.slug}`} id="top">
      <ReadingProgress />
      <header className="article-hero page-shell page-top">
        <div className="article-kicker"><span>{article.type}</span><span>{article.project}</span></div>
        <h1>{article.title}</h1><p className="article-deck">{article.deck}</p>
        <div className="article-meta"><span>By {article.author}</span><time dateTime={article.date}>{formatDate(article.date)}</time><span>{article.readMinutes} min read</span></div>
      </header>
      <div className="article-layout page-shell">
        <ArticleToc entries={article.toc} />
        <div className="article-column">
          <p className="article-lead">{article.lead}</p>
          <div className="article-body"><Content /></div>
        </div>
      </div>
      <aside className="related-reading page-shell"><p className="section-index">Related reading</p><h2>{article.relatedHeading || "Continue through the system."}</h2><div>{article.related.map((item) => <Link href={item.href} key={`${item.href}-${item.title}`}>{item.title}<span>↗</span></Link>)}</div></aside>
      <nav className="article-pagination page-shell" aria-label="Adjacent articles">
        {previous ? <Link href={`/writing/${previous.slug}`}><span>Previous</span><strong>{previous.title}</strong></Link> : <span />}
        {next ? <Link href={`/writing/${next.slug}`}><span>Next</span><strong>{next.title}</strong></Link> : <span />}
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </article>
  );
}
