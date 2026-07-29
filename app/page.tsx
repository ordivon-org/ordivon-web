import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { SystemMap } from "@/components/system-map";
import { articles, formatDate } from "@/lib/content";
import { projects } from "@/lib/projects";

export default function HomePage() {
  const featured = articles.slice(0, 3);
  return (
    <>
      <section className="home-hero page-shell">
        <div className="hero-copy">
          <p className="eyebrow"><span>Independent research + engineering</span><b>2026</b></p>
          <h1>Agents should outlive the sessions that think for them.</h1>
          <p className="hero-lede">Ordivon builds the layers that let capable agents continue work, commit actions, recover paths, preserve evidence, and change models without starting over.</p>
          <div className="actions"><Link className="button primary" href="/projects">Explore the system</Link><Link className="button text" href="/writing">Read the argument <span>↗</span></Link></div>
        </div>
        <div className="hero-proof" aria-label="Current system status">
          <div className="proof-label"><span>Current snapshot</span><time dateTime="2026-07-29">29 July 2026</time></div>
          <dl>
            <div><dt>Semantic continuity</dt><dd>Host journal and recoverable Tasks</dd></div>
            <div><dt>Physical execution</dt><dd>13-tool production Runtime</dd></div>
            <div><dt>World interfaces</dt><dd>Measured paths and bounded Edge effects</dd></div>
            <div><dt>Public record</dt><dd>Source-linked writing and evidence</dd></div>
          </dl>
        </div>
      </section>

      <section className="map-section page-shell">
        <SectionHeading index="01" eyebrow="The system" title="One graph. Five independent state owners." description="Ordivon is not a monolithic agent framework. Each project owns facts that the others must not fabricate." />
        <SystemMap />
      </section>

      <section className="failure-section page-shell">
        <SectionHeading index="02" eyebrow="Why it exists" title="Intelligence is cheap to restart. Consequences are not." description="A strong model can reconstruct a plan. It cannot safely infer what crossed into reality while it was gone." />
        <div className="failure-grid">
          {[
            ["Session ends", "The Goal remains, but the model no longer owns the Task state."],
            ["Response disappears", "The caller cannot know whether the operation committed or only timed out."],
            ["Path changes", "The endpoint still matters even when the route, identity, or carrier changes."],
            ["Evidence fragments", "A later agent cannot continue when source, output, and receipts are separated."],
          ].map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="project-preview page-shell">
        <SectionHeading index="03" eyebrow="Maintained projects" title="Different layers earn different boundaries." description="The repositories share a thesis, not a database. Their source, tests, receipts, and current documents remain canonical." />
        <div className="project-preview-list">
          {projects.map((project) => (
            <Link href={`/projects/${project.slug}`} className="project-preview-row" key={project.slug}>
              <span>{project.index}</span><div><p>{project.group}</p><h3>{project.title}</h3></div><strong>{project.label}</strong><b aria-hidden="true">↗</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="current-feature page-shell">
        <div className="current-copy">
          <p className="section-index">Current evidence</p>
          <h2>Runtime moved from a command surface to a maintained effect boundary.</h2>
          <p>The original ten tools proved durable local execution. Production use then clarified commitment, explicit ambiguity, structured progress, lifecycle retention, repair, status, and receipted deployment.</p>
          <Link className="text-link" href="/writing/runtime-after-core">Read the engineering report <span>↗</span></Link>
        </div>
        <div className="current-metrics">
          <div><strong>13</strong><span>public tools</span></div><div><strong>42</strong><span>Workspaces reclaimed</span></div><div><strong>3.4 GB</strong><span>retained store</span></div><div><strong>UNKNOWN</strong><span>preserved, not guessed</span></div>
        </div>
      </section>

      <section className="writing-preview page-shell">
        <SectionHeading index="04" eyebrow="Writing" title="The reasoning that does not belong in source code." description="Essays, engineering reports, architecture records, and releases preserve dated arguments while repositories continue to change." />
        <div className="featured-writing">
          {featured.map((article, index) => (
            <Link href={`/writing/${article.slug}`} key={article.slug} className={index === 0 ? "featured-article lead" : "featured-article"}>
              <div><span>{article.type}</span><time dateTime={article.date}>{formatDate(article.date)}</time></div><h3>{article.title}</h3><p>{article.description}</p><b>{article.readMinutes} min ↗</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="closing-statement page-shell">
        <p>Ordivon is built around one operational belief.</p>
        <h2>Move faster by making failure local, evidence durable, and cognition replaceable.</h2>
        <div className="actions"><Link className="button primary inverse" href="/about">How the work is organized</Link><a className="button text inverse" href="https://github.com/zycxfyh">Inspect the repositories ↗</a></div>
      </section>
    </>
  );
}
