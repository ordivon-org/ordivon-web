import type { Metadata } from "next";
import Link from "next/link";
import { ResearchExplorer, type ResearchTimelineItem } from "@/components/research/research-explorer";
import { SectionHeading } from "@/components/section-heading";
import { formatDate } from "@/lib/content";
import { getNode, graphEvents, graphUpdatedAt } from "@/lib/graph";
import { getResearchQuestionSummaries } from "@/lib/graph/research";

export const metadata: Metadata = {
  title: "Research",
  description: "Explore Ordivon through durable research questions, current hypotheses, experiments, findings, decisions, and public records.",
  alternates: { canonical: "/research" },
};

const method = [
  ["Question", "A bounded uncertainty whose answer can change structure, priority, or project scope."],
  ["Experiment", "A real workload, intervention, comparison, or failure used to put pressure on the current model."],
  ["Finding", "A dated interpretation of observed evidence with explicit confidence rather than permanent truth."],
  ["Decision", "A structural or resource commitment made because the evidence changed what should happen next."],
] as const;

export default function ResearchPage() {
  const questions = getResearchQuestionSummaries();
  const testing = questions.filter((item) => item.question.state === "testing").length;
  const evidenceBacked = questions.filter((item) => item.evidenceCount > 0).length;
  const projects = new Set(questions.map((item) => item.project?.id).filter(Boolean)).size;
  const timeline: ResearchTimelineItem[] = [...graphEvents]
    .sort((left, right) => right.date.localeCompare(left.date))
    .map((event) => {
      const question = event.nodeIds.map((id) => getNode(id)).find((node) => node?.kind === "question");
      return {
        id: event.id,
        date: event.date,
        displayDate: formatDate(event.date),
        type: event.type,
        title: event.title,
        summary: event.summary,
        href: question?.kind === "question" ? `/research/${question.slug}` : undefined,
      };
    });

  return (
    <div className="research-page">
      <header className="research-hero page-shell page-top">
        <div>
          <p className="eyebrow">Research · {formatDate(graphUpdatedAt)}</p>
          <h1>Questions are the durable unit of unfinished work.</h1>
          <p>
            Projects are temporary allocations of effort. A Question survives repository changes, failed experiments,
            revised boundaries, and new evidence. Each dossier states the present hypothesis, judgment, next test, and
            condition that would make the abstraction unnecessary.
          </p>
        </div>
        <dl aria-label="Research graph summary">
          <div><dt>Question dossiers</dt><dd>{questions.length}</dd></div>
          <div><dt>Under test</dt><dd>{testing}</dd></div>
          <div><dt>Evidence-backed</dt><dd>{evidenceBacked}</dd></div>
          <div><dt>Project lines</dt><dd>{projects}</dd></div>
        </dl>
      </header>

      <div className="page-shell research-main">
        <ResearchExplorer questions={questions} timeline={timeline} />

        <section className="research-method" aria-labelledby="research-method-title">
          <SectionHeading
            index="02"
            eyebrow="Research contract"
            title="Evidence may revise the map; the map may not revise the evidence."
            description="The site can organize and interpret work, but repositories, tests, receipts, and observed behavior remain authoritative. Empty evidence sections are preserved as uncertainty rather than filled with narrative confidence."
          />
          <div className="research-method-grid">
            {method.map(([label, description], index) => (
              <article className={`kind-${label.toLowerCase()}`} key={label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{label}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="research-system-link">
          <div>
            <p className="section-index">System context</p>
            <h2>Questions explain why the architecture is still moving.</h2>
          </div>
          <p>
            Use the System explorer to inspect state owners and execution relations. Return here when the useful unit is
            not a component, but the uncertainty that could cause a component to change or disappear.
          </p>
          <Link className="button primary" href="/system">Open System explorer <span aria-hidden="true">↗</span></Link>
        </section>
      </div>
    </div>
  );
}
