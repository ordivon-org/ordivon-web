import Link from "next/link";
import { ContinuitySignal } from "@/components/home/continuity-signal";
import { systems, siteUpdatedAt, getQuestionBySlug } from "@/content/model";
import { formatDate, getArticle } from "@/lib/content";
import { getResearchQuestionSummaries } from "@/lib/research";
import { getFeaturedWriting } from "@/lib/writing";
import { getLatestPublicUpdate } from "@/lib/updates";

const ownerDetails: Record<string, string> = {
  computing: "Shared contracts and conformance",
  host: "Goals, Tasks, and continuation",
  runtime: "Committed local effects",
  world: "Conditioned external action",
};

export default function HomePage() {
  const research = getResearchQuestionSummaries();
  const testing = research
    .filter((item) => item.question.state === "testing")
    .sort((left, right) => right.articleCount - left.articleCount || (right.latestPublicationDate || "").localeCompare(left.latestPublicationDate || ""));
  const frontier = testing[0] || research[0];
  const featured = getFeaturedWriting(3);
  const proofArticle = getArticle("host-task-continuity");
  const proofQuestion = getQuestionBySlug("host-general-repository-goal");
  if (!proofArticle || !proofQuestion) throw new Error("homepage continuity proof is incomplete");
  const latestUpdate = getLatestPublicUpdate();

  return (
    <div className="home-page">
      <section className="home-poster" aria-labelledby="home-title">
        <ContinuitySignal />
        <div className="home-poster-inner">
          <p className="home-poster-brand" aria-hidden="true">ORDIVON</p>
          <div className="home-poster-copy">
            <p className="home-poster-meta">Independent agent systems · {formatDate(siteUpdatedAt)}</p>
            <h1 id="home-title">Work should survive the intelligence that started it.</h1>
            <p>Ordivon preserves Tasks, committed effects, external interactions, and evidence across model sessions, process restarts, machines, and providers.</p>
            <div className="home-actions">
              <Link className="home-action-primary" href="/system">Explore the system</Link>
              <Link className="home-action-secondary" href="/research">See what is under test <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
          <div className="home-poster-legend" aria-label="Ordivon continuity scope">
            <span>Task continuity</span><span>Committed effects</span><span>Recoverable paths</span><span>Durable evidence</span>
          </div>
        </div>
      </section>

      <section className="home-proof home-shell" aria-labelledby="home-proof-title">
        <header className="home-section-intro">
          <p>Proven continuity</p>
          <span>{formatDate(proofArticle.date)} · Host continuation</span>
        </header>
        <div className="home-proof-layout">
          <div className="home-proof-copy">
            <h2 id="home-proof-title">Task truth survived session loss, restart recovery, and model replacement.</h2>
            <p>{proofQuestion.currentJudgment}</p>
            <div className="home-actions">
              <Link className="home-action-primary" href={`/writing/${proofArticle.slug}`}>Read the architecture report</Link>
              <Link className="home-action-secondary" href={`/research/${proofQuestion.slug}`}>Inspect the current Question <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
          <ol className="home-proof-sequence" aria-label="Host continuity trajectory">
            <li><span>Session</span><strong>Ended</strong><small>The active model stopped owning the conversation.</small></li>
            <li><span>Task state</span><strong>Remained</strong><small>Admitted decisions and unresolved work stayed explicit.</small></li>
            <li><span>Continuation</span><strong>Recovered</strong><small>A replacement model resumed without fabricating execution truth.</small></li>
          </ol>
        </div>
        <footer className="home-proof-source"><span>{proofArticle.title}</span><span>{proofQuestion.state} Question</span></footer>
      </section>

      <section className="home-owners home-shell" aria-labelledby="home-owners-title">
        <div className="home-section-copy">
          <p>State ownership</p><h2 id="home-owners-title">Four owners. No shared fiction.</h2>
          <span>Each layer owns facts the others must not reconstruct. Together they preserve one recoverable trajectory without collapsing into a monolith.</span>
        </div>
        <div className="home-owner-list">
          {[...systems].sort((left, right) => left.index.localeCompare(right.index)).map((system) => (
            <Link href={system.href || `/projects/${system.slug}`} className="home-owner-row" key={system.id}>
              <span className="home-owner-status">{system.status}</span>
              <div><strong>{system.title}</strong><small>{ownerDetails[system.slug] || system.question}</small></div>
              <p>{system.thesis}</p><b aria-hidden="true">↗</b>
            </Link>
          ))}
        </div>
      </section>

      {frontier && (
        <section className="home-frontier" aria-labelledby="home-frontier-title">
          <div className="home-shell home-frontier-inner">
            <header className="home-section-intro"><p>Under test now</p><span>{frontier.project?.title || "Ordivon"} · {frontier.question.state}</span></header>
            <div className="home-frontier-layout">
              <div><h2 id="home-frontier-title">{frontier.question.title}</h2><p>{frontier.question.currentJudgment}</p></div>
              <aside className="home-frontier-next">
                <span>Next decisive test</span><p>{frontier.question.nextStep}</p>
                <small>{frontier.articleCount} supporting publications</small>
                <Link href={`/research/${frontier.question.slug}`}>See the publications and deletion condition <span aria-hidden="true">↗</span></Link>
              </aside>
            </div>
          </div>
        </section>
      )}

      <section className="home-writing home-shell" aria-labelledby="home-writing-title">
        <div className="home-section-copy">
          <p>Recent arguments</p><h2 id="home-writing-title">The public record of changing judgment.</h2>
          <span>Articles preserve the complete reasoning, limits, evidence links, and next falsifier. Project and Question metadata only make that record navigable.</span>
        </div>
        <div className="home-writing-list">
          {featured.map((article) => {
            const question = article.questionSlugs.map(getQuestionBySlug).find(Boolean);
            return (
              <Link href={`/writing/${article.slug}`} className="home-writing-row" key={article.slug}>
                <div><span>{article.type}</span><time dateTime={article.date}>{formatDate(article.date)}</time></div>
                <h3>{article.title}</h3><p>{article.description}</p>
                <small>{question ? `Addresses: ${question.title}` : article.project}</small><b aria-hidden="true">↗</b>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="home-final" aria-labelledby="home-final-title">
        <div className="home-shell home-final-inner">
          <p>{latestUpdate ? `Latest publication · ${latestUpdate.title}` : "Continue from the current evidence."}</p>
          <h2 id="home-final-title">Follow the trajectory, not the session.</h2>
          <div className="home-actions">
            <Link className="home-action-primary" href="/research">Explore the research</Link>
            <Link className="home-action-secondary" href="/writing">Read the arguments <span aria-hidden="true">↗</span></Link>
            <a className="home-action-secondary" href="https://github.com/zycxfyh">Inspect the repositories <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>
    </div>
  );
}
