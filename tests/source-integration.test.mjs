import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { inspectCanonicalSourceIntegration, requireCanonicalSourceIntegration } from "../scripts/source-integration.mjs";

function git(cwd, ...args) {
  return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
}

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "ordivon-web-source-integration-"));
  const remote = join(root, "remote.git");
  const repo = join(root, "repo");
  git(root, "init", "-q", "--bare", remote);
  git(root, "init", "-q", repo);
  git(repo, "config", "user.email", "test@example.invalid");
  git(repo, "config", "user.name", "Test");
  git(repo, "remote", "add", "origin", remote);
  writeFileSync(join(repo, "source.txt"), "base\n");
  git(repo, "add", "source.txt");
  git(repo, "commit", "-qm", "base");
  git(repo, "branch", "-M", "main");
  git(repo, "push", "-q", "-u", "origin", "main");
  return { root, remote, repo };
}

test("ordinary promotion source is integrated when HEAD is already in origin/main", () => {
  const x = fixture();
  try {
    const result = requireCanonicalSourceIntegration({ cwd: x.repo });
    assert.equal(result.integrated, true);
    assert.equal(result.sourceRevision, result.canonicalRevision);
    assert.equal(result.truthRole, "source-integration-currentness-not-publication-authority");
  } finally {
    rmSync(x.root, { recursive: true, force: true });
  }
});

test("detached or feature source ahead of origin/main is rejected before publication admission", () => {
  const x = fixture();
  try {
    writeFileSync(join(x.repo, "source.txt"), "candidate\n");
    git(x.repo, "add", "source.txt");
    git(x.repo, "commit", "-qm", "candidate");
    const report = inspectCanonicalSourceIntegration({ cwd: x.repo });
    assert.equal(report.integrated, false);
    assert.throws(
      () => requireCanonicalSourceIntegration({ cwd: x.repo }),
      /requires Web source .* to be integrated into origin\/main before publication admission/,
    );
  } finally {
    rmSync(x.root, { recursive: true, force: true });
  }
});

test("a source remains integrated after origin/main advances to a descendant", () => {
  const x = fixture();
  try {
    const admittedSource = git(x.repo, "rev-parse", "HEAD");
    writeFileSync(join(x.repo, "later.txt"), "later\n");
    git(x.repo, "add", "later.txt");
    git(x.repo, "commit", "-qm", "later");
    git(x.repo, "push", "-q", "origin", "main");
    git(x.repo, "checkout", "-q", "--detach", admittedSource);
    const report = requireCanonicalSourceIntegration({ cwd: x.repo });
    assert.equal(report.integrated, true);
    assert.notEqual(report.sourceRevision, report.canonicalRevision);
  } finally {
    rmSync(x.root, { recursive: true, force: true });
  }
});
