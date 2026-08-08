import process from "node:process";
import { projects } from "../content/model.ts";
import { probePublicProjection } from "./probe-public-projection.mjs";

function textFields(project) {
  return Object.fromEntries([
    "label", "problem", "capability", "maturity", "latestProof", "summary", "state",
  ].map((key) => [key, typeof project[key] === "string" ? project[key] : ""]));
}

function removedTerms(items) {
  const terms = new Set();
  for (const item of items) {
    for (const match of item.matchAll(/`([^`]+)`/g)) terms.add(match[1]);
    for (const phrase of ["Host-backed Runner", "TaskContract", "Assignment", "Host compatibility package", "Host dependency", "host CLI namespace", "cutover", "rollback", "Codex/Hermes execution drivers"]) {
      if (item.toLowerCase().includes(phrase.toLowerCase())) terms.add(phrase);
    }
  }
  return [...terms].filter((term) => term.length >= 5);
}

function compare(repoPath) {
  const projection = probePublicProjection(repoPath);
  const slug = projection.project.id?.replace(/^ordivon-/, "");
  const web = projects.find((item) => item.slug === slug);
  if (!web) throw new Error(`${projection.project.id}: no Web project entry`);

  const mechanical = {
    title: { web: web.title, source: projection.project.name, equal: web.title === projection.project.name },
    repository: { web: web.repository, source: projection.project.repository, equal: web.repository === projection.project.repository },
    lifecycle: { web: web.lifecycle, source: projection.source.lifecycle, equal: web.lifecycle === projection.source.lifecycle },
    updatedAt: { web: web.updatedAt, source: projection.source.updated, equal: web.updatedAt === projection.source.updated },
  };

  const stale = Boolean(projection.source.updated && web.updatedAt && projection.source.updated > web.updatedAt);
  const fields = textFields(web);
  const retiredTerms = removedTerms(projection.candidate.removed || []);
  const retiredReferences = [];
  for (const [field, value] of Object.entries(fields)) {
    for (const term of retiredTerms) {
      if (value.toLowerCase().includes(term.toLowerCase())) retiredReferences.push({ field, term });
    }
  }

  return {
    project: slug,
    sourceRevision: projection.source.revision,
    sourceStatus: {
      document: projection.source.statusDocument,
      digest: projection.source.statusDigest,
      updated: projection.source.updated,
      sourceRole: projection.source.sourceRole,
      visibility: projection.source.visibility,
      evidenceStatus: projection.source.evidenceStatus,
      readiness: projection.source.readiness,
    },
    mechanical,
    stale,
    retiredReferences,
    candidate: projection.candidate,
    editorial: {
      label: web.label,
      problem: web.problem,
      capability: web.capability,
      maturity: web.maturity,
      audience: web.audience,
      latestProof: web.latestProof,
      summary: web.summary,
      state: web.state,
    },
  };
}

const repos = process.argv.slice(2);
if (!repos.length) {
  console.error("usage: node --experimental-strip-types scripts/compare-public-projection.mjs <repo> [repo ...]");
  process.exit(2);
}

const comparisons = repos.map(compare);
console.log(JSON.stringify({
  schemaVersion: 1,
  summary: {
    projects: comparisons.length,
    staleProjects: comparisons.filter((item) => item.stale).map((item) => item.project),
    retiredReferenceProjects: comparisons.filter((item) => item.retiredReferences.length).map((item) => item.project),
  },
  comparisons,
}, null, 2));
