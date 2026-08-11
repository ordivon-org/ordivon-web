import process from "node:process";
import { boundaries, projects } from "../content/model.ts";
import { probePublicProjection } from "./probe-public-projection.mjs";

function removedTerms(projection) {
  if (projection.project?.id !== "ordivon-harness") return [];
  const terms = new Set();
  for (const item of projection.candidate.removed || []) {
    for (const match of item.matchAll(/`([^`]+)`/g)) terms.add(match[1]);
    for (const phrase of ["Host-backed Runner", "TaskContract", "Assignment", "Host compatibility package", "Host dependency", "host CLI namespace", "cutover", "rollback", "Codex/Hermes execution drivers"]) {
      if (item.toLowerCase().includes(phrase.toLowerCase())) terms.add(phrase);
    }
  }
  return [...terms].filter((term) => term.length >= 5);
}

function allStrings(value, path = "root", result = []) {
  if (typeof value === "string") result.push({ path, value });
  else if (Array.isArray(value)) value.forEach((item, index) => allStrings(item, `${path}[${index}]`, result));
  else if (value && typeof value === "object") Object.entries(value).forEach(([key, item]) => allStrings(item, `${path}.${key}`, result));
  return result;
}

function compare(repoPath) {
  const projection = probePublicProjection(repoPath);
  const slug = projection.project.id?.replace(/^ordivon-/, "");
  const web = projects.find((item) => item.slug === slug);
  const boundary = boundaries.find((item) => item.slug === slug);
  if (!web) throw new Error(`${projection.project.id}: no Web project entry`);

  const mechanical = {
    title: { web: web.title, source: projection.project.name, equal: web.title === projection.project.name },
    repository: { web: web.repository, source: projection.project.repository, equal: web.repository === projection.project.repository },
    lifecycle: { web: web.lifecycle, source: projection.source.lifecycle, equal: web.lifecycle === projection.source.lifecycle },
    updatedAt: { web: web.updatedAt, source: projection.source.updated, equal: web.updatedAt === projection.source.updated },
  };

  const stale = Boolean(projection.source.updated && web.updatedAt && projection.source.updated > web.updatedAt);
  const retired = removedTerms(projection);
  const currentClaims = {
    project: {
      capability: web.capability,
      latestProof: web.latestProof,
      summary: web.summary,
      evidence: web.evidence,
    },
    boundary: boundary ? { summary: boundary.summary, owns: boundary.owns } : undefined,
  };
  const retiredCurrentClaims = [];
  for (const { path, value } of allStrings(currentClaims)) {
    for (const term of retired) {
      if (value.toLowerCase().includes(term.toLowerCase())) retiredCurrentClaims.push({ path, term });
    }
  }

  return {
    project: slug,
    sourceRevision: projection.source.revision,
    sourceEnvelope: {
      digest: projection.source.publicSourceDigest,
      authorityDocument: projection.source.authorityDocument,
      authoritySection: projection.source.authoritySection,
      anchorDocument: projection.source.anchorDocument,
      anchorDigest: projection.source.anchorDigest,
      updated: projection.source.updated,
      sourceRole: projection.source.sourceRole,
      visibility: projection.source.visibility,
      evidenceStatus: projection.source.evidenceStatus,
      readiness: projection.source.readiness,
      documents: projection.source.documents.length,
    },
    mechanical,
    stale,
    retiredCurrentClaims,
    candidate: projection.candidate,
    publicSynthesis: {
      boundary: boundary ? { summary: boundary.summary, thesis: boundary.thesis, question: boundary.question, owns: boundary.owns, boundary: boundary.boundary, updatedAt: boundary.updatedAt } : undefined,
      project: {
        label: web.label,
        problem: web.problem,
        capability: web.capability,
        maturity: web.maturity,
        audience: web.audience,
        latestProof: web.latestProof,
        summary: web.summary,
        state: web.state,
        updatedAt: web.updatedAt,
      },
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
  schemaVersion: 2,
  summary: {
    projects: comparisons.length,
    staleProjects: comparisons.filter((item) => item.stale).map((item) => item.project),
    retiredCurrentClaimProjects: comparisons.filter((item) => item.retiredCurrentClaims.length).map((item) => item.project),
  },
  comparisons,
}, null, 2));
