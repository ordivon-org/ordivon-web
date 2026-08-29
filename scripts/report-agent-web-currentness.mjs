import { execFile, execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { promisify } from "node:util";

import { probePublicProjection } from "./probe-public-projection.mjs";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = resolve(SCRIPT_DIR, "..");
const CAPTURE_ROOT = resolve(WEB_ROOT, "content/projects");
const execFileAsync = promisify(execFile);

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

function observedProjection(observed, sourceReview = null) {
  return {
    sourceRevision: observed.source.revision,
    publicSourceDigest: observed.source.publicSourceDigest,
    sourceUpdatedAt: observed.source.updated,
    dependencyCount: observed.source.documents.length,
    admissionAccepted: observed.admission.accepted,
    dirty: observed.source.dirty,
    authorityDocument: observed.source.authorityDocument,
    sourceReview,
  };
}

function witnessRelation(capturedDigest, projection) {
  if (!projection || projection.admission.accepted !== true) return "unknown";
  return projection.source.publicSourceDigest === capturedDigest ? "unchanged" : "changed";
}

export function composeSourceReviewWitnesses(
  capturedDigest,
  localProjection,
  remoteProjection,
  { localPublicRevisionRelationToRemote = null } = {},
) {
  let localRelation = witnessRelation(capturedDigest, localProjection);
  const remoteRelation = witnessRelation(capturedDigest, remoteProjection);
  if (
    localRelation === "changed" &&
    remoteRelation === "unchanged" &&
    localPublicRevisionRelationToRemote === "behind"
  ) {
    localRelation = "superseded";
  }
  const changed = localRelation === "changed" || remoteRelation === "changed";
  const unknown = localRelation === "unknown" || remoteRelation === "unknown";
  return {
    envelopeRelation: changed ? "changed" : unknown ? "unknown" : "unchanged",
    sourceEnvelopeRevalidated: !unknown,
    reviewObligation: changed ? "required" : unknown ? "unknown" : "none",
    localRelation,
    remoteRelation,
    localPublicRevisionRelationToRemote,
  };
}

function git(repository, args, options = {}) {
  return execFileSync("git", ["-C", repository, ...args], {
    encoding: "utf8",
    timeout: 20_000,
    ...options,
  }).trim();
}

function gitIsAncestor(repository, ancestor, descendant) {
  try {
    execFileSync("git", ["-C", repository, "merge-base", "--is-ancestor", ancestor, descendant], {
      encoding: "utf8",
      timeout: 20_000,
      stdio: ["ignore", "ignore", "ignore"],
    });
    return true;
  } catch (error) {
    if (error && typeof error === "object" && "status" in error && error.status === 1) return false;
    throw error;
  }
}

function localPublicRevisionRelationToRemote(repository, localRevision, remoteRevision) {
  if (!localRevision || !remoteRevision) return "unknown";
  if (localRevision === remoteRevision) return "equal";
  try {
    git(repository, ["cat-file", "-e", `${localRevision}^{commit}`]);
    git(repository, ["cat-file", "-e", `${remoteRevision}^{commit}`]);
    if (gitIsAncestor(repository, localRevision, remoteRevision)) return "behind";
    if (gitIsAncestor(repository, remoteRevision, localRevision)) return "ahead";
    return "divergent";
  } catch {
    return "unknown";
  }
}

function projectRepository(repository) {
  const manifest = readFileSync(resolve(repository, ".ordivon/project.yaml"), "utf8");
  const match = manifest.match(/^repository:\s*(.+)$/m);
  if (!match) throw new Error("owner project manifest does not declare repository identity");
  return match[1].trim();
}

function normalizeRepositoryIdentity(value, baseRepository = process.cwd()) {
  const raw = String(value ?? "").trim().replace(/\/$/, "");
  if (!raw) throw new Error("owner repository identity is empty");
  const scp = raw.match(/^git@([^:]+):(.+)$/i);
  if (scp) return `https://${scp[1].toLowerCase()}/${scp[2].replace(/\.git$/i, "")}`;
  if (/^ssh:\/\//i.test(raw)) {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    const path = url.pathname.replace(/^\//, "").replace(/\.git$/i, "");
    return `https://${host}/${path}`;
  }
  if (/^https?:\/\//i.test(raw)) {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    const path = url.pathname.replace(/^\//, "").replace(/\.git$/i, "").replace(/\/$/, "");
    return `https://${host}/${path}`;
  }
  if (/^file:\/\//i.test(raw)) return resolve(new URL(raw).pathname);
  return resolve(baseRepository, raw);
}

function requireReviewedRepositoryIdentity(repository, expectedRepository) {
  if (expectedRepository == null) throw new Error("reviewed Web repository identity is required");
  const declaredIdentity = normalizeRepositoryIdentity(projectRepository(repository), repository);
  const expectedIdentity = normalizeRepositoryIdentity(expectedRepository, repository);
  if (declaredIdentity !== expectedIdentity) {
    throw new Error(`owner manifest repository identity ${declaredIdentity} differs from reviewed Web identity ${expectedIdentity}`);
  }
  return { declared: declaredIdentity, expected: expectedIdentity, locator: String(expectedRepository).trim() };
}

async function remoteDefaultBranch(reviewedLocator, expectedIdentity) {
  const locator = String(reviewedLocator ?? "").trim();
  if (!locator) throw new Error("reviewed Web repository locator is unavailable");
  const locatorIdentity = normalizeRepositoryIdentity(locator);
  if (locatorIdentity !== expectedIdentity) {
    throw new Error(`reviewed repository locator ${locatorIdentity} differs from reviewed Web identity ${expectedIdentity}`);
  }
  const { stdout } = await execFileAsync(
    "git", ["ls-remote", "--symref", locator, "HEAD"],
    { encoding: "utf8", timeout: 20_000 },
  );
  const output = stdout.trim();
  const symbolic = output.split("\n").find((line) => line.startsWith("ref: refs/heads/") && line.endsWith("\tHEAD"));
  const head = output.split("\n").find((line) => /^[0-9a-f]{40,64}\tHEAD$/.test(line));
  if (!symbolic || !head) throw new Error(`reviewed source repository default branch is unavailable from ${expectedIdentity}`);
  const branch = symbolic.slice("ref: refs/heads/".length, -"\tHEAD".length);
  const revision = head.split("\t", 1)[0];
  return { branch, revision, locator, repositoryIdentity: expectedIdentity };
}

function reviewedTransportLocators(repository, reviewed) {
  const candidates = [];
  try {
    const localOrigin = git(repository, ["remote", "get-url", "origin"]);
    if (localOrigin && normalizeRepositoryIdentity(localOrigin, repository) === reviewed.expected) {
      candidates.push({ locator: localOrigin, route: "identity-equivalent-local-origin" });
    }
  } catch {
    // Local origin is optional transport only.
  }
  if (!candidates.some((candidate) => candidate.locator === reviewed.locator)) {
    candidates.push({ locator: reviewed.locator, route: "reviewed-project-repository" });
  }
  return candidates;
}

function semanticRemoteObservationError(error) {
  const message = error instanceof Error ? error.message : String(error);
  return /reviewed source branch moved|reviewed remote manifest repository identity|reviewed remote public envelope is not source-admitted/.test(message);
}

async function probeReviewedRepositoryProjectionViaTransport(repository, reviewed, transport, localSourceRevision = null) {
  const reviewedRemote = await remoteDefaultBranch(transport.locator, reviewed.expected);
  const localHead = git(repository, ["rev-parse", "HEAD"]);

  // Fast path: an exact checkout plus a clean projection-input set already carries
  // the same bytes as the freshly observed Web-reviewed repository horizon.
  if (localHead === reviewedRemote.revision) {
    const localProjection = probePublicProjection(repository);
    if (localProjection.admission.accepted === true) {
      const finalRemote = await remoteDefaultBranch(transport.locator, reviewed.expected);
      if (finalRemote.branch !== reviewedRemote.branch || finalRemote.revision !== reviewedRemote.revision) {
        throw new Error(
          `reviewed source branch moved during projection observation: ${reviewedRemote.branch}@${reviewedRemote.revision} -> ${finalRemote.branch}@${finalRemote.revision}`,
        );
      }
      return {
        projection: localProjection,
        sourceReview: {
          branch: reviewedRemote.branch,
          remoteHeadRevision: reviewedRemote.revision,
          localHeadRevision: localHead,
          repositoryIdentity: reviewed.expected,
          repositoryLocator: reviewed.locator,
          transportRoute: transport.route,
          observation: "reviewed-remote-head-matches-clean-local-source",
          remoteFreshnessObserved: true,
          localPublicRevisionRelationToRemote: localPublicRevisionRelationToRemote(
            repository,
            localSourceRevision,
            localProjection.source.revision,
          ),
        },
      };
    }
  }

  // Divergence is not automatic semantic staleness. Clone through an identity-equivalent
  // transport with complete branch history, using the local owner checkout only as an
  // object cache. Authority remains the reviewed repository identity.
  const root = mkdtempSync(join(tmpdir(), "ordivon-web-owner-currentness-"));
  const clone = join(root, "repo");
  try {
    await execFileAsync(
      "git",
      [
        "clone", "--quiet", "--no-checkout", "--single-branch", "--no-tags",
        "--branch", reviewedRemote.branch, "--reference-if-able", repository,
        transport.locator, clone,
      ],
      { encoding: "utf8", timeout: 60_000 },
    );
    const cloneHead = git(clone, ["rev-parse", "HEAD"]);
    if (cloneHead !== reviewedRemote.revision) {
      throw new Error(
        `reviewed source branch moved during materialization: ${reviewedRemote.branch}@${reviewedRemote.revision} -> ${cloneHead}`,
      );
    }
    git(clone, ["checkout", "--quiet", "--detach", cloneHead]);
    const finalRemote = await remoteDefaultBranch(transport.locator, reviewed.expected);
    if (finalRemote.branch !== reviewedRemote.branch || finalRemote.revision !== reviewedRemote.revision) {
      throw new Error(
        `reviewed source branch moved during projection observation: ${reviewedRemote.branch}@${reviewedRemote.revision} -> ${finalRemote.branch}@${finalRemote.revision}`,
      );
    }
    const projection = probePublicProjection(clone);
    if (projection.admission.accepted !== true) {
      throw new Error("reviewed remote public envelope is not source-admitted");
    }
    const remoteManifestIdentity = normalizeRepositoryIdentity(projectRepository(clone), clone);
    if (remoteManifestIdentity !== reviewed.expected) {
      throw new Error(
        `reviewed remote manifest repository identity ${remoteManifestIdentity} differs from reviewed Web identity ${reviewed.expected}`,
      );
    }
    return {
      projection,
      sourceReview: {
        branch: reviewedRemote.branch,
        remoteHeadRevision: cloneHead,
        localHeadRevision: localHead,
        repositoryIdentity: reviewed.expected,
        repositoryLocator: reviewed.locator,
        transportRoute: transport.route,
        observation: "disposable-full-history-observer-of-web-reviewed-repository",
        remoteFreshnessObserved: true,
        localPublicRevisionRelationToRemote: localPublicRevisionRelationToRemote(
          clone,
          localSourceRevision,
          projection.source.revision,
        ),
      },
    };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

export async function probeReviewedRepositoryProjection(repository, { expectedRepository, localSourceRevision = null } = {}) {
  const reviewed = requireReviewedRepositoryIdentity(repository, expectedRepository);
  const failures = [];
  for (const transport of reviewedTransportLocators(repository, reviewed)) {
    try {
      return await probeReviewedRepositoryProjectionViaTransport(repository, reviewed, transport, localSourceRevision);
    } catch (error) {
      if (semanticRemoteObservationError(error)) throw error;
      failures.push(`${transport.route}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  throw new Error(
    `reviewed repository transport unavailable for ${reviewed.expected}: ${failures.join(" | ")}`,
  );
}

export async function reportAgentWebCurrentness(argv = []) {
  const { projectsRoot, explicitRepositories, requireCurrent } = parseArgs(argv);
  const sources = await capturedSources();
  const projects = await Promise.all(sources.map(async ({ slug, value: captured }) => {
    const projectId = captured.project.id;
    const repository = explicitRepositories.get(projectId) ?? resolve(projectsRoot, projectId);
    const base = {
      slug,
      projectId,
      repository,
      truthRole: "public-source-review-obligation-projection",
      basis: "web-reviewed-repository-fresh-owner-declared-public-document-envelope",
      semanticApplicability: "not-evaluated",
      rule: (
        "This command compares Web's reviewed source envelope with two Web review witnesses: the current local " +
        "owner-visible projection and the fresh default-branch projection of the repository locator already bound " +
        "in Web's capture. The fresh reviewed repository is the canonical publication horizon; the local projection is " +
        "prospective pressure. A local public revision strictly behind that reviewed horizon is diagnostic, while local-ahead " +
        "or divergent public work still creates review pressure. This does not prove owner-domain standing or the published " +
        "explanation semantically stale."
      ),
      captured: capturedProjection(slug, captured),
    };

    if (!existsSync(repository)) {
      return {
        ...base,
        envelopeRelation: "unknown",
        sourceEnvelopeRevalidated: false,
        reviewObligation: "unknown",
        publicationMutationRequired: "not-evaluated",
        issue: "owner-repository-unavailable",
        observed: null,
      };
    }

    let localProjection = null;
    let localIssue = null;
    try {
      localProjection = probePublicProjection(repository);
    } catch (error) {
      localIssue = error instanceof Error ? error.message : String(error);
    }

    let remoteProjection = null;
    let sourceReview = null;
    let remoteIssue = null;
    try {
      const remote = await probeReviewedRepositoryProjection(repository, {
        expectedRepository: captured.project.repository,
        localSourceRevision: localProjection?.source?.revision ?? null,
      });
      remoteProjection = remote.projection;
      sourceReview = remote.sourceReview;
    } catch (error) {
      remoteIssue = error instanceof Error ? error.message : String(error);
    }

    const composition = composeSourceReviewWitnesses(
      captured.source.publicSourceDigest,
      localProjection,
      remoteProjection,
      { localPublicRevisionRelationToRemote: sourceReview?.localPublicRevisionRelationToRemote ?? null },
    );
    const issues = [localIssue && `local: ${localIssue}`, remoteIssue && `remote: ${remoteIssue}`].filter(Boolean);
    return {
      ...base,
      envelopeRelation: composition.envelopeRelation,
      sourceEnvelopeRevalidated: composition.sourceEnvelopeRevalidated,
      reviewObligation: composition.reviewObligation,
      publicationMutationRequired: "not-evaluated",
      issue: issues.length ? issues.join("; ") : null,
      observed: remoteProjection ? observedProjection(remoteProjection, sourceReview) : null,
      witnesses: {
        local: {
          relation: composition.localRelation,
          issue: localIssue,
          revisionRelationToRemote: sourceReview?.localPublicRevisionRelationToRemote ?? null,
          observed: localProjection ? observedProjection(localProjection) : null,
        },
        remote: {
          relation: composition.remoteRelation,
          issue: remoteIssue,
          observed: remoteProjection ? observedProjection(remoteProjection, sourceReview) : null,
        },
      },
    };
  }));

  return {
    schemaVersion: 1,
    kind: "ordivon.web.agent-context-currentness",
    truthRole: "derived-read-only-currentness-projection",
    authority: {
      publicationProjectionOwner: "ordivon-web",
      currentnessSource: "web-reviewed-repository-fresh-owner-declared-public-document-envelope",
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
        ? "Promotion preflight fails closed unless every source-projected owner envelope matches the fresh reviewed repository horizon and no local prospective/divergent public pressure remains. A local checkout strictly behind that canonical horizon is nonblocking; changed or unknown pressure cannot authorize promotion."
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
