import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { WritingFilter } from "@/components/writing-filter";
import { articles } from "@/lib/content";
import { getWritingTopics } from "@/lib/writing";

export const metadata: Metadata = {
  title: "Writing",
  description: "Dated essays, research reports, engineering records, releases, and focused notes from Ordivon.",
  alternates: { canonical: "/writing" },
};

export default function WritingPage() {
  const topics = getWritingTopics();
  const projectAreas = new Set(articles.flatMap((article) => article.projectSlugs)).size;
  const documentedQuestions = new Set(articles.flatMap((article) => article.questionSlugs)).size;
  const summaries = articles.map(({ slug, title, description, type, project, date, readMinutes }) => ({ slug, title, description, type, project, date, readMinutes }));

  return (
    <div className="writing-page page-top">
      <header className="index-hero page-shell">
        <p className="eyebrow">Writing</p>
        <h1>Dated arguments, not a second fact database.</h1>
        <p>Each publication carries a complete claim, evidence links, limitations, and next falsifier. Project and Question metadata provide navigation; repositories remain authoritative for exact technical truth.</p>
        <dl className="writing-summary" aria-label="Writing summary">
          <div><dt>Publications</dt><dd>{articles.length}</dd></div>
          <div><dt>Project areas</dt><dd>{projectAreas}</dd></div>
          <div><dt>Documented Questions</dt><dd>{documentedQuestions}</dd></div>
        </dl>
      </header>

      <div className="page-shell">
        <div className="writing-principle"><span>Publishing rule</span><p>Publish when a Question, boundary, experiment, or release becomes worth preserving—not when another graph object can be created.</p></div>

        <section className="writing-topics" aria-labelledby="writing-topics-title">
          <SectionHeading
            eyebrow="Browse by Question"
            title="Start from the uncertainty, then read the complete arguments."
            description="Topics are derived from article metadata. No separate relation registry decides what matters."
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
            eyebrow="Chronological archive"
            title="Publication history remains explicit."
            description="Filter the complete record by document type. Later arguments can revise the working model without rewriting earlier claims."
          />
          <WritingFilter articles={summaries} />
        </section>
      </div>
    </div>
  );
}
