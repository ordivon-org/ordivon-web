import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { probePublicProjection } from "../scripts/probe-public-projection.mjs";

function git(repo, args) {
  return execFileSync("git", ["-C", repo, ...args], { encoding: "utf8" }).trim();
}

function fixture(t) {
  const repo = mkdtempSync(join(tmpdir(), "ordivon-web-public-membership-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  mkdirSync(join(repo, ".ordivon"), { recursive: true });
  mkdirSync(join(repo, "docs"), { recursive: true });
  writeFileSync(join(repo, ".ordivon/project.yaml"), `id: fixture-owner\nname: Fixture Owner\nrepository: fixture-owner\nkind: test\ndescription: Fixture owner for projection tests\npublic_projection: ordivon-web\nmanaged_paths:\n  - docs/authority.md\n`);
  writeFileSync(join(repo, "docs/authority.md"), `---\nid: fixture-authority\ntype: policy\nlifecycle: active\nsource_role: canonical\nvisibility: public\nupdated: 2026-08-29\n---\n# Authority\n\n## Current authority\n\nCurrent public source is [status](STATUS.md).\n`);
  writeFileSync(join(repo, "docs/STATUS.md"), `---\nid: fixture-status\ntype: start\nlifecycle: active\nsource_role: canonical\nvisibility: public\nupdated: 2026-08-29\nsummary: Fixture current status\n---\n# Status\n\n## Current state\n\nFixture current.\n\n## Proven capabilities\n\n| Area | Status |\n| --- | --- |\n| Projection | current |\n`);
  git(repo, ["init", "-b", "main"]);
  git(repo, ["config", "user.email", "fixture@example.invalid"]);
  git(repo, ["config", "user.name", "Fixture"]);
  git(repo, ["add", "."]);
  git(repo, ["commit", "-m", "fixture"]);
  return repo;
}

test("committed eligibility removal is bound by source revision", (t) => {
  const repo = fixture(t);
  const statusPath = join(repo, "docs/STATUS.md");
  writeFileSync(statusPath, readFileSync(statusPath, "utf8").replace("source_role: canonical", "source_role: historical"));
  git(repo, ["add", "docs/STATUS.md"]);
  git(repo, ["commit", "-m", "retire status from public projection"]);

  const projection = probePublicProjection(repo);
  assert.equal(projection.source.dirty, false);
  assert.equal(projection.admission.accepted, true);
  assert.equal(projection.source.revision, git(repo, ["rev-parse", "HEAD"]));
  assert.equal(projection.source.documents.some((document) => document.path === "docs/STATUS.md"), false);
});

test("uncommitted deletion of an authority-linked projection input fails closed", (t) => {
  const repo = fixture(t);
  rmSync(join(repo, "docs/STATUS.md"));
  assert.throws(() => probePublicProjection(repo), /authority document references missing local projection input: docs\/STATUS\.md/);
});

test("committed deletion with a stale authority link fails closed", (t) => {
  const repo = fixture(t);
  rmSync(join(repo, "docs/STATUS.md"));
  git(repo, ["add", "-u"]);
  git(repo, ["commit", "-m", "delete status without updating authority"]);
  assert.throws(() => probePublicProjection(repo), /authority document references missing local projection input: docs\/STATUS\.md/);
});
