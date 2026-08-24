import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { ensurePromotionTag } from "../scripts/admit-web-promotion.mjs";

function run(cwd, command, args, options = {}) {
  return execFileSync(command, args, { cwd, encoding: "utf8", ...options });
}

test("tag verifier rejects a lightweight promotion-looking tag", () => {
  const root = mkdtempSync(join(tmpdir(), "ordivon-web-promotion-tag-"));
  try {
    run(root, "git", ["init", "-q"]);
    run(root, "git", ["config", "user.email", "test@example.invalid"]);
    run(root, "git", ["config", "user.name", "Test"]);
    run(root, "bash", ["-lc", "printf x > x && git add x && git commit -qm base"]);
    const head = run(root, "git", ["rev-parse", "HEAD"]).trim();
    const tag = `web-promotion-${head.slice(0, 12)}-${"a".repeat(12)}`;
    run(root, "git", ["tag", tag]);
    const result = spawnSync("node", [join(process.cwd(), "scripts/verify-web-promotion-tag.mjs"), tag], { cwd: root, encoding: "utf8" });
    assert.equal(result.status, 2);
    assert.match(result.stderr, /must be annotated/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});


test("tag verifier rejects a promotion tag that targets a different commit than checkout HEAD", () => {
  const root = mkdtempSync(join(tmpdir(), "ordivon-web-promotion-target-"));
  try {
    run(root, "git", ["init", "-q"]);
    run(root, "git", ["config", "user.email", "test@example.invalid"]);
    run(root, "git", ["config", "user.name", "Test"]);
    run(root, "bash", ["-lc", "printf one > x && git add x && git commit -qm one"]);
    const first = run(root, "git", ["rev-parse", "HEAD"]).trim();
    const tag = `web-promotion-${first.slice(0, 12)}-${"b".repeat(12)}`;
    run(root, "git", ["tag", "-a", tag, first, "-m", "{}"]);
    run(root, "bash", ["-lc", "printf two > x && git add x && git commit -qm two"]);
    const result = spawnSync("node", [join(process.cwd(), "scripts/verify-web-promotion-tag.mjs"), tag], { cwd: root, encoding: "utf8" });
    assert.equal(result.status, 2);
    assert.match(result.stderr, /differs from checkout HEAD/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("ordinary promotion admission rejects owner repository overrides before preflight", () => {
  const result = spawnSync("node", ["scripts/admit-web-promotion.mjs", "--repo", "ordivon-game=/tmp/stale"], { cwd: process.cwd(), encoding: "utf8" });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /owner repository overrides are not publication authority/);
});

test("ordinary promotion preflight rejects owner repository overrides before verification", () => {
  const result = spawnSync("node", ["scripts/run-web-promotion-preflight.mjs", "--repo", "ordivon-game=/tmp/stale"], { cwd: process.cwd(), encoding: "utf8" });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /does not accept owner repository overrides/);
});


test("promotion tag creation reconciles the exact same admission after response loss", () => {
  const root = mkdtempSync(join(tmpdir(), "ordivon-web-promotion-reconcile-"));
  try {
    run(root, "git", ["init", "-q"]);
    run(root, "git", ["config", "user.email", "test@example.invalid"]);
    run(root, "git", ["config", "user.name", "Test"]);
    run(root, "bash", ["-lc", "printf x > x && git add x && git commit -qm base"]);
    const head = run(root, "git", ["rev-parse", "HEAD"]).trim();
    const tagName = `web-promotion-${head.slice(0, 12)}-${"c".repeat(12)}`;
    const envelope = { schemaVersion: 0, kind: "test-promotion", receiptDigest: "sha256:" + "d".repeat(64) };
    assert.equal(ensurePromotionTag({ tagName, sourceRevision: head, envelope, cwd: root }), "created");
    const tagObject = run(root, "git", ["rev-parse", `refs/tags/${tagName}`]).trim();
    assert.equal(ensurePromotionTag({ tagName, sourceRevision: head, envelope, cwd: root }), "existing");
    assert.equal(run(root, "git", ["rev-parse", `refs/tags/${tagName}`]).trim(), tagObject);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("promotion tag reconciliation rejects same-name conflicting admission", () => {
  const root = mkdtempSync(join(tmpdir(), "ordivon-web-promotion-conflict-"));
  try {
    run(root, "git", ["init", "-q"]);
    run(root, "git", ["config", "user.email", "test@example.invalid"]);
    run(root, "git", ["config", "user.name", "Test"]);
    run(root, "bash", ["-lc", "printf x > x && git add x && git commit -qm base"]);
    const head = run(root, "git", ["rev-parse", "HEAD"]).trim();
    const tagName = `web-promotion-${head.slice(0, 12)}-${"e".repeat(12)}`;
    const first = { schemaVersion: 0, kind: "test-promotion", receiptDigest: "sha256:" + "1".repeat(64) };
    const second = { schemaVersion: 0, kind: "test-promotion", receiptDigest: "sha256:" + "2".repeat(64) };
    assert.equal(ensurePromotionTag({ tagName, sourceRevision: head, envelope: first, cwd: root }), "created");
    assert.throws(
      () => ensurePromotionTag({ tagName, sourceRevision: head, envelope: second, cwd: root }),
      /different admission content/,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
