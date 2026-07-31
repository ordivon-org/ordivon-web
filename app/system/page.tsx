import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { SystemExplorer } from "@/components/system/system-explorer";
import { projects, questions, siteUpdatedAt, systems } from "@/content/model";
import { articles, formatDate } from "@/lib/content";
import { systemPerspectives } from "@/lib/system-views";

export const metadata: Metadata = {
  title: "System",
  description: "Explore curated Ordivon architecture views for state ownership, execution flow, active research questions, and their public arguments.",
  alternates: { canonical: "/system" },
};

const objectKinds = [
  ["system", "State owner", "A durable responsibility that another layer must not fabricate."],
  ["project", "Repository", "An implementation or research line with its own source of truth."],
  ["question", "Question", "A falsifiable uncertainty that can change priorities or boundaries."],
  ["article", "Publication", "A complete dated argument with evidence links, limits, and the next falsifier."],
] as const;

const connectionKinds = [
  ["depends on", "One state owner or project requires facts or capabilities owned by another."],
  ["implements", "A repository realizes a stable responsibility or shared contract."],
  ["explores", "A project applies pressure to an active research Question."],
  ["documents", "A publication records the complete argument around a Question."],
] as const;

export default function SystemPage() {
  const systemNodes = [...systems].sort((a, b) => a.index.localeCompare(b.index));
  const publicProjects = projects.filter((project) => project.publicPage);
  const activeQuestions = questions.filter((question) => question.status === "active" || question.status === "experimental");

  return (
    <div className="system-page">
      <header className="system-hero page-shell">
        <div className="system-hero-copy">
          <p className="eyebrow"><span>Curated architecture views</span><b>{formatDate(siteUpdatedAt)}</b></p>
          <h1>Ordivon has a small public model and richer source repositories.</h1>
          <p>Four state owners define the architecture. Projects implement them. Active Questions expose uncertainty. Publications preserve complete arguments. The diagrams below are curated views, not a second knowledge database.</p>
        </div>
        <dl className="system-hero-stats" aria-label="Public system summary">
          <div><dt>State owners</dt><dd>{systemNodes.length}</dd></div>
          <div><dt>Public projects</dt><dd>{publicProjects.length}</dd></div>
          <div><dt>Active Questions</dt><dd>{activeQuestions.length}</dd></div>
          <div><dt>Publications</dt><dd>{articles.length}</dd></div>
        </dl>
      </header>

      <div className="page-shell system-main">
        <SystemExplorer perspectives={systemPerspectives} />

        <section className="system-language" aria-labelledby="system-language-title">
          <SectionHeading
            eyebrow="Public model"
            title="Four object types are sufficient."
            description="The site keeps stable ownership, current uncertainty, and dated argument distinct without publishing every experiment, finding, decision, and relation as another mutable object."
          />
          <div className="system-language-grid">
            <div className="node-language" aria-labelledby="node-language-title">
              <h3 id="node-language-title">Object types</h3>
              <div>
                {objectKinds.map(([kind, label, description]) => (
                  <article className={`language-node kind-${kind}`} key={kind}>
                    <span>{kind}</span><strong>{label}</strong><p>{description}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className="relation-language" aria-labelledby="relation-language-title">
              <h3 id="relation-language-title">Curated connections</h3>
              <div>
                {connectionKinds.map(([relation, description], index) => (
                  <article key={relation}>
                    <svg viewBox="0 0 140 24" aria-hidden="true">
                      <path className={`relation-sample relation-${["depends_on", "implements", "supports", "documents"][index]}`} d="M 4 12 L 132 12" />
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
          <SectionHeading eyebrow="State owners" title="Four boundaries prevent convenient fiction." description="Each layer owns facts that remain expensive or unsafe for another layer to reconstruct after interruption." />
          <div className="system-owner-grid">
            {systemNodes.map((node) => (
              <article className={`system-owner-card status-${node.status}`} key={node.id}>
                <div><span>{node.index}</span><i>{node.status}</i></div>
                <h3>{node.title}</h3><p>{node.summary}</p>
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
