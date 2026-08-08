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

function topLevelScalar(source, key) {
  const match = source.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return match ? match[1].trim() : undefined;
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

export function probePublicProjection(repoArg) {
  const repo = resolve(repoArg);
  const projectPath = resolve(repo, ".ordivon/project.yaml");
  if (!existsSync(projectPath)) throw new Error(`${repo}: missing .ordivon/project.yaml`);

  const projectSource = readFileSync(projectPath, "utf8");
  const statusDocument = findStatusDocument(repo);
  if (!statusDocument) throw new Error(`${repo}: no status document found`);
  const statusSource = readFileSync(resolve(repo, statusDocument), "utf8");
  const meta = frontmatter(statusSource);

  const project = {
    id: topLevelScalar(projectSource, "id"),
    name: topLevelScalar(projectSource, "name"),
    repository: topLevelScalar(projectSource, "repository"),
    kind: topLevelScalar(projectSource, "kind"),
    description: topLevelScalar(projectSource, "description"),
    publicProjection: topLevelScalar(projectSource, "public_projection"),
  };
  const source = {
    revision: git(repo, ["rev-parse", "HEAD"]),
    dirty: Boolean(git(repo, ["status", "--porcelain"])),
    statusDocument,
    statusDigest: `sha256:${createHash("sha256").update(statusSource).digest("hex")}`,
    statusId: meta.id,
    lifecycle: meta.lifecycle,
    sourceRole: meta.source_role,
    visibility: meta.visibility,
    updated: meta.updated,
    summary: meta.summary,
    evidenceStatus: meta.evidence_status,
    readiness: meta.readiness,
  };

  const admission = {
    projectionTarget: project.publicProjection === "ordivon-web",
    canonical: source.sourceRole === "canonical",
    public: source.visibility === "public",
    ready: source.readiness === "READY",
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
