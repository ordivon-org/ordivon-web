import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { SystemExplorer } from "@/components/system/system-explorer";
import { boundaries, researchPlanes, siteUpdatedAt } from "@/content/model";
import { formatDate } from "@/lib/content";
import { systemPerspectives } from "@/lib/system-views";

export const metadata: Metadata = {
  title: "How it works",
  description: "Follow durable Agent work through Host Task continuity, a replaceable Harness Run, Runtime physical execution, verification, and the owning application or external system.",
  alternates: { canonical: "/system" },
};

const trajectory = [
  ["01", "A participant or application defines the work", "A real goal, repository, game state, external service, budget, or human decision creates work whose meaning belongs to its domain."],
  ["02", "Host preserves the Task and commitment", "Generic Task continuity, accepted decisions, unresolved commitments, evidence admission, and outcomes remain durable above one conversation or model Run."],
  ["03", "Harness runs replaceable intelligence", "An Assignment binds one Codex, Hermes, bare-model, or future Agent Run to exact Context, Tools, budgets, checkpoints, and recovery semantics."],
  ["04", "Runtime commits local physical work", "Exact source and request identity become observable Jobs, process state, structured patches, Artifacts, cancellation, and reconciliation evidence."],
  ["05", "Verification returns authority to the owner", "Host and the domain evaluate evidence, accept or reject completion, and decide which work becomes ready next. External providers keep their own truth."],
] as const;

const evidence = [
  ["3", "current core boundaries"],
  ["2 / 2", "Provider-replacement orders completed"],
  ["256", "Harness tests against exact Host pin"],
  ["13", "public Runtime tools"],
] as const;

const objectKinds = [
  ["boundary", "Core boundary", "A durable responsibility whose facts cannot safely be reconstructed by another layer."],
  ["research-plane", "Research plane", "A comparison, specification, and conformance role outside the execution path."],
  ["project", "Repository", "A product, capability carrier, or research line with its own source of truth."],
  ["question", "Question", "A falsifiable uncertainty that can change priorities, scope, or architecture."],
  ["article", "Publication", "A dated argument that records evidence, limitations, and the judgment at that time."],
] as const;

const connectionKinds = [
  ["depends on", "One owner requires capability or evidence owned by another without copying its truth."],
  ["implements", "A repository realizes one tested boundary or shared contract."],
  ["explores", "A project applies pressure to an active research question."],
  ["documents", "A publication records the complete dated argument around a question."],
] as const;

export default function SystemPage() {
  const boundaryNodes = [...boundaries].sort((a, b) => a.index.localeCompare(b.index));
  const researchPlane = researchPlanes[0];

  return (
    <div className="system-page">
      <header className="system-hero page-shell">
        <div className="system-hero-copy">
          <p className="eyebrow"><span>How it works · durable work trajectory</span><b>{formatDate(siteUpdatedAt)}</b></p>
          <h1>One Task can outlive the model Run and process that carried it.</h1>
          <p>Ordivon does not require every project to run through one platform. Its core work system separates durable Task commitments, one replaceable Agent Run, and physical execution so each owner can recover without inventing another layer&apos;s facts.</p>
          <div className="actions"><Link className="button primary" href="/projects">See every project and status</Link><Link className="button text" href="/writing/from-tokens-to-work">Read the complete execution guide</Link></div>
        </div>
        <dl className="system-hero-stats" aria-label="Demonstrated system evidence">{evidence.map(([value, label]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      </header>

      <div className="page-shell system-main">
        <section className="system-trajectory" aria-labelledby="system-trajectory-title">
          <SectionHeading eyebrow="End-to-end trajectory" title="The work moves; ownership does not blur." description="The domain begins and ends the trajectory. Host, Harness, and Runtime own different failure classes in the middle. World is a repository for retained adapters and network tools, not a fourth execution layer." />
          <ol>{trajectory.map(([index, title, description]) => <li key={title} className="tested"><span>{index}</span><div><b>Current boundary</b><h3>{title}</h3><p>{description}</p></div></li>)}</ol>
        </section>

        <section className="system-explorer-section" aria-labelledby="system-explorer-section-title">
          <div className="system-editorial-intro"><p className="section-index">Explore the architecture</p><h2 id="system-explorer-section-title">Inspect ownership, execution, and research connections.</h2><p>The explorer is a curated orientation. Exact implementation state remains in the linked repositories.</p></div>
          <SystemExplorer perspectives={systemPerspectives} />
        </section>

        <section className="system-owners" aria-labelledby="system-owners-title">
          <SectionHeading eyebrow="Core work system" title="Three boundaries preserve facts interruption makes expensive to reconstruct." description="Host owns generic Task continuity, Harness owns Assignment-bound Agent Runs, and Runtime owns physical execution truth." />
          <div className="system-owner-grid">{boundaryNodes.map((node) => <article className={`system-owner-card status-${node.maturity}`} key={node.id}><div><span>{node.index}</span><i>{node.maturity}</i></div><h3>{node.title}</h3><p>{node.summary}</p><dl><div><dt>Preserves</dt><dd>{node.owns.join(" · ")}</dd></div><div><dt>Leaves elsewhere</dt><dd>{node.boundary.join(" · ")}</dd></div></dl></article>)}</div>
        </section>

        <section className="system-research-plane" aria-labelledby="system-research-plane-title">
          <SectionHeading eyebrow="Research and conformance" title="Computing observes the trajectory; it is not another execution layer." description="The research plane compares boundaries against mature alternatives, promotes only cross-project contracts with consumers, and records deletions as results." />
          <article className={`system-owner-card status-${researchPlane.status}`}><div><span>{researchPlane.index}</span><i>{researchPlane.status}</i></div><h3 id="system-research-plane-title">{researchPlane.title}</h3><p>{researchPlane.summary}</p><dl><div><dt>Owns</dt><dd>{researchPlane.owns.join(" · ")}</dd></div><div><dt>Stays outside</dt><dd>{researchPlane.boundary.join(" · ")}</dd></div></dl></article>
        </section>

        <section className="system-language" aria-labelledby="system-language-title">
          <SectionHeading eyebrow="Public model" title="Formal objects appear only after the work trajectory is understood." description="The site distinguishes current ownership, unresolved questions, and dated argument without becoming another implementation database." />
          <div className="system-language-grid"><div className="node-language" aria-labelledby="node-language-title"><h3 id="node-language-title">Object types</h3><div>{objectKinds.map(([kind, label, description]) => <article className={`language-node kind-${kind}`} key={kind}><span>{kind}</span><strong>{label}</strong><p>{description}</p></article>)}</div></div><div className="relation-language" aria-labelledby="relation-language-title"><h3 id="relation-language-title">Curated connections</h3><div>{connectionKinds.map(([relation, description], index) => <article key={relation}><svg viewBox="0 0 140 24" aria-hidden="true"><path className={`relation-sample relation-${["depends_on", "implements", "supports", "documents"][index]}`} d="M 4 12 L 132 12" /><path className="relation-sample-arrow" d="M 126 7 L 134 12 L 126 17" /></svg><div><strong>{relation}</strong><p>{description}</p></div></article>)}</div></div></div>
        </section>
      </div>
    </div>
  );
}
