import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { WritingFilter } from "@/components/writing-filter";
import { WritingNetworkExplorer } from "@/components/writing/writing-network";
import { articles } from "@/lib/content";
import { getWritingNetwork } from "@/lib/graph/writing";

export const metadata: Metadata = {
  title: "Writing",
  description: "A network of dated essays, engineering reports, architecture records, releases, and design arguments from Ordivon.",
  alternates: { canonical: "/writing" },
};

export default function WritingPage() {
  const network = getWritingNetwork();
  const summaries = articles.map(({ slug, title, description, type, project, date, readMinutes }) => ({ slug, title, description, type, project, date, readMinutes }));
  return (
    <div className="writing-page page-top">
      <header className="index-hero page-shell">
        <p className="eyebrow">Writing</p>
        <h1>Dated arguments inside a changing research system.</h1>
        <p>Repositories own current technical truth. Writing records why a boundary exists, which evidence changed it, and which later argument extends or corrects the position.</p>
      </header>

      <div className="page-shell">
        <div className="writing-principle"><span>Publishing rule</span><p>Publish when a Question, finding, decision, or boundary becomes worth preserving—not when another page can be filled.</p></div>
        <WritingNetworkExplorer network={network} />

        <section className="writing-archive" aria-labelledby="writing-archive-title">
          <SectionHeading
            index="02"
            eyebrow="Chronological archive"
            title="The network does not replace publication history."
            description="Filter the complete record by document type. Dates remain visible because a later argument may revise the architecture without rewriting the earlier claim."
          />
          <WritingFilter articles={summaries} />
        </section>
      </div>
    </div>
  );
}
