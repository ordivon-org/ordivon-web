import "../styles/home.css";
import Link from "next/link";
import { ContinuitySignal } from "@/components/home/continuity-signal";
import { siteUpdatedAt, getProjectBySlug, getQuestionBySlug } from "@/content/model";
import { formatDate, getArticle } from "@/lib/content";
import { projects } from "@/lib/projects";
import { getResearchQuestionSummaries } from "@/lib/research";
import { editorialSelections } from "@/content/editorial/selections";

const categoryCopy = {
  "core-system": ["Core work system", "Host preserves the Task, Harness runs a replaceable Agent episode, and Runtime commits physical local execution."],
  application: ["Applications and capability", "Game, World, Finance, and Media pressure the system through play, external reality, capital effects, and structured human-facing mediation; Studio remains Media’s production plane."],
  research: ["Research and specification", "Computing tests cross-project laws, Human studies practical trajectories, and Security runs bounded adversarial experiments."],
} as const;

const statusLabel = {
  operational: "usable now",
  prototype: "implemented prototype",
  playable: "playable now",
  research: "research",
  internal: "internal",
} as const;

export default function HomePage() {
  const research = getResearchQuestionSummaries();
  const frontier = research.find((item) => item.question.slug === editorialSelections.research.currentQuestion)
    || research.filter((item) => item.question.state === "testing" || item.question.state === "open")[0];
  const featured = editorialSelections.home.recentArguments.map(getArticle);
  const proofArticle = getArticle(editorialSelections.home.proof);
  const proofQuestion = getQuestionBySlug("causal-responsibility-explanation");
  const gameProject = getProjectBySlug("game");
  if (!proofArticle || !proofQuestion || !gameProject || featured.some((article) => !article)) throw new Error("homepage editorial selection is incomplete");

  return (
    <div className="home-page">
      <section className="home-poster" aria-labelledby="home-title">
        <ContinuitySignal />
        <div className="home-poster-inner">
          <p className="home-poster-brand" aria-hidden="true">ORDIVON</p>
          <div className="home-poster-copy">
            <p className="home-poster-meta">Independent systems, research, applications, and public evidence for Agent work · {formatDate(siteUpdatedAt)}</p>
            <h1 id="home-title">Build Agent systems that can survive contact with time, tools, capital, people, and Reality.</h1>
            <p>Ordivon is a family of independently owned systems and research lines. Host, Harness, and Runtime preserve durable work; Game, Finance, World, Human, Security, and Media pressure those ideas in materially different domains; Computing tests what should become reusable knowledge and what should be deleted.</p>
            <div className="home-actions">
              <Link className="home-action-primary" href="/projects">See the complete project map</Link>
              <Link className="home-action-secondary" href="/system">Follow one work trajectory <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
          <div className="home-poster-legend" aria-label="Ordivon public scope">
            <span>Operational infrastructure</span><span>Agent capital system</span><span>Playable product</span><span>Cross-domain research</span>
          </div>
        </div>
      </section>

      <section className="home-proof home-shell" aria-labelledby="home-current-title">
        <header className="home-section-intro"><p>What exists today</p><span>Capability, not roadmap language</span></header>
        <div className="home-current-grid">
          {projects.filter((project) => ["runtime", "host", "game", "finance", "computing", "studio"].includes(project.slug)).map((project) => (
            <Link href={`/projects/${project.slug}`} className="home-current-card" data-availability={project.availability} key={project.slug}>
              <span>{statusLabel[project.availability]}</span><strong>{project.title}</strong><p>{project.capability}</p><small>{project.maturity}</small><b aria-hidden="true">↗</b>
            </Link>
          ))}
        </div>
        <footer className="home-proof-source"><span>These cards are current Web orientation. Exact implementation and operational truth remain with each owning repository.</span><span>{gameProject.state}</span></footer>
      </section>

      <section className="home-owners home-shell" aria-labelledby="home-map-title">
        <div className="home-section-copy">
          <p>Project map</p><h2 id="home-map-title">The family is organized by what it owns—not by one universal platform diagram.</h2>
          <span>Core boundaries carry durable work. Domain owners preserve their own truth. Research and Knowledge decide which distinctions transfer—and which should disappear.</span>
        </div>
        <div className="home-project-groups">
          {Object.entries(categoryCopy).map(([category, [label, description]]) => (
            <article key={category}>
              <header><span>{label}</span><p>{description}</p></header>
              <div>{projects.filter((project) => project.category === category).map((project) => <Link href={`/projects/${project.slug}`} key={project.slug}><strong>{project.title}</strong><small>{statusLabel[project.availability]}</small><b>↗</b></Link>)}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-frontier" aria-labelledby="home-proof-title">
        <div className="home-shell home-frontier-inner">
          <header className="home-section-intro"><p>Why the boundaries exist</p><span>{formatDate(proofArticle.publishedAt)} · retained evidence</span></header>
          <div className="home-frontier-layout">
            <div><h2 id="home-proof-title">We made the explanation richer. The decisions did not improve.</h2><p>Across five frozen surfaces and 1,326 accepted Agent decisions, compact causal prose matched causal cards, typed relations, and explicit question grammars on exact action while using fewer Provider tokens. The result supports a smaller default explanation—not a claim that diagrams or structure are never useful.</p></div>
            <aside className="home-frontier-next"><span>Bounded result</span><p>{proofQuestion.currentJudgment}</p><small>1,326 / 1,326 exact actions · 17 responsibility families · 5 surfaces</small><Link href={`/writing/${proofArticle.slug}`}>Read the complete evidence <span aria-hidden="true">↗</span></Link></aside>
          </div>
        </div>
      </section>

      {frontier && <section className="home-writing home-shell" aria-labelledby="home-frontier-title">
        <div className="home-section-copy"><p>Current frontier</p><h2 id="home-frontier-title">{frontier.question.title}</h2><span>{frontier.question.currentJudgment}</span></div>
        <div className="home-frontier-summary"><div><span>Next decisive test</span><p>{frontier.question.nextStep}</p></div><Link className="home-action-primary" href={`/research/${frontier.question.slug}`}>Open the research dossier</Link></div>
      </section>}

      <section className="home-writing home-shell" aria-labelledby="home-writing-title">
        <div className="home-section-copy"><p>Writing</p><h2 id="home-writing-title">Dated arguments preserve what changed—and what later became historical.</h2><span>Articles interpret evidence at a date. Current project pages summarize today&apos;s boundary and link back to the repository that owns the facts.</span></div>
        <div className="home-writing-list">
          {featured.map((article) => article && <Link href={`/writing/${article.slug}`} className="home-writing-row" key={article.slug}><div><span>{article.status === "historical" ? `Historical · ${article.type}` : article.type}</span><time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time></div><h3>{article.title}</h3><p>{article.description}</p><small>{article.project}</small><b aria-hidden="true">↗</b></Link>)}
        </div>
      </section>

      <section className="home-final" aria-labelledby="home-final-title">
        <div className="home-shell home-final-inner">
          <p>Choose the depth that matches your question.</p>
          <h2 id="home-final-title">Understand, use, research, or challenge the work.</h2>
          <div className="home-actions"><Link className="home-action-primary" href="/system">Understand how it works</Link><Link className="home-action-secondary" href="/projects">Choose a project <span aria-hidden="true">↗</span></Link><Link className="home-action-secondary" href="/research">Follow open questions <span aria-hidden="true">↗</span></Link><a className="home-action-secondary" href="https://github.com/zycxfyh/ordivon-computing">Inspect source and authority <span aria-hidden="true">↗</span></a></div>
        </div>
      </section>
    </div>
  );
}
