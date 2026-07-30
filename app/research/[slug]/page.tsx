import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/content";
import { getNode } from "@/lib/graph";
import { getResearchDossier, getResearchQuestions } from "@/lib/graph/research";
import type { ResearchEvidenceNode } from "@/lib/graph/research";

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

function evidenceMeta(node: ResearchEvidenceNode) {
  if (node.kind === "experiment") return `${node.state} experiment`;
  if (node.kind === "finding") return `${node.confidence} confidence`;
  return "structural decision";
}

export default async function ResearchDossierPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dossier = getResearchDossier(slug);
  if (!dossier) notFound();

  const allQuestions = getResearchQuestions();
  const index = allQuestions.findIndex((question) => question.id === dossier.question.id);
  const previous = allQuestions[index - 1];
  const next = allQuestions[index + 1];
  const evidence = [...dossier.experiments, ...dossier.findings, ...dossier.decisions]
    .sort((left, right) => right.date.localeCompare(left.date) || left.title.localeCompare(right.title));

  return (
    <article className={`research-dossier status-${dossier.question.status}`}>
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
            <h2 id="current-position-title">A hypothesis is not a finding.</h2>
            <p>The dossier keeps the proposed model separate from the judgment currently supported by evidence.</p>
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
            <h2 id="test-boundary-title">What makes this Question worth keeping?</h2>
          </div>
          <div className="research-boundary-grid">
            <article><span>Why it matters</span><p>{dossier.question.importance}</p></article>
            <article><span>Next admitted test</span><p>{dossier.question.nextStep}</p></article>
            <article><span>Condition for deletion</span><p>{dossier.question.falsifier}</p></article>
          </div>
        </section>

        <section className="research-evidence" aria-labelledby="evidence-title">
          <div className="research-section-intro">
            <p className="section-index">03 / Evidence trajectory</p>
            <h2 id="evidence-title">Observed work, interpreted findings, and explicit decisions.</h2>
            <p>{dossier.evidenceCount} evidence objects are currently admitted to this dossier.</p>
          </div>
          {evidence.length ? (
            <div className="research-evidence-list">
              {evidence.map((node, evidenceIndex) => (
                <article className={`kind-${node.kind}`} key={node.id}>
                  <div>
                    <span>{String(evidenceIndex + 1).padStart(2, "0")}</span>
                    <b>{node.kind}</b>
                    <time dateTime={node.date}>{formatDate(node.date)}</time>
                  </div>
                  <h3>{node.title}</h3>
                  <p>{node.summary}</p>
                  <footer>{evidenceMeta(node)}</footer>
                </article>
              ))}
            </div>
          ) : (
            <div className="research-empty-evidence">
              <span>0 admitted evidence objects</span>
              <h3>No experiment has earned entry into this dossier yet.</h3>
              <p>The Question remains public because its uncertainty matters. The page does not convert a proposed experiment or confident explanation into evidence.</p>
            </div>
          )}
        </section>

        <section className="research-records" aria-labelledby="records-title">
          <div className="research-section-intro">
            <p className="section-index">04 / Public record</p>
            <h2 id="records-title">Arguments and events connected to this judgment.</h2>
          </div>
          <div className="research-record-grid">
            {dossier.articles.map((article) => (
              <Link href={`/writing/${article.slug}`} key={article.id}>
                <span>{article.articleType}</span>
                <h3>{article.title}</h3>
                <p>{article.summary}</p>
                <b>{formatDate(article.date)} ↗</b>
              </Link>
            ))}
            {dossier.events.map((event) => (
              <article key={event.id}>
                <span>{event.type}</span>
                <h3>{event.title}</h3>
                <p>{event.summary}</p>
                <b>{formatDate(event.date)}</b>
              </article>
            ))}
            {!dossier.articles.length && !dossier.events.length && (
              <div className="research-record-empty">No article or dated event has been attached to this Question.</div>
            )}
          </div>
        </section>

        <section className="research-ledger" aria-labelledby="ledger-title">
          <div className="research-section-intro">
            <p className="section-index">05 / Graph ledger</p>
            <h2 id="ledger-title">The typed claims this dossier makes.</h2>
          </div>
          <div className="research-relation-list">
            {dossier.relations.map((relation) => {
              const source = getNode(relation.source);
              const target = getNode(relation.target);
              return (
                <div key={relation.id}>
                  <span>{source?.title || relation.source}</span>
                  <b>{relation.label || relation.type.replaceAll("_", " ")}</b>
                  <span>{target?.title || relation.target}</span>
                </div>
              );
            })}
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
