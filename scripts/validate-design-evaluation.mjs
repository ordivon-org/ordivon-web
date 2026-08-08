import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";

const root = process.cwd();
const temp = mkdtempSync(join(tmpdir(), "ordivon-design-eval-"));

try {
  const prepare = join(root, "scripts/prepare-design-comparisons.mjs");
  const rank = join(root, "scripts/rank-design-preferences.mjs");
  const blind = join(root, "scripts/blind-design-ballot.mjs");
  const resolve = join(root, "scripts/resolve-design-ballot.mjs");
  const renderReview = join(root, "scripts/render-blind-design-review.mjs");
  const spec = join(root, "design/evaluation-spec.example.json");

  const ballotA = execFileSync(process.execPath, [prepare, spec, "expert-1", "expert", "42"], { encoding: "utf8" });
  const ballotB = execFileSync(process.execPath, [prepare, spec, "expert-1", "expert", "42"], { encoding: "utf8" });
  const ballotC = execFileSync(process.execPath, [prepare, spec, "expert-1", "expert", "43"], { encoding: "utf8" });
  assert.equal(ballotA, ballotB, "same seed must reproduce the exact blind ballot");
  assert.notEqual(ballotA, ballotC, "different seeds should change ordering or side assignment");

  const parsedBallot = JSON.parse(ballotA);
  assert.equal(parsedBallot.comparisons.length, 9, "3 variants × 3 surfaces should create 9 comparisons per evaluator");
  assert.deepEqual(new Set(parsedBallot.comparisons.map((item) => item.surface)), new Set(["home", "project", "long-form"]));
  assert.ok(parsedBallot.comparisons.every((item) => item.winner === null), "prepared ballots must not contain a winner");

  const preparedPath = join(temp, "prepared.json");
  const publicPath = join(temp, "public.json");
  const keyPath = join(temp, "private-key.json");
  const reviewPath = join(temp, "review.html");
  writeFileSync(preparedPath, ballotA);
  execFileSync(process.execPath, [blind, preparedPath, publicPath, keyPath], { encoding: "utf8" });
  execFileSync(process.execPath, [renderReview, publicPath, reviewPath], { encoding: "utf8" });
  const publicText = readFileSync(publicPath, "utf8");
  const reviewText = readFileSync(reviewPath, "utf8");
  for (const identity of ["baseline", "candidate-a", "candidate-b"]) {
    assert.ok(!publicText.includes(identity), `public ballot leaked ${identity}`);
    assert.ok(!reviewText.includes(identity), `review HTML leaked ${identity}`);
  }
  const publicBallot = JSON.parse(publicText);
  const sideResponsesPath = join(temp, "side-responses.json");
  writeFileSync(sideResponsesPath, `${JSON.stringify({ responses: publicBallot.comparisons.map((item, index) => ({ comparisonId: item.comparisonId, choice: index % 2 === 0 ? "left" : "right" })) }, null, 2)}\n`);
  const resolved = JSON.parse(execFileSync(process.execPath, [resolve, keyPath, sideResponsesPath], { encoding: "utf8" }));
  assert.equal(resolved.comparisons.length, parsedBallot.comparisons.length);
  assert.ok(resolved.comparisons.every((item) => [item.left, item.right].includes(item.winner)));

  const votes = [];
  for (const [raterId, raterClass] of [["expert-1", "expert"], ["expert-2", "expert"], ["lay-1", "lay"], ["agent-1", "agent"]]) {
    for (const surface of ["home", "project", "long-form"]) {
      for (const [left, right] of [["baseline", "candidate-a"], ["baseline", "candidate-b"], ["candidate-a", "candidate-b"]]) {
        const winner = surface === "long-form" && (left === "candidate-b" || right === "candidate-b")
          ? "candidate-b"
          : (left === "candidate-a" || right === "candidate-a" ? "candidate-a" : "candidate-b");
        votes.push({ comparisonId: `${raterId}:${surface}:${left}:${right}`, surface, raterId, raterClass, left, right, winner });
      }
    }
  }

  const votesPath = join(temp, "votes.json");
  writeFileSync(votesPath, `${JSON.stringify(votes, null, 2)}\n`);
  const ranked = JSON.parse(execFileSync(process.execPath, [rank, votesPath], { encoding: "utf8" }));
  assert.equal(ranked.comparisons, 36);
  assert.equal(ranked.raters, 4);
  assert.equal(ranked.overall[0].variant, "candidate-a");
  assert.equal(ranked.bySurface.home[0].variant, "candidate-a");
  assert.equal(ranked.bySurface.project[0].variant, "candidate-a");
  assert.equal(ranked.bySurface["long-form"][0].variant, "candidate-b");
  const overallBaselineVsA = ranked.headToHead.find((item) => [item.variantA, item.variantB].includes("baseline") && [item.variantA, item.variantB].includes("candidate-a"));
  assert.equal(overallBaselineVsA.games, 12);
  assert.equal(overallBaselineVsA.raters, 4);
  assert.equal(overallBaselineVsA.surfaces, 3);
  assert.equal(overallBaselineVsA.maxVotesPerRater, 3);
  assert.equal(overallBaselineVsA.independentEvaluatorVotes, false);
  assert.equal(overallBaselineVsA.intervalUnit, "comparison");
  const homeBaselineVsA = ranked.headToHeadBySurface.home.find((item) => [item.variantA, item.variantB].includes("baseline") && [item.variantA, item.variantB].includes("candidate-a"));
  assert.equal(homeBaselineVsA.games, 4);
  assert.equal(homeBaselineVsA.raters, 4);
  assert.equal(homeBaselineVsA.surfaces, 1);
  assert.equal(homeBaselineVsA.maxVotesPerRater, 1);
  assert.equal(homeBaselineVsA.independentEvaluatorVotes, true);
  assert.equal(homeBaselineVsA.intervalUnit, "evaluator");
  assert.equal(homeBaselineVsA.preferred, "candidate-a");
  assert.ok(homeBaselineVsA.winRateA95[0] >= 0 && homeBaselineVsA.winRateA95[1] <= 1);
  assert.ok(ranked.overall.every((item) => item.winRate95[0] >= 0 && item.winRate95[1] <= 1 && item.winRate95Unit === "comparison"));
  assert.equal(ranked.inference.populationUnit, "evaluator");

  const invalidPath = join(temp, "invalid.json");
  writeFileSync(invalidPath, '[{"surface":"home","raterId":"x","raterClass":"expert","left":"a","right":"b","winner":"c"}]\n');
  const invalid = spawnSync(process.execPath, [rank, invalidPath], { encoding: "utf8" });
  assert.notEqual(invalid.status, 0, "winner outside the displayed pair must fail closed");
  assert.match(invalid.stderr, /invalid winner/);

  const example = JSON.parse(readFileSync(spec, "utf8"));
  assert.equal(example.schemaVersion, 1);
  console.log("design_evaluation=passed pairings=9 blinded=true inference_unit=evaluator synthetic_votes=36 slices=surface,raterClass");
} finally {
  rmSync(temp, { recursive: true, force: true });
}
