import { projects, siteUpdatedAt } from "@/content/model";
import { articles } from "@/lib/content";

export const currentUpdatedAt = siteUpdatedAt;

export function getRecentPublications(limit = 8) {
  return [...articles].sort((left, right) => right.publishedAt.localeCompare(left.publishedAt) || left.slug.localeCompare(right.slug)).slice(0, limit);
}

export function getCurrentProjects() { return projects.filter((project) => project.publicPage); }
