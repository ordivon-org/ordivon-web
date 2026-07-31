import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/content";
import { getResearchDossier, getResearchQuestions } from "@/lib/research";

export const dynamicParams = false;

export function generateStaticParams() {
  return getResearchQuestions().map((question) => ({ slug: question.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const dossier = getResearchDossier(slug);
  if (!dossier) return {};
  return {
    title: dossier.question.title,
    description: dossier.question.summary,
    alternates: { canonical: `/research/${dossier.question.slug}` },
  };
}

export default async function ResearchDossierPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dossier = getResearchDossier(slug);
  if (!dossier) notFound();

  const allQuestions = getResearchQuestions();
  const index = allQuestions.findIndex((question) => question.id === dossier.question.id);
  const previous = allQuestions[index - 1];
  const next = allQuestions[index + 1];

  return (
    <article className={`research-dossier status-${dossier.question.state}`}>
      <header className="research-dossier-hero page-shell page-top">
        <div className="research-dossier-meta">
          <span>Question dossier</span>
          <span>{dossier.project?.title || "Independent research"}</span>
          <span>{dossier.question.state}</span>
          <time dateTime={dossier.question.updatedAt}>{dossier.question.updatedAt ? formatDate(dossier.question.updatedAt) : "Undated"}</time>
        </div>
        <h1>{dossier.question.title}</h1>
        <p>{dossier.question.summary}</p>
        <div className="research-dossier-actions">
          <Link href="/research">All research questions</Link>
          {dossier.project && (
            <Link href={dossier.project.publicPage ? `/projects/${dossier.project.slug}` : dossier.project.repository}>
              {dossier.project.publicPage ? "Open project" : "Open repository"} <span aria-hidden="true">↗</span>
            </Link>
          )}
        </div>
      </header>

      <div className="page-shell research-dossier-main">
        <section className="research-position" aria-labelledby="current-position-title">
          <div className="research-section-intro">
            <p className="section-index">01 / Current position</p>
            <h2 id="current-position-title">A hypothesis is not the current judgment.</h2>
            <p>The dossier preserves the live research position. Dated articles preserve the complete evidence and argument that changed it.</p>
          </div>
          <div className="research-position-grid">
            <article className="kind-question">
              <span>Working hypothesis</span>
              <p>{dossier.question.hypothesis}</p>
            </article>
            <article className="kind-finding">
              <span>Current judgment</span>
              <p>{dossier.question.currentJudgment}</p>
            </article>
          </div>
        </section>

        <section className="research-test-boundary" aria-labelledby="test-boundary-title">
          <div className="research-section-intro">
            <p className="section-index">02 / Decision boundary</p>
            <h2 id="test-boundary-title">What keeps this Question alive?</h2>
          </div>
          <div className="research-boundary-grid">
            <article><span>Why it matters</span><p>{dossier.question.importance}</p></article>
            <article><span>Next admitted test</span><p>{dossier.question.nextStep}</p></article>
            <article><span>Condition for deletion</span><p>{dossier.question.falsifier}</p></article>
          </div>
        </section>

        <section className="research-records" aria-labelledby="records-title">
          <div className="research-section-intro">
            <p className="section-index">03 / Supporting publications</p>
            <h2 id="records-title">Complete arguments connected to this Question.</h2>
            <p>{dossier.articleCount} dated publication{dossier.articleCount === 1 ? "" : "s"} currently document this research line.</p>
          </div>
          <div className="research-record-grid">
            {dossier.articles.map((article) => (
              <Link href={`/writing/${article.slug}`} key={article.slug}>
                <span>{article.type}</span>
                <h3>{article.title}</h3>
                <p>{article.description}</p>
                <b>{formatDate(article.revisedAt || article.publishedAt)} ↗</b>
              </Link>
            ))}
            {!dossier.articles.length && (
              <div className="research-record-empty">
                No publication has earned attachment to this Question yet. The uncertainty remains visible without manufacturing an evidence summary.
              </div>
            )}
          </div>
        </section>

        <section className="research-ledger" aria-labelledby="source-discipline-title">
          <div className="research-section-intro">
            <p className="section-index">04 / Source discipline</p>
            <h2 id="source-discipline-title">The dossier is an index, not the evidence authority.</h2>
          </div>
          <div className="research-boundary-grid">
            <article><span>Question metadata</span><p>Owns the current judgment, next test, and deletion condition.</p></article>
            <article><span>Publications</span><p>Own complete dated arguments, limitations, comparisons, and source links.</p></article>
            <article><span>Repositories</span><p>Own exact code, tests, releases, receipts, and machine evidence.</p></article>
          </div>
        </section>

        {dossier.relatedQuestions.length > 0 && (
          <section className="research-related" aria-labelledby="related-questions-title">
            <div className="research-section-intro">
              <p className="section-index">Related frontier</p>
              <h2 id="related-questions-title">Other Questions applying pressure to {dossier.project?.title || "this area"}.</h2>
            </div>
            <div>
              {dossier.relatedQuestions.map((question) => (
                <Link href={`/research/${question.slug}`} key={question.id}>
                  <span>{question.state}</span>
                  <h3>{question.title}</h3>
                  <p>{question.currentJudgment}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <nav className="research-pagination page-shell" aria-label="Adjacent research questions">
        {previous ? <Link href={`/research/${previous.slug}`}><span>Previous Question</span><strong>{previous.title}</strong></Link> : <span />}
        {next ? <Link href={`/research/${next.slug}`}><span>Next Question</span><strong>{next.title}</strong></Link> : <span />}
      </nav>
    </article>
  );
}
