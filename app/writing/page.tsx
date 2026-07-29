import type { Metadata } from "next";
import { WritingFilter } from "@/components/writing-filter";
import { articles } from "@/lib/content";

export const metadata: Metadata = { title: "Writing", description: "Essays, engineering reports, architecture records, releases, and design arguments from Ordivon.", alternates: { canonical: "/writing" } };

export default function WritingPage() {
  const summaries = articles.map(({ slug, title, description, type, project, date, readMinutes }) => ({ slug, title, description, type, project, date, readMinutes }));
  return (
    <div className="page-shell page-top writing-page">
      <header className="index-hero"><p className="eyebrow">Writing</p><h1>Dated arguments for systems that keep changing.</h1><p>Repositories own current technical truth. Writing preserves the reasoning, release boundaries, disputes, and revisions that source code alone cannot explain.</p></header>
      <div className="writing-principle"><span>Publishing rule</span><p>Publish when a boundary becomes real—not when another page can be filled.</p></div>
      <WritingFilter articles={summaries} />
    </div>
  );
}
