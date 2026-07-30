import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { SystemExplorer } from "@/components/system/system-explorer";
import { formatDate } from "@/lib/content";
import { getNodesByKind, graphNodes, graphRelations, graphUpdatedAt } from "@/lib/graph";
import { systemPerspectives } from "@/lib/graph/system-views";

export const metadata: Metadata = {
  title: "System",
  description: "Explore Ordivon as a typed graph of state owners, projects, research questions, experiments, findings, decisions, and public records.",
  alternates: { canonical: "/system" },
};

const nodeKinds = [
  ["system", "State owner", "A durable responsibility that another layer must not fabricate."],
  ["project", "Repository", "An implementation or research line with its own source of truth."],
  ["question", "Question", "A falsifiable uncertainty that can change priorities or boundaries."],
  ["experiment", "Experiment", "A real intervention or workload used to change the model."],
  ["finding", "Finding", "An interpretation supported by observed evidence."],
  ["decision", "Decision", "A dated allocation of structure, effort, or responsibility."],
  ["article", "Public record", "A durable argument or report connected to the objects it explains."],
] as const;

const relationKinds = [
  ["depends on", "One object requires facts or capabilities owned by another."],
  ["implements", "A repository or decision realizes a responsibility or question."],
  ["tests", "An experiment applies pressure to a question."],
  ["supports", "Evidence increases confidence in a finding or decision."],
  ["documents", "A public record explains a project, finding, or decision."],
] as const;

export default function SystemPage() {
  const systemNodes = getNodesByKind("system").sort((a, b) => a.index.localeCompare(b.index));
  const activeExperiments = getNodesByKind("experiment").filter((node) => node.status === "active" || node.status === "experimental");
  const activeQuestions = getNodesByKind("question").filter((node) => node.status === "active" || node.status === "experimental");

  return (
    <div className="system-page">
      <header className="system-hero page-shell">
        <div className="system-hero-copy">
          <p className="eyebrow"><span>Typed research space</span><b>{formatDate(graphUpdatedAt)}</b></p>
          <h1>Ordivon is a changing graph, not a product diagram.</h1>
          <p>
            Responsibilities, repositories, questions, experiments, findings, decisions, and writing remain distinct objects.
            Explore the same system through structural ownership, execution flow, or research trajectory.
          </p>
        </div>
        <dl className="system-hero-stats" aria-label="Research graph summary">
          <div><dt>Graph nodes</dt><dd>{graphNodes.length}</dd></div>
          <div><dt>Typed relations</dt><dd>{graphRelations.length}</dd></div>
          <div><dt>Active questions</dt><dd>{activeQuestions.length}</dd></div>
          <div><dt>Active experiments</dt><dd>{activeExperiments.length}</dd></div>
        </dl>
      </header>

      <div className="page-shell system-main">
        <SystemExplorer perspectives={systemPerspectives} />

        <section className="system-language" aria-labelledby="system-language-title">
          <SectionHeading
            eyebrow="Visual language"
            title="Shape, status, and relation carry meaning."
            description="The interface does not use one generic card for every object. Node kinds identify what a thing is; status signals its current condition; edge grammar states why two objects are connected."
          />
          <div className="system-language-grid">
            <div className="node-language" aria-labelledby="node-language-title">
              <h3 id="node-language-title">Node kinds</h3>
              <div>
                {nodeKinds.map(([kind, label, description]) => (
                  <article className={`language-node kind-${kind}`} key={kind}>
                    <span>{kind}</span>
                    <strong>{label}</strong>
                    <p>{description}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className="relation-language" aria-labelledby="relation-language-title">
              <h3 id="relation-language-title">Relation grammar</h3>
              <div>
                {relationKinds.map(([relation, description], index) => (
                  <article key={relation}>
                    <svg viewBox="0 0 140 24" aria-hidden="true">
                      <path className={`relation-sample relation-${["depends_on", "implements", "tests", "supports", "documents"][index]}`} d="M 4 12 L 132 12" />
                      <path className="relation-sample-arrow" d="M 126 7 L 134 12 L 126 17" />
                    </svg>
                    <div><strong>{relation}</strong><p>{description}</p></div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="system-owners" aria-labelledby="system-owners-title">
          <SectionHeading
            eyebrow="State owners"
            title="Four boundaries prevent convenient fiction."
            description="Each layer owns facts that remain expensive or unsafe for another layer to reconstruct after interruption."
          />
          <div className="system-owner-grid">
            {systemNodes.map((node) => (
              <article className={`system-owner-card status-${node.status}`} key={node.id}>
                <div><span>{node.index}</span><i>{node.status}</i></div>
                <h3>{node.title}</h3>
                <p>{node.summary}</p>
                <dl>
                  <div><dt>Owns</dt><dd>{node.owns.join(" · ")}</dd></div>
                  <div><dt>Does not own</dt><dd>{node.boundary.join(" · ")}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
