import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const CONFIGS = [
  { slug: "harness", projectExport: "harnessProject", boundaryExport: "harnessBoundary", receiptExport: "harnessProjectionReceipt" },
  { slug: "security", projectExport: "securityProject", receiptExport: "securityProjectionReceipt" },
  { slug: "game", projectExport: "gameProject", receiptExport: "gameProjectionReceipt" },
];

function fail(slug, message) {
  throw new Error(`${slug} public projection: ${message}`);
}

function sha256(source) {
  return `sha256:${createHash("sha256").update(source).digest("hex")}`;
}

function allStrings(value, path = "root", result = []) {
  if (typeof value === "string") result.push({ path, value });
  else if (Array.isArray(value)) value.forEach((item, index) => allStrings(item, `${path}[${index}]`, result));
  else if (value && typeof value === "object") Object.entries(value).forEach(([key, item]) => allStrings(item, `${path}.${key}`, result));
  return result;
}

function validateSnapshot(slug, source) {
  if (!source.admission?.accepted) fail(slug, "captured source is not admitted");
  if (!Array.isArray(source.source?.documents) || source.source.documents.length === 0) fail(slug, "captured public envelope is empty");
  for (const document of source.source.documents) {
    if (document.sourceRole !== "canonical" || document.visibility !== "public") {
      fail(slug, `captured envelope contains inadmissible document ${document.path}`);
    }
  }
  const recomputed = sha256(JSON.stringify({
    projectManifest: { path: ".ordivon/project.yaml", digest: source.source.projectManifestDigest },
    authority: { path: source.source.authorityDocument, digest: source.source.authorityDigest, section: source.source.authoritySection },
    documents: source.source.documents.map(({ path, digest, id, type, lifecycle, sourceRole, visibility, updated, evidenceStatus, readiness }) => ({ path, digest, id, type, lifecycle, sourceRole, visibility, updated, evidenceStatus, readiness })),
  }));
  if (recomputed !== source.source.publicSourceDigest) fail(slug, "captured public-source digest is internally inconsistent");
}

function harnessRetiredTerms(source) {
  if (source.project?.id !== "ordivon-harness") return [];
  const terms = new Set();
  for (const item of source.candidate?.removed || []) {
    for (const match of item.matchAll(/`([^`]+)`/g)) terms.add(match[1]);
    for (const phrase of [
      "Host-backed Runner", "TaskContract", "Assignment", "Host compatibility package",
      "Host dependency", "host CLI namespace", "cutover", "Codex/Hermes execution drivers",
    ]) {
      if (item.toLowerCase().includes(phrase.toLowerCase())) terms.add(phrase);
    }
  }
  return [...terms].filter((term) => term.length >= 5);
}

function validateCurrentClaims(slug, source, publication) {
  const retired = harnessRetiredTerms(source);
  if (!retired.length) return;
  const currentClaims = {
    boundary: publication.boundary ? {
      summary: publication.boundary.summary,
      owns: publication.boundary.owns,
    } : undefined,
    project: {
      capability: publication.project.capability,
      latestProof: publication.project.latestProof,
      summary: publication.project.summary,
      evidence: publication.project.evidence,
    },
  };
  const contradictions = [];
  for (const { path, value } of allStrings(currentClaims)) {
    for (const term of retired) {
      if (value.toLowerCase().includes(term.toLowerCase())) contradictions.push(`${path}: asserts retired ${term}`);
    }
  }
  if (contradictions.length) fail(slug, contradictions.join("; "));
}

async function generate(config) {
  const sourcePath = join(ROOT, "content", "projects", `${config.slug}-source.json`);
  const publicationPath = join(ROOT, "content", "projects", `${config.slug}-publication.json`);
  const outputPath = join(ROOT, "content", "projects", `generated-${config.slug}.ts`);
  const source = JSON.parse(await readFile(sourcePath, "utf8"));
  const publication = JSON.parse(await readFile(publicationPath, "utf8"));

  if (source.schemaVersion !== 2 || publication.schemaVersion !== 2) fail(config.slug, "unsupported schema version");
  validateSnapshot(config.slug, source);
  if (source.project?.id !== publication.projectId) fail(config.slug, "project identity mismatch");
  if (source.source?.revision !== publication.sourceRevision) fail(config.slug, "publication was not reviewed against captured public-source revision");
  if (source.source?.publicSourceDigest !== publication.sourceDigest) fail(config.slug, "publication was not reviewed against captured public-source digest");
  if (source.project?.publicProjection !== "ordivon-web") fail(config.slug, "owner did not target Ordivon Web");
  if (!publication.project) fail(config.slug, "missing Web project judgment");
  if (publication.project.slug !== config.slug) fail(config.slug, "publication slug mismatch");
  if (Boolean(publication.boundary) !== Boolean(config.boundaryExport)) fail(config.slug, "boundary shape does not match projection config");

  validateCurrentClaims(config.slug, source, publication);

  const project = {
    ...publication.project,
    title: source.project.name,
    lifecycle: source.source.lifecycle,
    repository: source.project.repository,
    updatedAt: source.source.updated,
  };
  const boundary = publication.boundary ? {
    ...publication.boundary,
    updatedAt: source.source.updated,
  } : undefined;
  const receipt = {
    schemaVersion: 2,
    projectId: source.project.id,
    sourceRevision: source.source.revision,
    publicSourceDigest: source.source.publicSourceDigest,
    authorityDocument: source.source.authorityDocument,
    authorityDigest: source.source.authorityDigest,
    authoritySection: source.source.authoritySection,
    anchorDocument: source.source.anchorDocument,
    anchorDigest: source.source.anchorDigest,
    publicDocuments: source.source.documents.map(({ path, digest, lifecycle, readiness }) => ({ path, digest, lifecycle, readiness })),
    sourceUpdatedAt: source.source.updated,
    evidenceStatus: source.source.evidenceStatus,
    readiness: source.source.readiness,
  };

  const types = config.boundaryExport ? "BoundaryDefinition, ProjectDefinition" : "ProjectDefinition";
  const exports = [];
  if (config.boundaryExport) exports.push(`export const ${config.boundaryExport} = ${JSON.stringify(boundary, null, 2)} as const satisfies BoundaryDefinition;`);
  exports.push(`export const ${config.projectExport} = ${JSON.stringify(project, null, 2)} as const satisfies ProjectDefinition;`);
  exports.push(`export const ${config.receiptExport} = ${JSON.stringify(receipt, null, 2)} as const;`);
  const output = `// Generated by scripts/generate-project-projections.mjs. Do not edit.\nimport type { ${types} } from "../../lib/model/types";\n\n${exports.join("\n\n")}\n`;
  await writeFile(outputPath, output);
  console.log(`project_projection=passed project=${config.slug} revision=${receipt.sourceRevision}`);
}

for (const config of CONFIGS) await generate(config);
