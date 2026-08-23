import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

import { probePublicProjection } from "./probe-public-projection.mjs";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = resolve(SCRIPT_DIR, "..");
const CAPTURE_ROOT = resolve(WEB_ROOT, "content/projects");

function defaultProjectsRoot() {
  try {
    const commonGitDirectory = execFileSync(
      "git",
      ["-C", WEB_ROOT, "rev-parse", "--path-format=absolute", "--git-common-dir"],
      { encoding: "utf8" },
    ).trim();
    return resolve(dirname(commonGitDirectory), "..");
  } catch {
    return resolve(WEB_ROOT, "..");
  }
}

const DEFAULT_PROJECTS_ROOT = defaultProjectsRoot();

function fail(message) {
  console.error(message);
  process.exit(2);
}

function parseArgs(argv) {
  let projectsRoot = DEFAULT_PROJECTS_ROOT;
  let requireCurrent = false;
  const explicitRepositories = new Map();
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--require-current") {
      requireCurrent = true;
      continue;
    }
    if (argument === "--projects-root") {
      const value = argv[index + 1];
      if (!value) throw new Error("--projects-root requires PATH");
      projectsRoot = resolve(value);
      index += 1;
      continue;
    }
    if (argument === "--repo") {
      const value = argv[index + 1];
      if (!value) throw new Error("--repo requires PROJECT_ID=PATH");
      const separator = value.indexOf("=");
      if (separator <= 0 || separator === value.length - 1) {
        throw new Error("--repo requires PROJECT_ID=PATH");
      }
      explicitRepositories.set(value.slice(0, separator), resolve(value.slice(separator + 1)));
      index += 1;
      continue;
    }
    throw new Error(`unknown argument: ${argument}`);
  }
  return { projectsRoot, explicitRepositories, requireCurrent };
}

async function capturedSources() {
  const names = (await readdir(CAPTURE_ROOT))
    .filter((name) => name.endsWith("-source.json"))
    .sort();
  const results = [];
  for (const name of names) {
    const value = JSON.parse(await readFile(resolve(CAPTURE_ROOT, name), "utf8"));
    if (!value?.project?.id || !value?.source?.publicSourceDigest) continue;
    results.push({ slug: name.slice(0, -"-source.json".length), value });
  }
  return results;
}

function capturedProjection(slug, captured) {
  return {
    slug,
    projectId: captured.project.id,
    sourceRevision: captured.source.revision,
    publicSourceDigest: captured.source.publicSourceDigest,
    sourceUpdatedAt: captured.source.updated,
    dependencyCount: captured.source.documents?.length ?? null,
  };
}

function observedProjection(observed) {
  return {
    sourceRevision: observed.source.revision,
    publicSourceDigest: observed.source.publicSourceDigest,
    sourceUpdatedAt: observed.source.updated,
    dependencyCount: observed.source.documents.length,
    admissionAccepted: observed.admission.accepted,
    dirty: observed.source.dirty,
    authorityDocument: observed.source.authorityDocument,
  };
}

export async function reportAgentWebCurrentness(argv = []) {
  const { projectsRoot, explicitRepositories, requireCurrent } = parseArgs(argv);
  const projects = [];
  for (const { slug, value: captured } of await capturedSources()) {
    const projectId = captured.project.id;
    const repository = explicitRepositories.get(projectId) ?? resolve(projectsRoot, projectId);
    const base = {
      slug,
      projectId,
      repository,
      truthRole: "public-source-review-obligation-projection",
      basis: "admitted-canonical-public-document-envelope",
      semanticApplicability: "not-evaluated",
      rule: (
        "This command compares Web's reviewed source envelope with the owner's currently admitted " +
        "canonical public-document envelope. A changed envelope creates a Web review obligation; " +
        "it does not prove the published explanation is semantically stale or must be mutated. " +
        "Unrelated owner HEAD changes are outside this comparison."
      ),
      captured: capturedProjection(slug, captured),
    };

    if (!existsSync(repository)) {
      projects.push({
        ...base,
        envelopeRelation: "unknown",
        sourceEnvelopeRevalidated: false,
        reviewObligation: "unknown",
        publicationMutationRequired: "not-evaluated",
        issue: "owner-repository-unavailable",
        observed: null,
      });
      continue;
    }

    try {
      const observed = probePublicProjection(repository);
      const admissionAccepted = observed.admission.accepted === true;
      const sameDigest = captured.source.publicSourceDigest === observed.source.publicSourceDigest;
      const envelopeRelation = admissionAccepted ? (sameDigest ? "unchanged" : "changed") : "unknown";
      projects.push({
        ...base,
        envelopeRelation,
        sourceEnvelopeRevalidated: admissionAccepted,
        reviewObligation: envelopeRelation === "changed" ? "required" : envelopeRelation === "unchanged" ? "none" : "unknown",
        publicationMutationRequired: "not-evaluated",
        issue: admissionAccepted ? null : "observed-public-envelope-not-admitted",
        observed: observedProjection(observed),
      });
    } catch (error) {
      projects.push({
        ...base,
        envelopeRelation: "unknown",
        sourceEnvelopeRevalidated: false,
        reviewObligation: "unknown",
        publicationMutationRequired: "not-evaluated",
        issue: error instanceof Error ? error.message : String(error),
        observed: null,
      });
    }
  }

  return {
    schemaVersion: 1,
    kind: "ordivon.web.agent-context-currentness",
    truthRole: "derived-read-only-currentness-projection",
    authority: {
      publicationProjectionOwner: "ordivon-web",
      currentnessSource: "owner-admitted-canonical-public-document-envelope",
      rule: (
        "Web owns the review obligation and publication judgment. Owner repositories still own " +
        "their implementation, research, deployment, and live-state truth."
      ),
    },
    projectsRoot,
    projects,
    summary: {
      unchanged: projects.filter((project) => project.envelopeRelation === "unchanged").map((project) => project.projectId),
      changed: projects.filter((project) => project.envelopeRelation === "changed").map((project) => project.projectId),
      unknown: projects.filter((project) => project.envelopeRelation === "unknown").map((project) => project.projectId),
      reviewRequired: projects.filter((project) => project.reviewObligation === "required").map((project) => project.projectId),
    },
    admission: {
      mode: requireCurrent ? "promotion-preflight" : "report-only",
      accepted: !requireCurrent || projects.every((project) => project.envelopeRelation === "unchanged"),
      rule: requireCurrent
        ? "Promotion preflight fails closed unless every source-projected owner envelope is currently revalidated and unchanged. A changed envelope requires Web review/rebind; an unknown envelope cannot authorize promotion."
        : "Report-only mode does not authorize or block promotion.",
    },
  };
}

if (fileURLToPath(import.meta.url) === resolve(process.argv[1] || "")) {
  try {
    const report = await reportAgentWebCurrentness(process.argv.slice(2));
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    if (report.admission.mode === "promotion-preflight" && report.admission.accepted !== true) {
      process.exitCode = 2;
    }
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }
}
