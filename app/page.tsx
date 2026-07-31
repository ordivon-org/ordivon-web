import "../styles/home.css";
import Link from "next/link";
import { ContinuitySignal } from "@/components/home/continuity-signal";
import { architectureRoles, siteUpdatedAt, getQuestionBySlug } from "@/content/model";
import { formatDate, getArticle } from "@/lib/content";
import { getResearchQuestionSummaries } from "@/lib/research";
import { editorialSelections } from "@/content/editorial/selections";

const ownerDetails: Record<string, string> = {
  computing: "Tests which contracts deserve to survive",
  host: "Keeps goals and task meaning across sessions",
  runtime: "Owns local processes, artifacts, and recovery",
  world: "Tracks external paths, effects, and uncertainty",
};

export default function HomePage() {
  const research = getResearchQuestionSummaries();
  const testing = research
    .filter((item) => item.question.state === "testing")
    .sort((left, right) => right.articleCount - left.articleCount || (right.latestPublicationDate || "").localeCompare(left.latestPublicationDate || ""));
  const frontier = testing[0] || research[0];
  const featured = editorialSelections.home.recentArguments.map(getArticle);
  const proofArticle = getArticle(editorialSelections.home.proof);
  const proofQuestion = getQuestionBySlug("harness-composition-and-completion");
  if (!proofArticle || !proofQuestion || featured.some((article) => !article)) throw new Error("homepage editorial selection is incomplete");
  const latestUpdate = featured[0];

  return (
    <div className="home-page">
      <section className="home-poster" aria-labelledby="home-title">
        <ContinuitySignal />
        <div className="home-poster-inner">
          <p className="home-poster-brand" aria-hidden="true">ORDIVON</p>
          <div className="home-poster-copy">
            <p className="home-poster-meta">Independent research and engineering for durable agent work · {formatDate(siteUpdatedAt)}</p>
            <h1 id="home-title">Work should survive the intelligence that started it.</h1>
            <p>Ordivon keeps AI work coherent when a model session ends, a process restarts, or one provider replaces another. It preserves task meaning, execution evidence, and a recoverable path forward.</p>
            <div className="home-actions">
              <Link className="home-action-primary" href="/system">Start with the architecture</Link>
              <Link className="home-action-secondary" href={`/writing/${proofArticle.slug}`}>Read the replacement experiment <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
          <div className="home-poster-legend" aria-label="Ordivon continuity scope">
            <span>Task continuity</span><span>Recoverable execution</span><span>External evidence</span><span>Replaceable intelligence</span>
          </div>
        </div>
      </section>

      <section className="home-proof home-shell" aria-labelledby="home-proof-title">
        <header className="home-section-intro">
          <p>Tested under replacement</p>
          <span>{formatDate(proofArticle.publishedAt)} · Harness H1–H5</span>
        </header>
        <div className="home-proof-layout">
          <div className="home-proof-copy">
            <h2 id="home-proof-title">One task survived Codex↔Hermes replacement and three injected faults.</h2>
            <p>Four live provider runs completed both replacement orders. Host rejected stale completion, rejected success without an artifact, and recovered a response-lost Runtime job without dispatching the work twice.</p>
            <div className="home-actions">
              <Link className="home-action-primary" href={`/writing/${proofArticle.slug}`}>Read the replacement experiment</Link>
              <Link className="home-action-secondary" href={`/research/${proofQuestion.slug}`}>See the boundary it changed <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
          <ol className="home-proof-sequence" aria-label="Harness replacement evidence">
            <li><span>Provider runs</span><strong>4</strong><small>Real Codex App Server and Hermes ACP runs, not simulated adapters.</small></li>
            <li><span>Replacement orders</span><strong>2 / 2</strong><small>Codex→Hermes and Hermes→Codex both completed one coherent task attempt.</small></li>
            <li><span>Injected faults</span><strong>3</strong><small>Stale assignment, missing artifact, and response loss were contained without inventing completion.</small></li>
          </ol>
        </div>
        <footer className="home-proof-source"><span>{proofArticle.title}</span><span>{proofQuestion.state} research question</span></footer>
      </section>

      <section className="home-owners home-shell" aria-labelledby="home-owners-title">
        <div className="home-section-copy">
          <p>State ownership</p><h2 id="home-owners-title">Three consequence boundaries and one research plane keep the work legible.</h2>
          <span>Host, Runtime, and World preserve different consequence-bearing facts. Computing tests which contracts deserve to remain shared.</span>
        </div>
        <div className="home-owner-list">
          {[...architectureRoles].sort((left, right) => left.index.localeCompare(right.index)).map((system) => (
            <Link href={system.href || `/projects/${system.slug}`} className="home-owner-row" key={system.id}>
              <span className="home-owner-status">{system.kind === "boundary" ? system.maturity : system.status}</span>
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
                <Link href={`/research/${frontier.question.slug}`}>See the evidence and next test <span aria-hidden="true">↗</span></Link>
              </aside>
            </div>
          </div>
        </section>
      )}

      <section className="home-writing home-shell" aria-labelledby="home-writing-title">
        <div className="home-section-copy">
          <p>Recent arguments</p><h2 id="home-writing-title">Experiments, failures, and the judgments they changed.</h2>
          <span>Read the complete reasoning behind a boundary, a deletion, a release, or a claim that survived real pressure.</span>
        </div>
        <div className="home-writing-list">
          {featured.map((article) => {
            if (!article) return null;
            const question = article.questionSlugs.map(getQuestionBySlug).find(Boolean);
            return (
              <Link href={`/writing/${article.slug}`} className="home-writing-row" key={article.slug}>
                <div><span>{article.type}</span><time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time></div>
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
            <Link className="home-action-primary" href="/writing">Choose a reading path</Link>
            <Link className="home-action-secondary" href="/research">Explore open questions <span aria-hidden="true">↗</span></Link>
            <a className="home-action-secondary" href="https://github.com/zycxfyh">Inspect the repositories <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>
    </div>
  );
}
