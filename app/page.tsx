import Link from "next/link";
export default function HomePage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Web V2 · Round 1</p>
        <h1>Continuity for agents that act in a changing world.</h1>
        <p className="lede">This production-runtime proof verifies the framework, deployment target, metadata, routing, MDX, and browser contract before editorial design begins.</p>
        <div className="actions">
          <Link className="button primary" href="/projects">Inspect static routing</Link>
          <Link className="button" href="/api/health">Inspect dynamic runtime</Link>
        </div>
      </section>
      <section className="grid" aria-label="Round 1 proof areas">
        <article className="card"><h2>Static</h2><p>App Router pages are prerendered where possible.</p></article>
        <article className="card"><h2>Dynamic</h2><p>A Worker runtime route proves request-time execution.</p></article>
        <article className="card"><h2>MDX</h2><p>Research and editorial content can embed typed React components.</p></article>
      </section>
    </>
  );
}
