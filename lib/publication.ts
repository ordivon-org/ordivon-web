import type { ArticleMetadata, ClaimClass, EvidenceLevel } from "@/content/articles/registry";

export const evidenceLabels: Record<EvidenceLevel, string> = {
  E0: "Assertion",
  E1: "Reasoned argument",
  E2: "Observed dogfood",
  E3: "Bounded experiment",
  E4: "Reproducible engineering evidence",
  E5: "External replication or sustained operation",
};

export const claimLabels: Record<ClaimClass, string> = {
  "observed-fact": "Observed fact",
  "experimental-result": "Experimental result",
  "engineering-inference": "Engineering inference",
  "architecture-decision": "Architecture decision",
  thesis: "Thesis",
  forecast: "Forecast",
  aspiration: "Aspiration",
};

export function validatePublications(articles: readonly ArticleMetadata[]) {
  const errors: string[] = [];
  const bySlug = new Map(articles.map((article) => [article.slug, article]));
  const canonicalRecords = new Map<string, string[]>();

  for (const article of articles) {
    if (article.takeaways.length < 3 || article.takeaways.length > 5) errors.push(`${article.slug}: takeaways must contain 3–5 items`);
    if (!article.limitations.length) errors.push(`${article.slug}: limitations must not be empty`);
    if (!/^https:\/\//.test(article.canonicalResearchRecord)) errors.push(`${article.slug}: canonicalResearchRecord must be an https URL`);
    if (article.modifiedDate && article.modifiedDate < article.date) errors.push(`${article.slug}: modifiedDate precedes date`);
    if (article.status === "superseded" && !article.supersededBy) errors.push(`${article.slug}: superseded articles require supersededBy`);
    if (article.supersededBy && !bySlug.has(article.supersededBy)) errors.push(`${article.slug}: supersededBy points to missing article ${article.supersededBy}`);
    if (article.supersedes && !bySlug.has(article.supersedes)) errors.push(`${article.slug}: supersedes points to missing article ${article.supersedes}`);
    if (["E3", "E4", "E5"].includes(article.evidenceLevel) && !article.canonicalResearchRecord) errors.push(`${article.slug}: ${article.evidenceLevel} requires a canonical record`);
    const recordOwners = canonicalRecords.get(article.canonicalResearchRecord) || [];
    recordOwners.push(article.slug);
    canonicalRecords.set(article.canonicalResearchRecord, recordOwners);
  }

  for (const article of articles) {
    const seen = new Set<string>();
    let cursor: ArticleMetadata | undefined = article;
    while (cursor?.supersededBy) {
      if (seen.has(cursor.slug)) { errors.push(`${article.slug}: supersession cycle detected`); break; }
      seen.add(cursor.slug);
      cursor = bySlug.get(cursor.supersededBy);
    }
  }

  if (errors.length) throw new Error(`Publication validation failed:\n- ${errors.join("\n- ")}`);
  return { articleCount: articles.length, canonicalRecordCount: canonicalRecords.size };
}
