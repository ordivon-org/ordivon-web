import articleData from "@/content/writing/articles.json";

export type TocEntry = { id: string; label: string };
export type RelatedLink = { href: string; title: string };
export type Article = {
  slug: string;
  title: string;
  kicker: string;
  deck: string;
  description: string;
  meta: string;
  type: string;
  project: string;
  date: string;
  modifiedDate?: string;
  readMinutes: number;
  author: string;
  lead: string;
  toc: TocEntry[];
  bodyHtml: string;
  footerHtml: string;
  relatedHeading: string;
  related: RelatedLink[];
};

export const articles = articleData as Article[];

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
