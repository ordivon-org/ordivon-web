import assert from "node:assert/strict";
import test from "node:test";

import { reportAgentWebCurrentness } from "../scripts/report-agent-web-currentness.mjs";

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
