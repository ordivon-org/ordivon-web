import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleToc } from "@/components/article-toc";
import { ReadingProgress } from "@/components/reading-progress";
import { PublicationBrief, PublicationStatusNotice } from "@/components/publication-brief";
import { articles, formatDate, getArticle } from "@/lib/content";
import { getArticleContext } from "@/lib/writing";

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
    openGraph: { type: "article", title: article.title, description: article.description, publishedTime: article.publishedAt, modifiedTime: article.revisedAt || article.publishedAt, authors: [article.author], images: [{ url: `/og/${article.slug}.png`, width: 1200, height: 630, alt: article.title }] },
    twitter: { card: "summary_large_image", title: article.title, description: article.description, images: [`/og/${article.slug}.png`] },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  const context = getArticleContext(slug);
  if (!article || !context) notFound();
  const Content = article.Content;
  const index = articles.findIndex((item) => item.slug === article.slug);
  const previous = articles[index + 1];
  const next = articles[index - 1];
  const related = context.related.slice(0, 3);
  const questionCount = context.anchors.filter((anchor) => anchor.kind === "question").length;
  const replacement = article.supersededBy ? getArticle(article.supersededBy) : undefined;
  const schema = {
    "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.description,
    image: `https://ordivon.com/og/${article.slug}.png`, datePublished: article.publishedAt, dateModified: article.revisedAt || article.publishedAt,
    author: { "@type": "Person", name: article.author, url: "https://github.com/zycxfyh" },
    publisher: { "@type": "Organization", name: "Ordivon", url: "https://ordivon.com" },
    mainEntityOfPage: `https://ordivon.com/writing/${article.slug}`,
    isPartOf: { "@type": "Blog", name: "Ordivon Writing", url: "https://ordivon.com/writing" },
    about: [...article.projectSlugs, ...article.questionSlugs],
    citation: article.canonicalResearchRecord,
  };

  return (
    <article className={`article-page article-${article.slug}`} id="top">
      <ReadingProgress />
      <PublicationStatusNotice article={article} replacementTitle={replacement?.title} />
      <header className="article-hero page-shell page-top">
        <div className="article-kicker"><span>{article.type}</span><span>{article.project}</span></div>
        {article.readerCodes?.length ? <aside className="article-code-decoder" aria-label="Experiment code decoder"><span>Code decoder</span><div>{article.readerCodes.map((entry) => <p key={entry.code}><b>{entry.code}</b>{entry.meaning}</p>)}</div></aside> : null}
        <h1>{article.title}</h1><p className="article-deck">{article.deck}</p>
        <div className="article-meta">
          <span>By {article.author}</span><time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time><span>{article.readMinutes} min read</span>
          <span>{questionCount ? `${questionCount} research Question${questionCount === 1 ? "" : "s"}` : `${article.projectSlugs.length} project area${article.projectSlugs.length === 1 ? "" : "s"}`}</span>
        </div>
        <nav className="article-entry-context" aria-label="Direct-entry article context">
          <span>Article context</span>
          <div>{context.anchors.slice(0, 3).map((anchor) => <Link href={anchor.href} key={anchor.id}><b>{anchor.kind === "question" ? "Research question" : "Project"}</b>{anchor.title}</Link>)}</div>
        </nav>
      </header>
      <PublicationBrief article={article} />
      <div className="article-layout page-shell">
        <ArticleToc entries={article.toc} />
        <div className="article-column">
          <p className="article-lead">{article.lead}</p>
          <div className="article-body"><Content /></div>
        </div>
      </div>

      <aside className="article-argument-context page-shell" aria-labelledby="argument-context-title">
        <div className="article-argument-intro">
          <p className="section-index">Publication context</p>
          <h2 id="argument-context-title">Where this article sits.</h2>
          <p>These Project and Question connections come directly from article metadata. The article carries the complete argument; these links only support navigation.</p>
        </div>
        <div className="article-anchor-grid">
          {context.anchors.map((anchor) => (
            <Link className={`kind-${anchor.kind}`} href={anchor.href} key={anchor.id}>
              <span>{anchor.kind === "question" ? "Research Question" : "Project"}</span>
              <h3>{anchor.title}</h3><p>{anchor.summary}</p><b>Open {anchor.kind} ↗</b>
            </Link>
          ))}
        </div>
      </aside>

      <aside className="related-reading page-shell">
        <p className="section-index">Related publications</p>
        <h2>Continue through shared Questions and Projects.</h2>
        <div>
          {related.map((connection) => {
            const labels = [...connection.sharedQuestions.map((item) => item.title), ...connection.sharedProjects.map((item) => item.title)];
            return (
              <Link href={`/writing/${connection.article.slug}`} key={connection.article.slug}>
                <span>{labels.join(" · ")}</span>
                <strong>{connection.article.title}</strong>
                <b>{connection.article.readMinutes} min ↗</b>
              </Link>
            );
          })}
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
