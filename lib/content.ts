import type { ComponentType } from "react";
import { articleManifest } from "@/content/articles/generated-manifest";
import type { ArticleMetadata, TocEntry } from "@/content/articles/schema";
import type { ArticleSlug } from "@/content/articles/generated-metadata";
import { editorialSelections } from "@/content/editorial/selections";
import { getProjectBySlug, getQuestionBySlug } from "@/content/model";
import { validatePublicationSystem } from "@/lib/publication-validation";

export type { ArticleMetadata, ArticleSlug, TocEntry };
export type Article = ArticleMetadata & { Content: ComponentType };

validatePublicationSystem(articleManifest, editorialSelections);

export const articles: Article[] = articleManifest.map((article) => {
  for (const slug of article.projectSlugs) if (!getProjectBySlug(slug)) throw new Error(`${article.slug} references missing project ${slug}`);
  for (const slug of article.questionSlugs) if (!getQuestionBySlug(slug)) throw new Error(`${article.slug} references missing question ${slug}`);
  return article;
});

export function getArticle(slug: string) { return articles.find((article) => article.slug === slug); }
export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}
export const articleTypes = [...new Set(articles.map((article) => article.type))];
