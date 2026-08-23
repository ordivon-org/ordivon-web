import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const ROOT = resolve(process.cwd());
const OUT = join(ROOT, "out");

export function sha256(bytes) {
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
}

function git(...args) {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
}

function ownerReadSet(report) {
  return report.projects.map((project) => ({
    projectId: project.projectId,
    capturedRevision: project.captured.sourceRevision,
    capturedPublicSourceDigest: project.captured.publicSourceDigest,
    observedRevision: project.observed?.sourceRevision ?? null,
    observedPublicSourceDigest: project.observed?.publicSourceDigest ?? null,
    envelopeRelation: project.envelopeRelation,
    sourceEnvelopeRevalidated: project.sourceEnvelopeRevalidated,
  })).sort((a, b) => a.projectId.localeCompare(b.projectId));
}

export async function buildPromotionReceipt({ currentnessReport, verificationProfile }) {
  if (!currentnessReport || currentnessReport.admission?.accepted !== true) {
    throw new Error("promotion receipt requires accepted final owner currentness");
  }
  if (verificationProfile !== "pnpm-check+pages-prepare") {
    throw new Error("promotion receipt requires the supported verification profile");
  }
  const status = git("status", "--porcelain=v1", "--untracked-files=all");
  if (status) throw new Error("promotion requires an exact clean Web source revision");
  const sourceRevision = git("rev-parse", "HEAD");
  const manifestBytes = await readFile(join(OUT, "deploy-manifest.json"));
  const manifest = JSON.parse(manifestBytes);
  if (manifest.sourceCommit !== sourceRevision) {
    throw new Error(`deploy manifest source ${manifest.sourceCommit} differs from Web source ${sourceRevision}`);
  }
  const receipt = {
    schemaVersion: 0,
    kind: "ordivon.web-promotion-receipt-experimental",
    truthRole: "publication-admission-read-set-and-source-binding-not-owner-truth",
    sourceRevision,
    ownerReadSet: ownerReadSet(currentnessReport),
    verification: {
      profile: verificationProfile,
      passed: true,
      deployManifestDigest: sha256(manifestBytes),
      articleCount: manifest.articleCount,
      routeCount: manifest.routeCount,
      artifactByteIdentityClaimed: false,
      reason: "Remote deployment rebuilds and verifies the exact admitted Web source; Next output bytes are not cross-workspace deterministic.",
    },
    claims: {
      ownerCurrentnessRevalidatedAtAdmission: true,
      ownerTruthMinted: false,
      publicationMutationInferredFromOwnerDrift: false,
      remoteDeploymentCompleted: false,
    },
  };
  return { receipt, receiptDigest: promotionReceiptDigest(receipt) };
}

export function promotionReceiptDigest(receipt) {
  return sha256(Buffer.from(`${JSON.stringify(receipt)}\n`));
}
