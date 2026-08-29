import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { composeSourceReviewWitnesses, probeReviewedRepositoryProjection, reportAgentWebCurrentness } from "../scripts/report-agent-web-currentness.mjs";
import { probePublicProjection } from "../scripts/probe-public-projection.mjs";

test("unavailable owner repositories remain explicit unknown currentness", async () => {
  const report = await reportAgentWebCurrentness(["--projects-root", "/definitely/not/ordivon/projects"]);
  assert.equal(report.kind, "ordivon.web.agent-context-currentness");
  assert.equal(report.truthRole, "derived-read-only-currentness-projection");
  assert.ok(report.projects.length > 0);
  for (const project of report.projects) {
    assert.equal(project.envelopeRelation, "unknown");
    assert.equal(project.reviewObligation, "unknown");
    assert.equal(project.semanticApplicability, "not-evaluated");
    assert.equal(project.issue, "owner-repository-unavailable");
  }
});

test("invalid CLI-shaped arguments fail closed", async () => {
  await assert.rejects(
    () => reportAgentWebCurrentness(["--repo", "missing-separator"]),
    /PROJECT_ID=PATH/,
  );
});

function run(cwd, args) {
  return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
}

function remoteCurrentnessFixture(t) {
  const root = mkdtempSync(join(tmpdir(), "ordivon-web-owner-currentness-test-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const owner = join(root, "owner");
  const remote = join(root, "remote.git");
  const writer = join(root, "writer");
  mkdirSync(join(owner, ".ordivon"), { recursive: true });
  mkdirSync(join(owner, "docs"), { recursive: true });
  writeFileSync(join(owner, ".ordivon/project.yaml"), `schema_version: 1
id: fixture-owner
name: Fixture Owner
repository: fixture-owner
kind: engineering
managed_paths:
  - docs/authority.md
public_projection: ordivon-web
description: Fixture owner.
`);
  writeFileSync(join(owner, "docs/authority.md"), `---
schema_version: 1
id: fixture.authority
type: decision
lifecycle: active
source_role: canonical
visibility: public
updated: 2026-08-29
---
# Authority

## Decision

Current public standing is owned by [STATUS](STATUS.md).
`);
  writeFileSync(join(owner, "docs/STATUS.md"), `---
schema_version: 1
id: fixture.status
type: status
lifecycle: active
source_role: canonical
visibility: public
updated: 2026-08-29
evidence_status: verified
readiness: READY
summary: Fixture current status.
---
# Status

## Current state

Fixture public state v1.
`);
  writeFileSync(join(owner, "unrelated.txt"), "baseline\n");
  run(owner, ["init", "-q", "-b", "main"]);
  run(owner, ["config", "user.email", "fixture@example.invalid"]);
  run(owner, ["config", "user.name", "Fixture"]);
  run(owner, ["add", "."]);
  run(owner, ["commit", "-qm", "baseline"]);
  run(root, ["init", "-q", "--bare", remote]);
  run(root, ["--git-dir", remote, "symbolic-ref", "HEAD", "refs/heads/main"]);
  const manifestPath = join(owner, ".ordivon/project.yaml");
  writeFileSync(manifestPath, readFileSync(manifestPath, "utf8").replace("repository: fixture-owner", `repository: ${remote}`));
  run(owner, ["add", ".ordivon/project.yaml"]);
  run(owner, ["commit", "--amend", "-qm", "baseline"]);
  run(owner, ["remote", "add", "origin", remote]);
  run(owner, ["push", "-qu", "origin", "main"]);
  run(root, ["clone", "-q", remote, writer]);
  run(writer, ["config", "user.email", "writer@example.invalid"]);
  run(writer, ["config", "user.name", "Writer"]);
  return { root, owner, remote, writer };
}

test("canonical owner projection uses an exact clean local checkout after remote freshness observation", async (t) => {
  const x = remoteCurrentnessFixture(t);
  const head = run(x.owner, ["rev-parse", "HEAD"]);
  const result = await probeReviewedRepositoryProjection(x.owner, { expectedRepository: x.remote });
  assert.equal(result.projection.admission.accepted, true);
  assert.equal(result.sourceReview.remoteHeadRevision, head);
  assert.equal(result.sourceReview.localHeadRevision, head);
  assert.equal(result.sourceReview.remoteFreshnessObserved, true);
  assert.equal(result.sourceReview.observation, "reviewed-remote-head-matches-clean-local-source");
});

test("unrelated canonical remote advance preserves the public envelope without mutating stale owner checkout", async (t) => {
  const x = remoteCurrentnessFixture(t);
  const baseline = await probeReviewedRepositoryProjection(x.owner, { expectedRepository: x.remote });
  const ownerHead = run(x.owner, ["rev-parse", "HEAD"]);
  const ownerTracking = run(x.owner, ["rev-parse", "refs/remotes/origin/main"]);

  writeFileSync(join(x.writer, "unrelated.txt"), "remote unrelated advance\n");
  run(x.writer, ["add", "unrelated.txt"]);
  run(x.writer, ["commit", "-qm", "unrelated remote advance"]);
  run(x.writer, ["push", "-q", "origin", "main"]);
  const remoteHead = run(x.writer, ["rev-parse", "HEAD"]);

  const result = await probeReviewedRepositoryProjection(x.owner, { expectedRepository: x.remote });
  assert.equal(result.sourceReview.remoteHeadRevision, remoteHead);
  assert.equal(result.sourceReview.localHeadRevision, ownerHead);
  assert.equal(result.sourceReview.observation, "disposable-full-history-observer-of-web-reviewed-repository");
  assert.equal(result.projection.source.publicSourceDigest, baseline.projection.source.publicSourceDigest);
  assert.equal(run(x.owner, ["rev-parse", "HEAD"]), ownerHead);
  assert.equal(run(x.owner, ["rev-parse", "refs/remotes/origin/main"]), ownerTracking);
});

test("canonical remote projection preserves dependency revision when a later remote commit is unrelated", async (t) => {
  const x = remoteCurrentnessFixture(t);
  const baseline = await probeReviewedRepositoryProjection(x.owner, { expectedRepository: x.remote });
  const ownerHead = run(x.owner, ["rev-parse", "HEAD"]);
  const ownerTracking = run(x.owner, ["rev-parse", "refs/remotes/origin/main"]);

  const status = join(x.writer, "docs/STATUS.md");
  writeFileSync(status, readFileSync(status, "utf8").replace("Fixture public state v1.", "Fixture public state v2."));
  run(x.writer, ["add", "docs/STATUS.md"]);
  run(x.writer, ["commit", "-qm", "change public envelope"]);
  const publicRevision = run(x.writer, ["rev-parse", "HEAD"]);

  writeFileSync(join(x.writer, "unrelated.txt"), "later unrelated remote change\n");
  run(x.writer, ["add", "unrelated.txt"]);
  run(x.writer, ["commit", "-qm", "later unrelated remote change"]);
  run(x.writer, ["push", "-q", "origin", "main"]);
  const remoteHead = run(x.writer, ["rev-parse", "HEAD"]);
  assert.notEqual(remoteHead, publicRevision);

  const result = await probeReviewedRepositoryProjection(x.owner, { expectedRepository: x.remote });
  assert.equal(result.sourceReview.remoteHeadRevision, remoteHead);
  assert.equal(result.projection.source.revision, publicRevision);
  assert.notEqual(result.projection.source.publicSourceDigest, baseline.projection.source.publicSourceDigest);
  assert.equal(result.projection.admission.accepted, true);
  assert.equal(run(x.owner, ["rev-parse", "HEAD"]), ownerHead);
  assert.equal(run(x.owner, ["rev-parse", "refs/remotes/origin/main"]), ownerTracking);
});



test("reviewed source observation fails closed when the remote branch moves during materialization", async (t) => {
  const x = remoteCurrentnessFixture(t);
  writeFileSync(join(x.writer, "unrelated.txt"), "first remote advance\n");
  run(x.writer, ["add", "unrelated.txt"]);
  run(x.writer, ["commit", "-qm", "first remote advance"]);
  run(x.writer, ["push", "-q", "origin", "main"]);

  const prefix = "ordivon-web-owner-currentness-";
  const before = new Set(readdirSync(tmpdir()).filter((name) => name.startsWith(prefix)));
  let moved = false;
  let movementError = null;
  const timer = setInterval(() => {
    if (moved || movementError) return;
    const created = readdirSync(tmpdir()).filter((name) => name.startsWith(prefix) && !before.has(name));
    if (!created.length) return;
    try {
      writeFileSync(join(x.writer, "unrelated.txt"), "second remote advance during observation\n");
      run(x.writer, ["add", "unrelated.txt"]);
      run(x.writer, ["commit", "-qm", "move remote during observation"]);
      run(x.writer, ["push", "-q", "origin", "main"]);
      moved = true;
    } catch (error) {
      movementError = error;
    }
  }, 1);
  t.after(() => clearInterval(timer));

  await assert.rejects(
    () => probeReviewedRepositoryProjection(x.owner, { expectedRepository: x.remote }),
    /reviewed source branch moved during (materialization|projection observation)/,
  );
  clearInterval(timer);
  if (movementError) throw movementError;
  assert.equal(moved, true);
});

test("mutable local origin cannot select or launder the reviewed repository", async (t) => {
  const x = remoteCurrentnessFixture(t);
  const baseline = await probeReviewedRepositoryProjection(x.owner, { expectedRepository: x.remote });
  const evil = join(x.root, "evil.git");
  run(x.root, ["init", "-q", "--bare", evil]);
  run(x.owner, ["remote", "set-url", "origin", evil]);

  const result = await probeReviewedRepositoryProjection(x.owner, { expectedRepository: x.remote });
  assert.equal(result.sourceReview.repositoryLocator, x.remote);
  assert.equal(result.sourceReview.remoteHeadRevision, baseline.sourceReview.remoteHeadRevision);
  assert.equal(result.projection.source.publicSourceDigest, baseline.projection.source.publicSourceDigest);
  assert.equal(run(x.owner, ["remote", "get-url", "origin"]), evil);
});

test("reviewed repository identity must still match the owner manifest", async (t) => {
  const x = remoteCurrentnessFixture(t);
  const other = join(x.root, "other.git");
  run(x.root, ["init", "-q", "--bare", other]);
  await assert.rejects(
    () => probeReviewedRepositoryProjection(x.owner, { expectedRepository: other }),
    /owner manifest repository identity .* differs from reviewed Web identity/,
  );
});


test("local public change ahead of reviewed remote remains a changed Web review witness", async (t) => {
  const x = remoteCurrentnessFixture(t);
  const baseline = probePublicProjection(x.owner);
  const status = join(x.owner, "docs/STATUS.md");
  writeFileSync(status, readFileSync(status, "utf8").replace("Fixture public state v1.", "Fixture local public state v2."));
  run(x.owner, ["add", "docs/STATUS.md"]);
  run(x.owner, ["commit", "-qm", "local public change ahead of remote"]);

  const local = probePublicProjection(x.owner);
  const remote = await probeReviewedRepositoryProjection(x.owner, {
    expectedRepository: x.remote,
    localSourceRevision: local.source.revision,
  });
  assert.notEqual(local.source.publicSourceDigest, baseline.source.publicSourceDigest);
  assert.equal(remote.projection.source.publicSourceDigest, baseline.source.publicSourceDigest);

  const composed = composeSourceReviewWitnesses(
    baseline.source.publicSourceDigest,
    local,
    remote.projection,
    { localPublicRevisionRelationToRemote: remote.sourceReview.localPublicRevisionRelationToRemote },
  );
  assert.equal(remote.sourceReview.localPublicRevisionRelationToRemote, "ahead");
  assert.equal(composed.localRelation, "changed");
  assert.equal(composed.remoteRelation, "unchanged");
  assert.equal(composed.envelopeRelation, "changed");
  assert.equal(composed.reviewObligation, "required");
  assert.equal(composed.sourceEnvelopeRevalidated, true);
});

test("stale local public revision behind the reviewed remote horizon is nonblocking after rebind", async (t) => {
  const x = remoteCurrentnessFixture(t);
  const local = probePublicProjection(x.owner);
  const status = join(x.writer, "docs/STATUS.md");
  writeFileSync(status, readFileSync(status, "utf8").replace("Fixture public state v1.", "Fixture remote public state v2."));
  run(x.writer, ["add", "docs/STATUS.md"]);
  run(x.writer, ["commit", "-qm", "remote public change for rebind"]);
  run(x.writer, ["push", "-q", "origin", "main"]);

  const remote = await probeReviewedRepositoryProjection(x.owner, {
    expectedRepository: x.remote,
    localSourceRevision: local.source.revision,
  });
  assert.equal(remote.sourceReview.localPublicRevisionRelationToRemote, "behind");
  assert.notEqual(local.source.publicSourceDigest, remote.projection.source.publicSourceDigest);

  const composed = composeSourceReviewWitnesses(
    remote.projection.source.publicSourceDigest,
    local,
    remote.projection,
    { localPublicRevisionRelationToRemote: remote.sourceReview.localPublicRevisionRelationToRemote },
  );
  assert.equal(composed.localRelation, "superseded");
  assert.equal(composed.remoteRelation, "unchanged");
  assert.equal(composed.envelopeRelation, "unchanged");
  assert.equal(composed.reviewObligation, "none");
  assert.equal(composed.sourceEnvelopeRevalidated, true);
});



test("divergent local public revision remains blocking against a rebound remote horizon", async (t) => {
  const x = remoteCurrentnessFixture(t);
  const remoteStatus = join(x.writer, "docs/STATUS.md");
  writeFileSync(remoteStatus, readFileSync(remoteStatus, "utf8").replace("Fixture public state v1.", "Fixture remote public state v2."));
  run(x.writer, ["add", "docs/STATUS.md"]);
  run(x.writer, ["commit", "-qm", "remote public change"]);
  run(x.writer, ["push", "-q", "origin", "main"]);

  const localStatus = join(x.owner, "docs/STATUS.md");
  writeFileSync(localStatus, readFileSync(localStatus, "utf8").replace("Fixture public state v1.", "Fixture divergent local public state."));
  run(x.owner, ["add", "docs/STATUS.md"]);
  run(x.owner, ["commit", "-qm", "divergent local public change"]);
  const local = probePublicProjection(x.owner);
  const remote = await probeReviewedRepositoryProjection(x.owner, {
    expectedRepository: x.remote,
    localSourceRevision: local.source.revision,
  });
  assert.equal(remote.sourceReview.localPublicRevisionRelationToRemote, "divergent");

  const composed = composeSourceReviewWitnesses(
    remote.projection.source.publicSourceDigest,
    local,
    remote.projection,
    { localPublicRevisionRelationToRemote: remote.sourceReview.localPublicRevisionRelationToRemote },
  );
  assert.equal(composed.localRelation, "changed");
  assert.equal(composed.remoteRelation, "unchanged");
  assert.equal(composed.envelopeRelation, "changed");
  assert.equal(composed.reviewObligation, "required");
  assert.equal(composed.sourceEnvelopeRevalidated, true);
});

test("uncommitted local public change remains unknown and blocks currentness", async (t) => {
  const x = remoteCurrentnessFixture(t);
  const baseline = probePublicProjection(x.owner);
  const status = join(x.owner, "docs/STATUS.md");
  writeFileSync(status, readFileSync(status, "utf8").replace("Fixture public state v1.", "Fixture uncommitted local public state."));
  const local = probePublicProjection(x.owner);
  assert.equal(local.admission.accepted, false);
  const remote = await probeReviewedRepositoryProjection(x.owner, {
    expectedRepository: x.remote,
    localSourceRevision: local.source.revision,
  });
  const composed = composeSourceReviewWitnesses(
    baseline.source.publicSourceDigest,
    local,
    remote.projection,
    { localPublicRevisionRelationToRemote: remote.sourceReview.localPublicRevisionRelationToRemote },
  );
  assert.equal(composed.localRelation, "unknown");
  assert.equal(composed.remoteRelation, "unchanged");
  assert.equal(composed.envelopeRelation, "unknown");
  assert.equal(composed.reviewObligation, "unknown");
  assert.equal(composed.sourceEnvelopeRevalidated, false);
});

test("unproven ancestry cannot silently become superseded", () => {
  const captured = "sha256:" + "a".repeat(64);
  const local = { admission: { accepted: true }, source: { publicSourceDigest: "sha256:" + "b".repeat(64) } };
  const remote = { admission: { accepted: true }, source: { publicSourceDigest: captured } };
  const composed = composeSourceReviewWitnesses(captured, local, remote, { localPublicRevisionRelationToRemote: "unknown" });
  assert.equal(composed.localRelation, "changed");
  assert.equal(composed.envelopeRelation, "changed");
  assert.equal(composed.reviewObligation, "required");
});

test("same revision relation cannot excuse a digest mismatch", () => {
  const captured = "sha256:" + "a".repeat(64);
  const local = { admission: { accepted: true }, source: { publicSourceDigest: "sha256:" + "b".repeat(64) } };
  const remote = { admission: { accepted: true }, source: { publicSourceDigest: captured } };
  const composed = composeSourceReviewWitnesses(captured, local, remote, { localPublicRevisionRelationToRemote: "equal" });
  assert.equal(composed.localRelation, "changed");
  assert.equal(composed.envelopeRelation, "changed");
  assert.equal(composed.reviewObligation, "required");
});

test("dual witness composition fails closed on incomplete evidence without erasing known change", () => {
  const digest = "sha256:" + "a".repeat(64);
  const unchanged = { admission: { accepted: true }, source: { publicSourceDigest: digest } };
  const changed = { admission: { accepted: true }, source: { publicSourceDigest: "sha256:" + "b".repeat(64) } };

  const incomplete = composeSourceReviewWitnesses(digest, unchanged, null);
  assert.equal(incomplete.envelopeRelation, "unknown");
  assert.equal(incomplete.reviewObligation, "unknown");
  assert.equal(incomplete.sourceEnvelopeRevalidated, false);

  const knownChange = composeSourceReviewWitnesses(digest, changed, null);
  assert.equal(knownChange.envelopeRelation, "changed");
  assert.equal(knownChange.reviewObligation, "required");
  assert.equal(knownChange.sourceEnvelopeRevalidated, false);
});
