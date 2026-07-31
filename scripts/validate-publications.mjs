import { editorialSelections } from "../content/editorial/selections.ts";
import { validatePublicationSystem } from "../lib/publication-validation.ts";
import { readArticleSources } from "./article-sources.mjs";

try {
  const sources = await readArticleSources();
  const result = validatePublicationSystem(sources.map((article) => article.metadata), editorialSelections);
  console.log(`publication_contract=passed articles=${result.articleCount} selections=${result.selectionCount}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
