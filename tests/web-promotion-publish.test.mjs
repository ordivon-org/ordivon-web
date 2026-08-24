import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { promotionReceiptDigest } from "../scripts/prepare-web-promotion.mjs";
import { publishPromotionTag, validatePromotionPublishCurrentness } from "../scripts/publish-web-promotion.mjs";

function run(cwd, command, args, options = {}) {
  return execFileSync(command, args, { cwd, encoding: "utf8", ...options }).trim();
}

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "ordivon-web-publish-"));
  const repo = join(root, "repo");
  const remote = join(root, "remote.git");
  run(root, "git", ["init", "-q", repo]);
  run(repo, "git", ["config", "user.email", "test@example.invalid"]);
  run(repo, "git", ["config", "user.name", "Test"]);
  run(repo, "bash", ["-lc", "printf x > x && git add x && git commit -qm base"]);
  run(root, "git", ["init", "-q", "--bare", remote]);
  const head = run(repo, "git", ["rev-parse", "HEAD"]);
  const ownerDigest = "sha256:" + "a".repeat(64);
  const receipt = {
    schemaVersion: 0,
    kind: "ordivon.web-promotion-receipt-experimental",
    truthRole: "publication-admission-read-set-and-source-binding-not-owner-truth",
    sourceRevision: head,
    ownerReadSet: [{
      projectId: "ordivon-game",
      capturedRevision: "owner:1",
      capturedPublicSourceDigest: ownerDigest,
      observedRevision: "owner:1",
      observedPublicSourceDigest: ownerDigest,
      envelopeRelation: "unchanged",
      sourceEnvelopeRevalidated: true,
    }],
    verification: {
      profile: "pnpm-check+pages-prepare",
      passed: true,
      artifactByteIdentityClaimed: false,
    },
    claims: {
      ownerCurrentnessRevalidatedAtAdmission: true,
      ownerTruthMinted: false,
      publicationMutationInferredFromOwnerDrift: false,
      remoteDeploymentCompleted: false,
    },
  };
  const receiptDigest = promotionReceiptDigest(receipt);
  const tagName = `web-promotion-${head.slice(0, 12)}-${receiptDigest.slice(7, 19)}`;
  const envelope = {
    schemaVersion: 0,
    kind: "ordivon.web-promotion-admission-experimental",
    receiptDigest,
    receipt,
  };
  run(repo, "git", ["tag", "-a", tagName, head, "-m", `${JSON.stringify(envelope)}\n`]);
  const currentness = {
    admission: { accepted: true },
    projects: [{
      projectId: "ordivon-game",
      envelopeRelation: "unchanged",
      sourceEnvelopeRevalidated: true,
      captured: { publicSourceDigest: ownerDigest },
      observed: { publicSourceDigest: ownerDigest },
    }],
  };
  return { root, repo, remote, head, tagName, currentness, ownerDigest };
}

test("remote publication dry-run revalidates owners without creating a remote tag", async () => {
  const x = fixture();
  try {
    const result = await publishPromotionTag({ tagName: x.tagName, remote: x.remote, dryRun: true, cwd: x.repo, currentnessReport: x.currentness });
    assert.equal(result.disposition, "would-create");
    assert.equal(result.remoteMutationPerformed, false);
    assert.equal(run(x.repo, "git", ["ls-remote", "--tags", "--refs", x.remote, `refs/tags/${x.tagName}`]), "");
  } finally {
    rmSync(x.root, { recursive: true, force: true });
  }
});

test("exact remote tag publish and response-loss retry converge by immutable ref identity", async () => {
  const x = fixture();
  try {
    const created = await publishPromotionTag({ tagName: x.tagName, remote: x.remote, cwd: x.repo, currentnessReport: x.currentness });
    assert.equal(created.disposition, "created");
    assert.equal(created.remoteMutationPerformed, true);
    const firstObject = created.remoteTagObject;
    const retry = await publishPromotionTag({ tagName: x.tagName, remote: x.remote, cwd: x.repo, currentnessReport: x.currentness });
    assert.equal(retry.disposition, "existing");
    assert.equal(retry.remoteMutationPerformed, false);
    assert.equal(retry.remoteTagObject, firstObject);
  } finally {
    rmSync(x.root, { recursive: true, force: true });
  }
});

test("remote publication rejects changed owner envelope before transport", async () => {
  const x = fixture();
  try {
    const stale = structuredClone(x.currentness);
    stale.admission.accepted = false;
    stale.projects[0].envelopeRelation = "changed";
    stale.projects[0].observed.publicSourceDigest = "sha256:" + "b".repeat(64);
    await assert.rejects(
      () => publishPromotionTag({ tagName: x.tagName, remote: x.remote, cwd: x.repo, currentnessReport: stale }),
      /requires current owner-envelope revalidation/,
    );
    assert.equal(run(x.repo, "git", ["ls-remote", "--tags", "--refs", x.remote, `refs/tags/${x.tagName}`]), "");
  } finally {
    rmSync(x.root, { recursive: true, force: true });
  }
});

test("remote publication rejects receipt read-set that differs from checked-out Web source", () => {
  const x = fixture();
  try {
    const verification = {
      receipt: {
        ownerReadSet: [{
          projectId: "ordivon-game",
          capturedPublicSourceDigest: "sha256:" + "c".repeat(64),
        }],
      },
    };
    assert.throws(
      () => validatePromotionPublishCurrentness(verification, x.currentness),
      /does not match checked-out Web source/,
    );
  } finally {
    rmSync(x.root, { recursive: true, force: true });
  }
});

test("remote publication refuses a conflicting existing remote tag identity", async () => {
  const x = fixture();
  try {
    run(x.repo, "bash", ["-lc", "printf y > y && git add y && git commit -qm second"]);
    const second = run(x.repo, "git", ["rev-parse", "HEAD"]);
    const conflictSeed = `conflict-seed-${second.slice(0, 12)}`;
    run(x.repo, "git", ["tag", "-a", conflictSeed, second, "-m", "conflicting remote promotion identity"]);
    run(x.repo, "git", ["push", x.remote, `refs/tags/${conflictSeed}:refs/tags/${x.tagName}`]);
    const remoteConflictObject = run(x.root, "git", ["--git-dir", x.remote, "rev-parse", `refs/tags/${x.tagName}`]);
    run(x.repo, "git", ["checkout", "-q", x.head]);
    await assert.rejects(
      () => publishPromotionTag({ tagName: x.tagName, remote: x.remote, cwd: x.repo, currentnessReport: x.currentness }),
      /already exists with different identity/,
    );
    assert.equal(run(x.root, "git", ["--git-dir", x.remote, "rev-parse", `refs/tags/${x.tagName}`]), remoteConflictObject);
  } finally {
    rmSync(x.root, { recursive: true, force: true });
  }
});
