import { articleMetadata } from "../content/articles/registry.ts";
import { editorialSelections } from "../content/editorial/selections.ts";

const errors = [];
const bySlug = new Map(articleMetadata.map((article) => [article.slug, article]));

for (const article of articleMetadata) {
  if (article.takeaways.length < 3 || article.takeaways.length > 5) errors.push(`${article.slug}: takeaways must contain 3–5 items`);
  if (!article.limitations.length) errors.push(`${article.slug}: limitations must not be empty`);
  if (!article.canonicalResearchRecord.startsWith("https://")) errors.push(`${article.slug}: canonicalResearchRecord must use https`);
  if (article.modifiedDate && article.modifiedDate < article.date) errors.push(`${article.slug}: modifiedDate precedes date`);
  if (article.status === "superseded" && !article.supersededBy) errors.push(`${article.slug}: superseded articles require supersededBy`);
  if (article.supersededBy && !bySlug.has(article.supersededBy)) errors.push(`${article.slug}: missing supersededBy target ${article.supersededBy}`);
  if (article.supersedes && !bySlug.has(article.supersedes)) errors.push(`${article.slug}: missing supersedes target ${article.supersedes}`);
}

for (const article of articleMetadata) {
  const seen = new Set();
  let cursor = article;
  while (cursor.supersededBy) {
    if (seen.has(cursor.slug)) { errors.push(`${article.slug}: supersession cycle`); break; }
    seen.add(cursor.slug);
    const next = bySlug.get(cursor.supersededBy);
    if (!next) break;
    cursor = next;
  }
}

const selectedSlugs = [
  editorialSelections.homeProof,
  editorialSelections.writing.startHere,
  ...editorialSelections.writing.evidenceReports,
  ...editorialSelections.writing.readingPaths.flatMap((path) => path.slugs),
  editorialSelections.research.architectureChangingExperiment,
  ...Object.values(editorialSelections.canonicalStatements),
];
for (const slug of selectedSlugs) {
  const article = bySlug.get(slug);
  if (!article) errors.push(`editorial selection points to missing article ${slug}`);
  else if (article.status === "superseded") errors.push(`editorial selection points to superseded article ${slug}`);
}
const proof = bySlug.get(editorialSelections.homeProof);
if (proof && !["E3", "E4", "E5"].includes(proof.evidenceLevel)) errors.push("homeProof must be supported by E3 or higher evidence");

if (errors.length) {
  console.error(`Publication validation failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log(`publication_contract=passed articles=${articleMetadata.length} selections=${selectedSlugs.length}`);
