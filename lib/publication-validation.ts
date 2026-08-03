import type { ArticleMetadata } from "@/content/articles/schema";

export type EditorialArticleSelections = {
  home: { proof: string; recentArguments: readonly string[] };
  writing: {
    startHere: string;
    evidenceReports: readonly string[];
    readingPaths: readonly { slugs: readonly string[] }[];
  };
  research: { architectureChangingExperiment: string };
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const DOCUMENT_ID = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;

export function validatePublicationSystem(articles: readonly ArticleMetadata[], selections: EditorialArticleSelections) {
  const errors: string[] = [];
  const bySlug = new Map(articles.map((article) => [article.slug, article]));

  for (const article of articles) {
    if (article.documentId && !DOCUMENT_ID.test(article.documentId)) errors.push(`${article.slug}: invalid documentId`);
    if (article.documentId && article.sourceRole !== "derived") errors.push(`${article.slug}: identified Web articles must declare sourceRole derived`);
    if (article.sourceRole && !article.documentId) errors.push(`${article.slug}: sourceRole requires documentId`);
    if (!ISO_DATE.test(article.publishedAt)) errors.push(`${article.slug}: publishedAt must be YYYY-MM-DD`);
    if (article.revisedAt && !ISO_DATE.test(article.revisedAt)) errors.push(`${article.slug}: revisedAt must be YYYY-MM-DD`);
    if (article.revisedAt && article.revisedAt < article.publishedAt) errors.push(`${article.slug}: revisedAt precedes publishedAt`);
    if (!article.takeaways.length) errors.push(`${article.slug}: at least one takeaway is required`);
    if (!article.limitations.length) errors.push(`${article.slug}: at least one limitation is required`);
    if (article.canonicalResearchRecord && !article.canonicalResearchRecord.startsWith("https://")) errors.push(`${article.slug}: canonicalResearchRecord must use https`);
    if (["E3", "E4", "E5"].includes(article.evidenceLevel) && !article.canonicalResearchRecord) errors.push(`${article.slug}: ${article.evidenceLevel} requires a canonical research record`);
    if (article.status === "superseded" && !article.supersededBy) errors.push(`${article.slug}: superseded articles require supersededBy`);
    if (article.supersededBy && !bySlug.has(article.supersededBy)) errors.push(`${article.slug}: missing supersededBy target ${article.supersededBy}`);
    if (article.supersedes && !bySlug.has(article.supersedes)) errors.push(`${article.slug}: missing supersedes target ${article.supersedes}`);
    if (!article.toc.length) errors.push(`${article.slug}: no h2 headings were available for the table of contents`);
    const tocIds = article.toc.map((entry) => entry.id);
    if (tocIds.length !== new Set(tocIds).size) errors.push(`${article.slug}: duplicate table-of-contents ids`);
  }

  for (const article of articles) {
    const seen = new Set<string>();
    let cursor: ArticleMetadata | undefined = article;
    while (cursor?.supersededBy) {
      if (seen.has(cursor.slug)) { errors.push(`${article.slug}: supersession cycle`); break; }
      seen.add(cursor.slug);
      cursor = bySlug.get(cursor.supersededBy);
    }
  }

  const selectedSlugs = [
    selections.home.proof,
    ...selections.home.recentArguments,
    selections.writing.startHere,
    ...selections.writing.evidenceReports,
    ...selections.writing.readingPaths.flatMap((path) => path.slugs),
    selections.research.architectureChangingExperiment,
  ];
  for (const slug of selectedSlugs) {
    const article = bySlug.get(slug);
    if (!article) errors.push(`editorial selection points to missing article ${slug}`);
    else if (article.status === "superseded") errors.push(`editorial selection points to superseded article ${slug}`);
  }
  const proof = bySlug.get(selections.home.proof);
  if (proof && !["E3", "E4", "E5"].includes(proof.evidenceLevel)) errors.push("home proof must be supported by E3 or higher evidence");

  if (errors.length) throw new Error(`Publication validation failed:\n- ${errors.join("\n- ")}`);
  return { articleCount: articles.length, selectionCount: selectedSlugs.length };
}
