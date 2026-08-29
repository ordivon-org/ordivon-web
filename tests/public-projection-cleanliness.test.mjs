import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { probePublicProjection } from "../scripts/probe-public-projection.mjs";

function git(repo, ...args) {
  return execFileSync("git", ["-C", repo, ...args], { encoding: "utf8" }).trim();
}

function write(repo, relativePath, content) {
  const path = join(repo, relativePath);
  mkdirSync(join(path, ".."), { recursive: true });
  writeFileSync(path, content);
}

test("public projection cleanliness is scoped to the declared semantic envelope", () => {
  const repo = mkdtempSync(join(tmpdir(), "ordivon-web-public-projection-"));
  try {
    git(repo, "init", "-q");
    git(repo, "config", "user.name", "Ordivon Web Test");
    git(repo, "config", "user.email", "web-test@ordivon.invalid");

    write(repo, ".ordivon/project.yaml", `schema_version: 1\nid: ordivon-fixture\nname: Ordivon Fixture\nrepository: https://example.invalid/fixture\nkind: engineering\nmanaged_paths:\n  - docs/authority.md\npublic_projection: ordivon-web\n`);
    write(repo, "docs/authority.md", `---\nschema_version: 1\nid: fixture.authority\ntype: decision\nlifecycle: active\nsource_role: canonical\nvisibility: public\nupdated: 2026-08-29\n---\n# Fixture Authority\n\n## Decision\n\nCurrent public standing is owned by [STATUS](STATUS.md).\n`);
    write(repo, "docs/STATUS.md", `---\nschema_version: 1\nid: fixture.status\ntype: status\nlifecycle: active\nsource_role: canonical\nvisibility: public\nupdated: 2026-08-29\nevidence_status: verified\nreadiness: READY\nsummary: Fixture status.\n---\n# Fixture Status\n\n## Current state\n\nReady.\n`);
    write(repo, "tests/unrelated.txt", "baseline\n");
    git(repo, "add", ".");
    git(repo, "commit", "-qm", "fixture baseline");

    const clean = probePublicProjection(repo);
    assert.equal(clean.source.dirty, false);
    assert.equal(clean.admission.accepted, true);

    write(repo, "tests/unrelated.txt", "unrelated work in progress\n");
    const unrelatedDirty = probePublicProjection(repo);
    assert.equal(unrelatedDirty.source.dirty, false);
    assert.equal(unrelatedDirty.admission.accepted, true);
    assert.equal(unrelatedDirty.source.publicSourceDigest, clean.source.publicSourceDigest);

    write(repo, "docs/STATUS.md", `---\nschema_version: 1\nid: fixture.status\ntype: status\nlifecycle: active\nsource_role: historical\nvisibility: public\nupdated: 2026-08-29\nevidence_status: verified\nreadiness: READY\nsummary: Fixture status.\n---\n# Fixture Status\n\n## Current state\n\nMembership changed but uncommitted.\n`);
    const membershipDirty = probePublicProjection(repo);
    assert.equal(membershipDirty.source.documents.some((document) => document.path === "docs/STATUS.md"), false);
    assert.equal(membershipDirty.source.dirty, true);
    assert.equal(membershipDirty.admission.clean, false);
    assert.equal(membershipDirty.admission.accepted, false);
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});
