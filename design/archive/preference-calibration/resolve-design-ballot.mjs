import { readFile } from "node:fs/promises";
import process from "node:process";

const [, , keyPath, responsesPath] = process.argv;
if (!keyPath || !responsesPath) {
  console.error("usage: node design/archive/preference-calibration/resolve-design-ballot.mjs <private-key.json> <responses.json>");
  process.exit(2);
}

const key = JSON.parse(await readFile(keyPath, "utf8"));
const responses = JSON.parse(await readFile(responsesPath, "utf8"));
if (key.schemaVersion !== 1 || !Array.isArray(key.comparisons)) throw new Error("unsupported private ballot key");
const answerList = Array.isArray(responses) ? responses : responses.responses;
if (!Array.isArray(answerList)) throw new Error("responses must be an array or responses array");

const keyById = new Map(key.comparisons.map((item) => [item.comparisonId, item]));
if (keyById.size !== key.comparisons.length) throw new Error("private key contains duplicate comparison ids");
const seen = new Set();
const votes = [];
for (const response of answerList) {
  if (!response.comparisonId || !["left", "right"].includes(response.choice)) throw new Error("each response requires comparisonId and choice=left|right");
  if (seen.has(response.comparisonId)) throw new Error(`duplicate response ${response.comparisonId}`);
  seen.add(response.comparisonId);
  const item = keyById.get(response.comparisonId);
  if (!item) throw new Error(`unknown comparison ${response.comparisonId}`);
  votes.push({
    comparisonId: item.comparisonId,
    experimentId: item.experimentId,
    surface: item.surface,
    raterId: item.raterId,
    raterClass: item.raterClass,
    left: item.left,
    right: item.right,
    winner: response.choice === "left" ? item.left : item.right,
  });
}
if (votes.length !== key.comparisons.length) {
  throw new Error(`incomplete ballot: received ${votes.length} of ${key.comparisons.length} responses`);
}
process.stdout.write(`${JSON.stringify({ schemaVersion: 1, comparisons: votes }, null, 2)}\n`);
