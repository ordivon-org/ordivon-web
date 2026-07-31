import { projects, questions, siteUpdatedAt } from "@/content/model";
import { articles } from "@/lib/content";

export const currentUpdatedAt = siteUpdatedAt;

export function getRecentPublications(limit = 8) {
  return [...articles].sort((left, right) => (right.modifiedDate || right.date).localeCompare(left.modifiedDate || left.date)).slice(0, limit);
}

export function getRecentlyUpdatedQuestions(limit = 6) {
  return [...questions].sort((left, right) => (right.updatedAt || "").localeCompare(left.updatedAt || "")).slice(0, limit);
}

export function getCurrentProjects() { return projects.filter((project) => project.publicPage); }
export function getLatestPublicUpdate() { return getRecentPublications(1)[0]; }
