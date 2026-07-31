import type { MetadataRoute } from "next";
import { articles } from "@/lib/content";
import { projects } from "@/lib/projects";
import { getResearchQuestions } from "@/lib/research";
import { siteUpdatedAt } from "@/content/model";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://ordivon.com";
  const core = ["", "/system", "/research", "/projects", "/writing", "/now", "/about", "/colophon"]
    .map((path) => ({ url: `${base}${path}`, lastModified: siteUpdatedAt }));
  const projectRoutes = projects.map((project) => ({ url: `${base}/projects/${project.slug}`, lastModified: siteUpdatedAt }));
  const researchRoutes = getResearchQuestions().map((question) => ({ url: `${base}/research/${question.slug}`, lastModified: question.updatedAt }));
  const writingRoutes = articles.map((article) => ({ url: `${base}/writing/${article.slug}`, lastModified: article.modifiedDate || article.date }));
  return [...core, ...researchRoutes, ...projectRoutes, ...writingRoutes];
}
