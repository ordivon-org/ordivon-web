import { readFile, writeFile } from "node:fs/promises";
import process from "node:process";

const [, , ballotPath, publicPath, keyPath] = process.argv;
if (!ballotPath || !publicPath || !keyPath) {
  console.error("usage: node scripts/blind-design-ballot.mjs <prepared-ballot.json> <public-ballot.json> <private-key.json>");
  process.exit(2);
}

const ballot = JSON.parse(await readFile(ballotPath, "utf8"));
if (ballot.schemaVersion !== 1 || !ballot.experimentId || !Array.isArray(ballot.comparisons) || ballot.comparisons.length === 0) {
  throw new Error("unsupported or empty prepared ballot");
}

const publicComparisons = [];
const keyComparisons = [];
for (const item of ballot.comparisons) {
  if (!item.comparisonId || !item.surface || !item.raterId || !item.raterClass || !item.left || !item.right || item.left === item.right) {
    throw new Error("prepared ballot comparison is incomplete");
  }
  if (item.winner !== null) throw new Error(`prepared comparison ${item.comparisonId} already contains a winner`);
  publicComparisons.push({
    comparisonId: item.comparisonId,
    surface: item.surface,
  });
  keyComparisons.push({
    comparisonId: item.comparisonId,
    experimentId: item.experimentId,
    surface: item.surface,
    raterId: item.raterId,
    raterClass: item.raterClass,
    left: item.left,
    right: item.right,
  });
}

const publicBallot = {
  schemaVersion: 1,
  experimentId: ballot.experimentId,
  evaluationQuestion: ballot.evaluationQuestion,
  comparisons: publicComparisons,
};
const privateKey = {
  schemaVersion: 1,
  experimentId: ballot.experimentId,
  seed: ballot.seed,
  comparisons: keyComparisons,
};

await writeFile(publicPath, `${JSON.stringify(publicBallot, null, 2)}\n`);
await writeFile(keyPath, `${JSON.stringify(privateKey, null, 2)}\n`);
console.log(`design_ballot_blinded=passed comparisons=${publicComparisons.length}`);
