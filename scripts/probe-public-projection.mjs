import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

function fail(message) {
  console.error(message);
  process.exit(2);
}

function git(repo, args) {
  return execFileSync("git", ["-C", repo, ...args], { encoding: "utf8" }).trim();
}

function sha256(source) {
  return `sha256:${createHash("sha256").update(source).digest("hex")}`;
}

function topLevelScalar(source, key) {
  const match = source.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return match ? match[1].trim() : undefined;
}

function topLevelList(source, key) {
  const lines = source.split("\n");
  const start = lines.findIndex((line) => line.trim() === `${key}:`);
  if (start < 0) return [];
  const result = [];
  for (const line of lines.slice(start + 1)) {
    const match = line.match(/^\s{2}-\s+(.+)$/);
    if (match) {
      result.push(match[1].trim());
      continue;
    }
    if (line.trim() === "") continue;
    break;
  }
  return result;
}

function frontmatter(source) {
  if (!source.startsWith("---\n")) return {};
  const end = source.indexOf("\n---\n", 4);
  if (end < 0) return {};
  const result = {};
  for (const line of source.slice(4, end).split("\n")) {
    const match = line.match(/^([A-Za-z0-9_]+):\s*(.+)$/);
    if (match) result[match[1]] = match[2].trim();
  }
  return result;
}

function section(source, heading) {
  const marker = `## ${heading}`;
  const start = source.indexOf(marker);
  if (start < 0) return "";
  const bodyStart = source.indexOf("\n", start) + 1;
  const next = source.indexOf("\n## ", bodyStart);
  return source.slice(bodyStart, next < 0 ? undefined : next).trim();
}

function markdownTableRows(body) {
  return body.split("\n")
    .filter((line) => line.startsWith("|") && !line.includes("---"))
    .slice(1)
    .map((line) => line.slice(1, -1).split("|").map((cell) => cell.trim()))
    .filter((cells) => cells.length >= 2)
    .map(([area, status]) => ({ area, status }));
}

function markdownBullets(body) {
  return body.split("\n").filter((line) => line.startsWith("- ")).map((line) => line.slice(2).trim());
}

function findStatusDocument(repo) {
  for (const relative of ["docs/STATUS.md", "docs/status.md", "STATUS.md", "status.md"]) {
    if (existsSync(resolve(repo, relative))) return relative;
  }
  return undefined;
}

function firstParagraph(body) {
  return body.split(/\n\s*\n/).map((item) => item.replace(/\s+/g, " ").trim()).find(Boolean) || undefined;
}

function publicDocuments(repo, projectSource) {
  return topLevelList(projectSource, "managed_paths")
    .filter((relativePath) => existsSync(resolve(repo, relativePath)))
    .map((relativePath) => {
      const content = readFileSync(resolve(repo, relativePath), "utf8");
      const meta = frontmatter(content);
      return {
        path: relativePath,
        digest: sha256(content),
        id: meta.id,
        type: meta.type,
        lifecycle: meta.lifecycle,
        sourceRole: meta.source_role,
        visibility: meta.visibility,
        updated: meta.updated,
        evidenceStatus: meta.evidence_status,
        readiness: meta.readiness,
      };
    })
    .filter((document) =>
      document.lifecycle === "active" &&
      document.sourceRole === "canonical" &&
      document.visibility === "public" &&
      document.readiness === "READY"
    )
    .sort((left, right) => left.path.localeCompare(right.path));
}

export function probePublicProjection(repoArg) {
  const repo = resolve(repoArg);
  const projectRelativePath = ".ordivon/project.yaml";
  const projectPath = resolve(repo, projectRelativePath);
  if (!existsSync(projectPath)) throw new Error(`${repo}: missing .ordivon/project.yaml`);

  const projectSource = readFileSync(projectPath, "utf8");
  const statusDocument = findStatusDocument(repo);
  if (!statusDocument) throw new Error(`${repo}: no status document found`);
  const statusSource = readFileSync(resolve(repo, statusDocument), "utf8");
  const statusMeta = frontmatter(statusSource);
  const documents = publicDocuments(repo, projectSource);
  const publicPaths = [projectRelativePath, ...documents.map((document) => document.path)];
  const revision = git(repo, ["log", "-1", "--format=%H", "--", ...publicPaths]) || git(repo, ["rev-parse", "HEAD"]);
  const projectManifestDigest = sha256(projectSource);
  const publicSourceDigest = sha256(JSON.stringify({
    projectManifest: { path: projectRelativePath, digest: projectManifestDigest },
    documents: documents.map(({ path, digest }) => ({ path, digest })),
  }));
  const updated = documents.map((document) => document.updated).filter(Boolean).sort().at(-1) || statusMeta.updated;

  const project = {
    id: topLevelScalar(projectSource, "id"),
    name: topLevelScalar(projectSource, "name"),
    repository: topLevelScalar(projectSource, "repository"),
    kind: topLevelScalar(projectSource, "kind"),
    description: topLevelScalar(projectSource, "description"),
    publicProjection: topLevelScalar(projectSource, "public_projection"),
  };
  const source = {
    revision,
    dirty: Boolean(git(repo, ["status", "--porcelain"])),
    publicSourceDigest,
    projectManifestDigest,
    documents,
    statusDocument,
    statusDigest: sha256(statusSource),
    statusId: statusMeta.id,
    statusUpdated: statusMeta.updated,
    lifecycle: statusMeta.lifecycle,
    sourceRole: statusMeta.source_role,
    visibility: statusMeta.visibility,
    updated,
    summary: statusMeta.summary,
    evidenceStatus: statusMeta.evidence_status,
    readiness: statusMeta.readiness,
  };

  const admission = {
    projectionTarget: project.publicProjection === "ordivon-web",
    canonicalStatus: source.sourceRole === "canonical",
    publicStatus: source.visibility === "public",
    readyStatus: source.readiness === "READY",
    publicDocumentSet: source.documents.length > 0,
    clean: !source.dirty,
  };
  admission.accepted = Object.values(admission).every(Boolean);

  const capabilityBody = section(statusSource, "Proven capabilities") || section(statusSource, "Current capabilities");
  const operationalBody = section(statusSource, "Operational");
  const currentStateBody = section(statusSource, "Current state");
  const maturityBody = section(statusSource, "Maturity");
  const removedHeadings = [...statusSource.matchAll(/^## (Removed[^\n]*)$/gm)].map((match) => match[1]);

  return {
    schemaVersion: 1,
    project,
    source,
    admission,
    candidate: {
      maturity: firstParagraph(maturityBody),
      currentState: firstParagraph(currentStateBody),
      capabilities: markdownTableRows(capabilityBody),
      operational: markdownBullets(operationalBody),
      removed: removedHeadings.flatMap((heading) => {
        const body = section(statusSource, heading);
        const bullets = markdownBullets(body);
        return bullets.length ? bullets : [firstParagraph(body)].filter(Boolean);
      }),
    },
  };
}

if (fileURLToPath(import.meta.url) === resolve(process.argv[1] || "")) {
  const repos = process.argv.slice(2);
  if (!repos.length) fail("usage: node scripts/probe-public-projection.mjs <repo> [repo ...]");

  try {
    const projections = repos.map(probePublicProjection);
    console.log(JSON.stringify({ schemaVersion: 1, projections }, null, 2));
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }
}
