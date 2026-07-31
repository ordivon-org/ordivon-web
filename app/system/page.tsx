import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { SystemExplorer } from "@/components/system/system-explorer";
import { siteUpdatedAt, systems } from "@/content/model";
import { formatDate } from "@/lib/content";
import { systemPerspectives } from "@/lib/system-views";

export const metadata: Metadata = {
  title: "System",
  description: "Follow one durable task from accepted intent through replaceable model runs, recoverable local execution, external interaction, and evidence-backed continuation.",
  alternates: { canonical: "/system" },
};

const trajectory = [
  ["01", "Host admits the work", "The user goal, task, accepted decisions, and unresolved commitments become durable above one conversation."],
  ["02", "A harness runs replaceable intelligence", "Codex, Hermes, or a future bare-model loop can reason and use tools without becoming the owner of the task."],
  ["03", "Runtime commits local work", "Exact source and operation identity become observable jobs, process state, artifacts, cancellation, and recovery evidence."],
  ["04", "World correlates external consequences", "Paths, identities, provider requests, receipts, observations, and uncertainty remain connected when the outside environment changes."],
  ["05", "Evidence changes the frontier", "Host accepts completion or keeps the task open; Computing uses the same trajectory to retain, narrow, or delete the shared contract."],
] as const;

const evidence = [
  ["2 / 2", "provider-replacement orders completed"],
  ["3", "injected faults contained"],
  ["13", "production Runtime tools"],
  ["W1", "next external recovery comparison"],
] as const;

const objectKinds = [
  ["system", "State owner", "A durable responsibility that another layer must not fabricate."],
  ["project", "Repository", "An implementation or research line with its own source of truth."],
  ["question", "Question", "A falsifiable uncertainty that can change priorities or boundaries."],
  ["article", "Publication", "A complete dated argument with evidence links, limits, and the next test."],
] as const;

const connectionKinds = [
  ["depends on", "One state owner or project requires facts or capabilities owned by another."],
  ["implements", "A repository realizes a stable responsibility or shared contract."],
  ["explores", "A project applies pressure to an active research question."],
  ["documents", "A publication records the complete argument around a question."],
] as const;

export default function SystemPage() {
  const systemNodes = [...systems].sort((a, b) => a.index.localeCompare(b.index));

  return (
    <div className="system-page">
      <header className="system-hero page-shell">
        <div className="system-hero-copy">
          <p className="eyebrow"><span>System · durable work trajectory</span><b>{formatDate(siteUpdatedAt)}</b></p>
          <h1>One task can outlive the model, process, and path that carried it.</h1>
          <p>Ordivon separates task meaning, model-run cognition, local execution, and external consequences so each can be replaced or recovered without forcing another layer to invent what happened.</p>
          <div className="actions"><Link className="button primary" href="/writing/from-tokens-to-work">Read the complete execution stack</Link><Link className="button text" href="/writing/what-h1-h5-proved">See the replacement experiment</Link></div>
        </div>
        <dl className="system-hero-stats" aria-label="Demonstrated system evidence">
          {evidence.map(([value, label]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>
      </header>

      <div className="page-shell system-main">
        <section className="system-trajectory" aria-labelledby="system-trajectory-title">
          <SectionHeading eyebrow="End-to-end trajectory" title="The work moves; ownership does not blur." description="This is the reader-facing path through the stack. Formal objects and curated architecture views follow after the consequence of each boundary is clear." />
          <ol>
            {trajectory.map(([index, title, description], step) => (
              <li key={title} className={step === 3 ? "experimental" : "tested"}><span>{index}</span><div><b>{step === 3 ? "Next decisive test" : "Tested boundary"}</b><h3>{title}</h3><p>{description}</p></div></li>
            ))}
          </ol>
        </section>

        <section className="system-explorer-section" aria-labelledby="system-explorer-section-title">
          <div className="system-editorial-intro"><p className="section-index">Explore the architecture</p><h2 id="system-explorer-section-title">Inspect ownership, execution, and research connections.</h2><p>The explorer is a curated technical view of the same trajectory—not a second source of implementation truth.</p></div>
          <SystemExplorer perspectives={systemPerspectives} />
        </section>

        <section className="system-owners" aria-labelledby="system-owners-title">
          <SectionHeading eyebrow="Durable boundaries" title="Four owners preserve facts that interruption makes expensive to reconstruct." description="Each project can evolve independently because it does not need to copy the state owned by another layer." />
          <div className="system-owner-grid">
            {systemNodes.map((node) => (
              <article className={`system-owner-card status-${node.status}`} key={node.id}>
                <div><span>{node.index}</span><i>{node.status}</i></div>
                <h3>{node.title}</h3><p>{node.summary}</p>
                <dl>
                  <div><dt>Preserves</dt><dd>{node.owns.join(" · ")}</dd></div>
                  <div><dt>Leaves elsewhere</dt><dd>{node.boundary.join(" · ")}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="system-language" aria-labelledby="system-language-title">
          <SectionHeading eyebrow="Formal public model" title="Technical objects appear only after the work trajectory is understood." description="The site distinguishes stable ownership, current uncertainty, and dated argument without publishing every experiment, finding, decision, and relation as another mutable object." />
          <div className="system-language-grid">
            <div className="node-language" aria-labelledby="node-language-title">
              <h3 id="node-language-title">Object types</h3>
              <div>
                {objectKinds.map(([kind, label, description]) => <article className={`language-node kind-${kind}`} key={kind}><span>{kind}</span><strong>{label}</strong><p>{description}</p></article>)}
              </div>
            </div>
            <div className="relation-language" aria-labelledby="relation-language-title">
              <h3 id="relation-language-title">Curated connections</h3>
              <div>
                {connectionKinds.map(([relation, description], index) => (
                  <article key={relation}>
                    <svg viewBox="0 0 140 24" aria-hidden="true"><path className={`relation-sample relation-${["depends_on", "implements", "supports", "documents"][index]}`} d="M 4 12 L 132 12" /><path className="relation-sample-arrow" d="M 126 7 L 134 12 L 126 17" /></svg>
                    <div><strong>{relation}</strong><p>{description}</p></div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
