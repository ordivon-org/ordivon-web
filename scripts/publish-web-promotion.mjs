import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import process from "node:process";

import { reportAgentWebCurrentness } from "./report-agent-web-currentness.mjs";
import { verifyPromotionTag } from "./verify-web-promotion-tag.mjs";

function fail(message) {
  throw new Error(message);
}

function remoteTagObject(remote, tagName, cwd) {
  const ref = `refs/tags/${tagName}`;
  const output = execFileSync("git", ["ls-remote", "--tags", "--refs", remote, ref], { cwd, encoding: "utf8" }).trim();
  if (!output) return null;
  const rows = output.split("\n").filter(Boolean);
  if (rows.length !== 1) fail(`remote promotion ref resolved ambiguously: ${tagName}`);
  const [object, resolvedRef] = rows[0].split(/\s+/, 2);
  if (resolvedRef !== ref || !/^[0-9a-f]{40,64}$/.test(object)) fail(`remote promotion ref is malformed: ${tagName}`);
  return object;
}

export function validatePromotionPublishCurrentness(verification, currentness) {
  if (currentness?.admission?.accepted !== true) fail("remote publication requires current owner-envelope revalidation");
  const receiptOwners = new Map(verification.receipt.ownerReadSet.map((owner) => [owner.projectId, owner]));
  const currentOwners = new Map((currentness.projects || []).map((owner) => [owner.projectId, owner]));
  if (receiptOwners.size !== currentOwners.size) fail("promotion receipt owner read-set differs from current Web source dependencies");
  for (const [projectId, receiptOwner] of receiptOwners) {
    const currentOwner = currentOwners.get(projectId);
    if (!currentOwner) fail(`promotion receipt owner is absent from current Web source dependencies: ${projectId}`);
    if (currentOwner.envelopeRelation !== "unchanged" || currentOwner.sourceEnvelopeRevalidated !== true) {
      fail(`owner envelope is not current at remote publication boundary: ${projectId}`);
    }
    if (currentOwner.captured?.publicSourceDigest !== receiptOwner.capturedPublicSourceDigest) {
      fail(`promotion receipt read-set does not match checked-out Web source: ${projectId}`);
    }
    if (currentOwner.observed?.publicSourceDigest !== receiptOwner.capturedPublicSourceDigest) {
      fail(`owner envelope changed after promotion admission: ${projectId}`);
    }
  }
  return true;
}

export async function publishPromotionTag({
  tagName,
  remote = "origin",
  dryRun = false,
  cwd = process.cwd(),
  currentnessReport = null,
} = {}) {
  const verification = verifyPromotionTag(tagName, { cwd, requireHeadMatch: true });
  const currentness = currentnessReport ?? await reportAgentWebCurrentness(["--require-current"]);
  validatePromotionPublishCurrentness(verification, currentness);

  const before = remoteTagObject(remote, tagName, cwd);
  if (before !== null && before !== verification.tagObject) {
    fail(`remote promotion tag already exists with different identity: ${tagName}`);
  }
  if (before === verification.tagObject) {
    return {
      schemaVersion: 0,
      kind: "ordivon.web-promotion-publish-result",
      tagName,
      sourceRevision: verification.sourceRevision,
      receiptDigest: verification.receiptDigest,
      remote,
      remoteTagObject: before,
      disposition: "existing",
      dryRun,
      ownerCurrentnessRevalidatedAtRemoteBoundary: true,
      remoteMutationPerformed: false,
    };
  }
  if (dryRun) {
    return {
      schemaVersion: 0,
      kind: "ordivon.web-promotion-publish-result",
      tagName,
      sourceRevision: verification.sourceRevision,
      receiptDigest: verification.receiptDigest,
      remote,
      remoteTagObject: null,
      disposition: "would-create",
      dryRun: true,
      ownerCurrentnessRevalidatedAtRemoteBoundary: true,
      remoteMutationPerformed: false,
    };
  }

  try {
    execFileSync("git", ["push", remote, `refs/tags/${tagName}:refs/tags/${tagName}`], { cwd, stdio: "inherit" });
  } catch (error) {
    const reconciled = remoteTagObject(remote, tagName, cwd);
    if (reconciled === verification.tagObject) {
      return {
        schemaVersion: 0,
        kind: "ordivon.web-promotion-publish-result",
        tagName,
        sourceRevision: verification.sourceRevision,
        receiptDigest: verification.receiptDigest,
        remote,
        remoteTagObject: reconciled,
        disposition: "reconciled-after-push-error",
        dryRun: false,
        ownerCurrentnessRevalidatedAtRemoteBoundary: true,
        remoteMutationPerformed: "unknown-response-reconciled-by-ref-identity",
      };
    }
    throw error;
  }

  const after = remoteTagObject(remote, tagName, cwd);
  if (after !== verification.tagObject) fail("remote promotion tag did not converge to exact local tag identity");
  return {
    schemaVersion: 0,
    kind: "ordivon.web-promotion-publish-result",
    tagName,
    sourceRevision: verification.sourceRevision,
    receiptDigest: verification.receiptDigest,
    remote,
    remoteTagObject: after,
    disposition: "created",
    dryRun: false,
    ownerCurrentnessRevalidatedAtRemoteBoundary: true,
    remoteMutationPerformed: true,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const positional = args.filter((arg) => arg !== "--dry-run");
  if (positional.length !== 1 || args.filter((arg) => arg === "--dry-run").length > 1) {
    console.error("usage: pnpm promotion:publish <web-promotion-tag> [--dry-run]");
    process.exit(2);
  }
  try {
    const result = await publishPromotionTag({ tagName: positional[0], dryRun });
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(2);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
