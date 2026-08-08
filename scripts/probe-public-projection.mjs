import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
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

function firstSection(source, headings) {
  for (const heading of headings) {
    const body = section(source, heading);
    if (body) return { heading, body };
  }
  return { heading: undefined, body: "" };
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

function firstParagraph(body) {
  return body.split(/\n\s*\n/).map((item) => item.replace(/\s+/g, " ").trim()).find(Boolean) || undefined;
}

function findAuthorityDocument(repo, projectSource) {
  const managed = topLevelList(projectSource, "managed_paths");
  const declared = managed.find((item) => /(^|\/)authority\.md$/i.test(item));
  if (declared && existsSync(resolve(repo, declared))) return declared;
  for (const candidate of ["docs/authority.md", "authority.md"]) {
    if (existsSync(resolve(repo, candidate))) return candidate;
  }
  throw new Error(`${repo}: no authority document found`);
}

function localMarkdownLinks(repo, authorityDocument, body) {
  const authorityDir = dirname(resolve(repo, authorityDocument));
  const paths = new Set();
  for (const match of body.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    let target = match[1].trim().replace(/^<|>$/g, "");
    if (!target || target.startsWith("#") || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
    target = target.split("#", 1)[0];
    if (!target) continue;
    const absolute = resolve(authorityDir, target);
    const repoRelative = relative(repo, absolute).replaceAll("\\", "/");
    if (!repoRelative || repoRelative.startsWith("../") || repoRelative === "..") continue;
    if (!existsSync(absolute) || !statSync(absolute).isFile()) continue;
    paths.add(repoRelative);
  }
  return [...paths];
}

function publicDocuments(repo, projectSource) {
  const authorityDocument = findAuthorityDocument(repo, projectSource);
  const authoritySource = readFileSync(resolve(repo, authorityDocument), "utf8");
  const authorityMeta = frontmatter(authoritySource);
  const authoritySection = firstSection(authoritySource, ["Current authority", "Decision"]);
  if (!authoritySection.body) throw new Error(`${repo}: authority document does not declare current sources`);

  const candidates = [authorityDocument, ...localMarkdownLinks(repo, authorityDocument, authoritySection.body)];
  const unique = [...new Set(candidates)];
  const documents = unique
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
      document.visibility === "public"
    )
    .sort((left, right) => left.path.localeCompare(right.path));

  return {
    authorityDocument,
    authorityDigest: sha256(authoritySource),
    authorityMeta,
    authoritySection: authoritySection.heading,
    documents,
  };
}

function chooseAnchorDocument(documents) {
  for (const preferred of ["docs/STATUS.md", "docs/status.md", "STATUS.md", "status.md", "README.md"]) {
    const match = documents.find((document) => document.path === preferred);
    if (match) return match;
  }
  return documents.find((document) => document.type === "start") || documents[0];
}

export function probePublicProjection(repoArg) {
  const repo = resolve(repoArg);
  const projectRelativePath = ".ordivon/project.yaml";
  const projectPath = resolve(repo, projectRelativePath);
  if (!existsSync(projectPath)) throw new Error(`${repo}: missing .ordivon/project.yaml`);

  const projectSource = readFileSync(projectPath, "utf8");
  const envelope = publicDocuments(repo, projectSource);
  const anchor = chooseAnchorDocument(envelope.documents);
  if (!anchor) throw new Error(`${repo}: authority map produced no active canonical public document`);
  const anchorSource = readFileSync(resolve(repo, anchor.path), "utf8");
  const anchorMeta = frontmatter(anchorSource);

  const publicPaths = [projectRelativePath, ...envelope.documents.map((document) => document.path)];
  const revision = git(repo, ["log", "-1", "--format=%H", "--", ...publicPaths]) || git(repo, ["rev-parse", "HEAD"]);
  const projectManifestDigest = sha256(projectSource);
  const publicSourceDigest = sha256(JSON.stringify({
    projectManifest: { path: projectRelativePath, digest: projectManifestDigest },
    authority: { path: envelope.authorityDocument, digest: envelope.authorityDigest, section: envelope.authoritySection },
    documents: envelope.documents.map(({ path, digest }) => ({ path, digest })),
  }));
  const updated = envelope.documents.map((document) => document.updated).filter(Boolean).sort().at(-1) || anchorMeta.updated;

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
    authorityDocument: envelope.authorityDocument,
    authorityDigest: envelope.authorityDigest,
    authoritySection: envelope.authoritySection,
    documents: envelope.documents,
    anchorDocument: anchor.path,
    anchorDigest: anchor.digest,
    anchorId: anchorMeta.id,
    anchorUpdated: anchorMeta.updated,
    lifecycle: anchorMeta.lifecycle,
    sourceRole: anchorMeta.source_role,
    visibility: anchorMeta.visibility,
    updated,
    summary: anchorMeta.summary,
    evidenceStatus: anchorMeta.evidence_status,
    readiness: anchorMeta.readiness,
  };

  const admission = {
    projectionTarget: project.publicProjection === "ordivon-web",
    activeAuthority: envelope.authorityMeta.lifecycle === "active",
    canonicalAuthority: envelope.authorityMeta.source_role === "canonical",
    publicAuthority: envelope.authorityMeta.visibility === "public",
    activeAnchor: source.lifecycle === "active",
    canonicalAnchor: source.sourceRole === "canonical",
    publicAnchor: source.visibility === "public",
    publicDocumentSet: source.documents.length > 0,
    clean: !source.dirty,
  };
  admission.accepted = Object.values(admission).every(Boolean);

  const capabilitySection = firstSection(anchorSource, ["Proven capabilities", "Current capabilities", "Current capability"]);
  const operationalSection = firstSection(anchorSource, ["Operational"]);
  const currentStateSection = firstSection(anchorSource, ["Current state", "Current boundary"]);
  const maturitySection = firstSection(anchorSource, ["Maturity"]);
  const removedHeadings = [...anchorSource.matchAll(/^## (Removed[^\n]*)$/gm)].map((match) => match[1]);

  return {
    schemaVersion: 2,
    project,
    source,
    admission,
    candidate: {
      maturity: firstParagraph(maturitySection.body),
      currentState: firstParagraph(currentStateSection.body),
      capabilities: markdownTableRows(capabilitySection.body),
      capabilityBullets: markdownBullets(capabilitySection.body),
      operational: markdownBullets(operationalSection.body),
      removed: removedHeadings.flatMap((heading) => {
        const body = section(anchorSource, heading);
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
    console.log(JSON.stringify({ schemaVersion: 2, projections }, null, 2));
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }
}
