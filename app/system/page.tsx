import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { SystemExplorer } from "@/components/system/system-explorer";
import { boundaries, getProjectBySlug, researchPlanes, siteUpdatedAt } from "@/content/model";
import { formatDate } from "@/lib/content";
import { systemPerspectives } from "@/lib/system-views";

export const metadata: Metadata = {
  title: "How it works",
  description: "Follow one composable durable-work trajectory through Host semantic continuity, a replaceable Harness Run, Runtime physical execution, and back to the owning application or external system.",
  alternates: { canonical: "/system" },
};

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
  const harnessProject = getProjectBySlug("harness")!;
  const runtimeProject = getProjectBySlug("runtime")!;
  const trajectory = [
    ["01", "A participant or application defines the work", "A real goal, repository, game state, external service, budget, or human decision creates work whose meaning belongs to its domain."],
    ["02", "Host preserves the semantic work frontier", "Task identity/revision, Host Journal/CAS admission, and the current WorkingCheckpoint survive client replacement while Runtime, Git, Provider, and domain facts remain references that must be revalidated with their native owners."],
    ["03", "Harness runs replaceable intelligence", harnessProject.capability],
    ["04", "Runtime commits local physical work", "Exact source and request identity become observable Jobs, process state, structured patches, Artifacts, cancellation, and reconciliation evidence."],
    ["05", "Current consequence returns to the owner", "External providers keep native truth; World preserves only the cross-owner relation when needed. The caller or domain then revalidates current applicability, accepts or rejects completion, and decides what the evidence means next."],
  ] as const;
  const evidence = [
    [String(boundaryNodes.length), "current core boundaries"],
    [harnessProject.evidence[0].value, `Harness ${harnessProject.evidence[0].label}`],
    [harnessProject.evidence[2].value, `Harness ${harnessProject.evidence[2].label}`],
    [runtimeProject.evidence[0].value, `Runtime ${runtimeProject.evidence[0].label}`],
  ] as const;

  return (
    <div className="system-page">
      <header className="system-hero page-shell">
        <div className="system-hero-copy">
          <p className="eyebrow"><span>How it works · durable work trajectory</span><b>{formatDate(siteUpdatedAt)}</b></p>
          <h1>One piece of semantic work can outlive the model Run and process that carried it.</h1>
          <p>Ordivon does not require every project to run through one platform. When durable semantic continuity, replaceable cognition, and physical execution are all needed, Host, Harness, and Runtime can compose without turning any one of them into the owner of the caller&apos;s domain truth.</p>
          <div className="actions"><Link className="button primary" href="/projects">See every project and status</Link><Link className="button text" href="/writing/from-tokens-to-work">Read the complete execution guide</Link></div>
        </div>
        <dl className="system-hero-stats" aria-label="Demonstrated system evidence">{evidence.map(([value, label]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      </header>

      <div className="page-shell system-main">
        <section className="system-trajectory" aria-labelledby="system-trajectory-title">
          <SectionHeading eyebrow="One composable trajectory" title="The work moves; ownership does not blur." description="This is a supported path, not a mandatory platform pipeline. The domain begins and ends the trajectory; Host, Harness, and Runtime own different interruption-sensitive facts in the middle, and World appears only when a cross-owner relationship cannot be reconstructed safely by either endpoint alone." />
          <ol>{trajectory.map(([index, title, description]) => <li key={title} className="tested"><span>{index}</span><div><b>Current boundary</b><h3>{title}</h3><p>{description}</p></div></li>)}</ol>
        </section>

        <section className="system-explorer-section" aria-labelledby="system-explorer-section-title">
          <div className="system-editorial-intro"><p className="section-index">Explore the architecture</p><h2 id="system-explorer-section-title">Inspect ownership, execution, and research connections.</h2><p>The explorer is a curated orientation. Exact implementation state remains in the linked repositories.</p></div>
          <SystemExplorer perspectives={systemPerspectives} />
        </section>

        <section className="system-owners" aria-labelledby="system-owners-title">
          <SectionHeading eyebrow="Core work system" title="Three boundaries preserve facts interruption makes expensive to reconstruct." description="Host, Harness, and Runtime preserve different interruption-sensitive facts while leaving caller and domain authority outside the execution layers." />
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
