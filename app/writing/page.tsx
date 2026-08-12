import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { WritingFilter } from "@/components/writing-filter";
import { articles, getArticle } from "@/lib/content";
import { getWritingTopics } from "@/lib/writing";
import { editorialSelections } from "@/content/editorial/selections";

export const metadata: Metadata = {
  title: "Writing",
  description: "Essays, experiments, architecture decisions, and release reports about durable AI agent work.",
  alternates: { canonical: "/writing" },
};

export default function WritingPage() {
  const topics = getWritingTopics();
  const flagship = getArticle(editorialSelections.writing.startHere);
  const evidenceReports = editorialSelections.writing.evidenceReports.map(getArticle);
  if (!flagship || evidenceReports.some((article) => !article)) throw new Error("writing editorial selection is incomplete");
  const summaries = articles.map(({ slug, title, description, type, project, publishedAt, revisedAt, readMinutes, status }) => ({ slug, title, description, type, project, publishedAt, revisedAt, readMinutes, status }));
  const researchReports = articles.filter((article) => article.type === "Research report").length;
  const engineeringRecords = articles.filter((article) => ["Engineering report", "Architecture report", "Architecture guide", "Architecture decision", "Architecture correction", "Release", "Release note"].includes(article.type)).length;
  const essaysAndNotes = articles.length - researchReports - engineeringRecords;

  return (
    <div className="writing-page page-top">
      <header className="index-hero page-shell">
        <p className="eyebrow">Writing</p>
        <h1>Understand the work before learning the vocabulary.</h1>
        <p>Start with a concrete failure, follow the smallest mechanism that explains it, then descend into exact experiments, architecture, and the complete dated record.</p>
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
            {editorialSelections.writing.readingPaths.map((path, index) => (
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

        <div className="writing-principle"><span>Explanation rule</span><p>Start with what happened and why it matters. Add only the causal distinctions needed for the next judgment, bind strong claims to exact evidence, and state what the result does not prove.</p></div>

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
