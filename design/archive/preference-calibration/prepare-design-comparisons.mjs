import { readFile } from "node:fs/promises";
import process from "node:process";

function usage() {
  console.error("usage: node design/archive/preference-calibration/prepare-design-comparisons.mjs <spec.json> <rater-id> <rater-class> [seed]");
  process.exit(2);
}

const [, , specPath, raterId, raterClass, seedArg = "1"] = process.argv;
if (!specPath || !raterId || !raterClass) usage();
if (!new Set(["expert", "lay", "agent"]).has(raterClass)) throw new Error("rater-class must be expert, lay, or agent");

const spec = JSON.parse(await readFile(specPath, "utf8"));
if (spec.schemaVersion !== 1 || !spec.id) throw new Error("unsupported design evaluation spec");
if (!Array.isArray(spec.variants) || spec.variants.length < 2 || new Set(spec.variants).size !== spec.variants.length) throw new Error("spec requires at least two unique variants");
if (!Array.isArray(spec.surfaces) || spec.surfaces.length < 1 || new Set(spec.surfaces).size !== spec.surfaces.length) throw new Error("spec requires unique surfaces");

let state = Number(seedArg) >>> 0;
function random() {
  state = (1664525 * state + 1013904223) >>> 0;
  return state / 0x100000000;
}

const comparisons = [];
for (const surface of spec.surfaces) {
  for (let i = 0; i < spec.variants.length; i += 1) {
    for (let j = i + 1; j < spec.variants.length; j += 1) {
      const pair = random() < 0.5 ? [spec.variants[i], spec.variants[j]] : [spec.variants[j], spec.variants[i]];
      comparisons.push({
        comparisonId: `${spec.id}:${surface}:${i}-${j}:${raterId}`,
        experimentId: spec.id,
        surface,
        raterId,
        raterClass,
        left: pair[0],
        right: pair[1],
        winner: null,
      });
    }
  }
}

for (let i = comparisons.length - 1; i > 0; i -= 1) {
  const j = Math.floor(random() * (i + 1));
  [comparisons[i], comparisons[j]] = [comparisons[j], comparisons[i]];
}

process.stdout.write(`${JSON.stringify({
  schemaVersion: 1,
  experimentId: spec.id,
  evaluationQuestion: spec.evaluationQuestion || "Which version is more publication-ready for Ordivon?",
  seed: Number(seedArg),
  comparisons,
}, null, 2)}\n`);
