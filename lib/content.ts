import type { ComponentType } from "react";
import FutureWillNotWait from "@/content/articles/the-future-will-not-wait.mdx";
import LinkEdgeBoundary from "@/content/articles/link-edge-boundary.mdx";
import RuntimeAfterCore from "@/content/articles/runtime-after-core.mdx";
import HostTaskContinuity from "@/content/articles/host-task-continuity.mdx";
import RuntimeRelease from "@/content/articles/ordivon-runtime-release.mdx";
import WhyOrdivon from "@/content/articles/why-ordivon.mdx";
import { articleMetadata, type ArticleMetadata, type ArticleSlug, type TocEntry } from "@/content/articles/registry";

export type { ArticleMetadata, ArticleSlug, TocEntry };
export type Article = ArticleMetadata & { Content: ComponentType };

const articleComponents: Record<ArticleSlug, ComponentType> = {
  "the-future-will-not-wait": FutureWillNotWait,
  "link-edge-boundary": LinkEdgeBoundary,
  "runtime-after-core": RuntimeAfterCore,
  "host-task-continuity": HostTaskContinuity,
  "ordivon-runtime-release": RuntimeRelease,
  "why-ordivon": WhyOrdivon,
};

export const articles: Article[] = articleMetadata.map((article) => ({
  ...article,
  Content: articleComponents[article.slug],
}));

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export const articleTypes = [...new Set(articles.map((article) => article.type))];
