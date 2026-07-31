import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { WritingFilter } from "@/components/writing-filter";
import { articles, getArticle } from "@/lib/content";
import { getWritingTopics } from "@/lib/writing";

export const metadata: Metadata = {
  title: "Writing",
  description: "Essays, experiments, architecture decisions, and release reports about durable AI agent work.",
  alternates: { canonical: "/writing" },
};

const readingPaths = [
  {
    label: "Start with Ordivon",
    title: "Why durable agent work matters",
    description: "Begin with the practical failure, the project intent, and the larger future Ordivon is trying to make possible.",
    slugs: ["why-ordivon", "creation-judgment-recoverable-systems", "the-future-will-not-wait"],
  },
  {
    label: "Agent architecture",
    title: "From model output to completed work",
    description: "Follow the execution stack, the Harness boundary, and the experiments that made the surviving architecture smaller.",
    slugs: ["from-tokens-to-work", "why-ordivon-needs-a-harness", "what-h1-h5-proved"],
  },
  {
    label: "Experiments and failures",
    title: "What changed under real pressure",
    description: "Read the reports where tactical success, duplicate authority, response loss, and strong baselines forced a different judgment.",
    slugs: ["winning-move-loses-contest", "one-authority-thirteen-tables", "unknown-is-operational-state"],
  },
] as const;

export default function WritingPage() {
  const topics = getWritingTopics();
  const flagship = getArticle("from-tokens-to-work");
  const evidenceReports = [getArticle("what-h1-h5-proved"), getArticle("winning-move-loses-contest")];
  if (!flagship || evidenceReports.some((article) => !article)) throw new Error("writing editorial selection is incomplete");
  const summaries = articles.map(({ slug, title, description, type, project, date, readMinutes }) => ({ slug, title, description, type, project, date, readMinutes }));
  const researchReports = articles.filter((article) => article.type === "Research report").length;
  const engineeringRecords = articles.filter((article) => ["Engineering report", "Architecture report", "Architecture guide", "Architecture decision", "Architecture correction", "Release", "Release note"].includes(article.type)).length;
  const essaysAndNotes = articles.length - researchReports - engineeringRecords;

  return (
    <div className="writing-page page-top">
      <header className="index-hero page-shell">
        <p className="eyebrow">Writing</p>
        <h1>Ideas, experiments, and decisions behind durable agent work.</h1>
        <p>Start with the architecture, follow the experiments that changed it, or browse the complete dated record.</p>
        <dl className="writing-summary" aria-label="Writing summary">
          <div><dt>Research reports</dt><dd>{researchReports}</dd></div>
          <div><dt>Engineering records</dt><dd>{engineeringRecords}</dd></div>
          <div><dt>Essays and notes</dt><dd>{essaysAndNotes}</dd></div>
        </dl>
      </header>

      <div className="page-shell">
        <section className="writing-featured" aria-labelledby="writing-featured-title">
          <Link className="writing-featured-main" href={`/writing/${flagship.slug}`}>
            <span>{flagship.type} · Start here</span>
            <h2 id="writing-featured-title">{flagship.title}</h2>
            <p>{flagship.deck}</p>
            <b>{flagship.readMinutes} min read ↗</b>
          </Link>
          <div className="writing-featured-evidence">
            {evidenceReports.map((article) => article && (
              <Link href={`/writing/${article.slug}`} key={article.slug}>
                <span>{article.type}</span><strong>{article.title}</strong><p>{article.description}</p><b>{article.readMinutes} min ↗</b>
              </Link>
            ))}
          </div>
        </section>

        <section className="writing-paths" aria-labelledby="writing-paths-title">
          <SectionHeading eyebrow="Reading paths" title="Choose the question you want the work to answer." description="Each path begins with a clear problem and moves toward the experiments, decisions, or long-form argument behind it." />
          <div className="writing-path-grid">
            {readingPaths.map((path, index) => (
              <article key={path.label}>
                <div><span>{String(index + 1).padStart(2, "0")}</span><b>{path.label}</b></div>
                <h3>{path.title}</h3><p>{path.description}</p>
                <ol>
                  {path.slugs.map((slug) => {
                    const article = getArticle(slug);
                    if (!article) throw new Error(`missing reading-path article ${slug}`);
                    return <li key={slug}><Link href={`/writing/${slug}`}>{article.title}<span aria-hidden="true">↗</span></Link></li>;
                  })}
                </ol>
              </article>
            ))}
          </div>
        </section>

        <div className="writing-principle"><span>Publishing rule</span><p>Publish when an experiment, boundary, release, or judgment becomes worth preserving—not simply because another page can be filled.</p></div>

        <section className="writing-topics" aria-labelledby="writing-topics-title">
          <SectionHeading
            eyebrow="Follow a research question"
            title="Continue from a specific uncertainty."
            description="For readers already following one research line, these groups connect the current question to its complete published arguments."
          />
          <div className="writing-topic-list">
            {topics.map((topic) => (
              <article key={topic.question.id}>
                <header>
                  <div><span>{topic.project?.title || "Independent research"}</span><b>{topic.question.state}</b></div>
                  <h3><Link href={`/research/${topic.question.slug}`}>{topic.question.title}</Link></h3>
                  <p>{topic.question.currentJudgment}</p>
                </header>
                <div>
                  {topic.articles.slice(0, 4).map((article) => (
                    <Link href={`/writing/${article.slug}`} key={article.slug}>
                      <span>{article.type}</span><strong>{article.title}</strong><small>{article.readMinutes} min ↗</small>
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="writing-archive" aria-labelledby="writing-archive-title">
          <SectionHeading
            eyebrow="Complete archive"
            title="Every published claim remains dated."
            description="Filter the complete record by document type. Later arguments may revise the working model without silently rewriting earlier claims."
          />
          <WritingFilter articles={summaries} />
        </section>
      </div>
    </div>
  );
}
