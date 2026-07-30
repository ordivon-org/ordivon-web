import type { MetadataRoute } from "next";
import { articles } from "@/lib/content";
import { projects } from "@/lib/projects";
import { getResearchQuestions } from "@/lib/graph/research";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://ordivon.com";
  const core = ["", "/system", "/research", "/projects", "/writing", "/now", "/about", "/colophon"].map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : .7 }));
  const projectRoutes = projects.map((project) => ({ url: `${base}/projects/${project.slug}`, changeFrequency: "weekly" as const, priority: .8 }));
  const researchRoutes = getResearchQuestions().map((question) => ({ url: `${base}/research/${question.slug}`, lastModified: question.updatedAt, changeFrequency: "weekly" as const, priority: .8 }));
  const writingRoutes = articles.map((article) => ({ url: `${base}/writing/${article.slug}`, lastModified: article.date, changeFrequency: "monthly" as const, priority: .7 }));
  return [...core, ...researchRoutes, ...projectRoutes, ...writingRoutes];
}
