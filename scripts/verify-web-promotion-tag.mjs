import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import process from "node:process";

import { promotionReceiptDigest } from "./prepare-web-promotion.mjs";

function git(cwd, ...args) {
  return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
}

function fail(message) {
  throw new Error(message);
}

export function verifyPromotionTag(tagName, { cwd = process.cwd(), requireHeadMatch = true } = {}) {
  if (!tagName || !/^web-promotion-[0-9a-f]{12}-[0-9a-f]{12}$/.test(tagName)) fail("invalid promotion tag name");
  const ref = `refs/tags/${tagName}`;
  if (git(cwd, "cat-file", "-t", ref) !== "tag") fail("promotion tag must be annotated");
  const tagObject = git(cwd, "rev-parse", ref);
  const target = git(cwd, "rev-parse", `${ref}^{}`);
  if (requireHeadMatch) {
    const head = git(cwd, "rev-parse", "HEAD");
    if (target !== head) fail(`promotion tag target ${target} differs from checkout HEAD ${head}`);
  }
  const message = execFileSync("git", ["for-each-ref", ref, "--format=%(contents)"], { cwd, encoding: "utf8" }).trim();
  const envelope = JSON.parse(message);
  if (envelope.schemaVersion !== 0 || envelope.kind !== "ordivon.web-promotion-admission-experimental") fail("promotion tag envelope kind/version invalid");
  const receipt = envelope.receipt;
  if (!receipt || receipt.schemaVersion !== 0 || receipt.kind !== "ordivon.web-promotion-receipt-experimental") fail("promotion receipt kind/version invalid");
  if (receipt.sourceRevision !== target) fail("promotion receipt source revision differs from tag target");
  if (envelope.receiptDigest !== promotionReceiptDigest(receipt)) fail("promotion receipt digest mismatch");
  if (!Array.isArray(receipt.ownerReadSet) || receipt.ownerReadSet.length === 0) fail("promotion receipt owner read-set missing");
  for (const owner of receipt.ownerReadSet) {
    if (owner.envelopeRelation !== "unchanged" || owner.sourceEnvelopeRevalidated !== true) fail(`promotion owner read-set is not admitted: ${owner.projectId ?? "unknown"}`);
    if (owner.capturedPublicSourceDigest !== owner.observedPublicSourceDigest) fail(`promotion owner digest mismatch: ${owner.projectId ?? "unknown"}`);
  }
  if (receipt.verification?.profile !== "pnpm-check+pages-prepare" || receipt.verification?.passed !== true) fail("promotion verification profile is not admitted");
  if (receipt.verification?.artifactByteIdentityClaimed !== false) fail("promotion receipt must not claim cross-workspace artifact byte identity");
  if (receipt.claims?.ownerCurrentnessRevalidatedAtAdmission !== true || receipt.claims?.ownerTruthMinted !== false || receipt.claims?.remoteDeploymentCompleted !== false) fail("promotion receipt claims invalid");
  return {
    schemaVersion: 0,
    kind: "ordivon.web-promotion-tag-verification",
    accepted: true,
    tagName,
    tagObject,
    sourceRevision: target,
    receiptDigest: envelope.receiptDigest,
    envelope,
    receipt,
  };
}

function main() {
  try {
    const [tagName] = process.argv.slice(2);
    const verified = verifyPromotionTag(tagName);
    process.stdout.write(`${JSON.stringify({
      schemaVersion: verified.schemaVersion,
      kind: verified.kind,
      accepted: verified.accepted,
      tagName: verified.tagName,
      sourceRevision: verified.sourceRevision,
      receiptDigest: verified.receiptDigest,
    }, null, 2)}\n`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(2);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
