import { readFile } from "node:fs/promises";
import process from "node:process";

const [, , votesPath] = process.argv;
if (!votesPath) {
  console.error("usage: node design/archive/preference-calibration/rank-design-preferences.mjs <votes.json>");
  process.exit(2);
}

const input = JSON.parse(await readFile(votesPath, "utf8"));
const votes = Array.isArray(input) ? input : input.comparisons;
if (!Array.isArray(votes) || votes.length === 0) throw new Error("votes must be a non-empty array or comparisons array");

for (const vote of votes) {
  if (!vote.left || !vote.right || vote.left === vote.right) throw new Error("each vote requires distinct left/right variants");
  if (![vote.left, vote.right].includes(vote.winner)) throw new Error(`comparison ${vote.comparisonId || "<unknown>"} has invalid winner`);
  if (!vote.surface || !vote.raterClass) throw new Error("each vote requires surface and raterClass");
}

function wilson(wins, total, z = 1.959963984540054) {
  if (!total) return [0, 1];
  const p = wins / total;
  const denom = 1 + z * z / total;
  const center = (p + z * z / (2 * total)) / denom;
  const margin = z * Math.sqrt((p * (1 - p) + z * z / (4 * total)) / total) / denom;
  return [Math.max(0, center - margin), Math.min(1, center + margin)];
}

function headToHead(segment) {
  const pairs = new Map();
  for (const vote of segment) {
    const [variantA, variantB] = [vote.left, vote.right].sort();
    const key = `${variantA}\u0000${variantB}`;
    const current = pairs.get(key) || { variantA, variantB, games: 0, winsA: 0, winsB: 0 };
    current.games += 1;
    if (vote.winner === variantA) current.winsA += 1;
    else current.winsB += 1;
    pairs.set(key, current);
  }

  return [...pairs.values()].map((pair) => {
    const pairVotes = segment.filter((vote) => {
      const [variantA, variantB] = [vote.left, vote.right].sort();
      return variantA === pair.variantA && variantB === pair.variantB;
    });
    const votesPerRater = new Map();
    for (const vote of pairVotes) votesPerRater.set(vote.raterId, (votesPerRater.get(vote.raterId) || 0) + 1);
    const raters = votesPerRater.size;
    const surfaces = new Set(pairVotes.map((vote) => vote.surface)).size;
    const maxVotesPerRater = Math.max(...votesPerRater.values());
    const independentEvaluatorVotes = maxVotesPerRater === 1;
    const winRateA = pair.winsA / pair.games;
    return {
      ...pair,
      raters,
      surfaces,
      maxVotesPerRater,
      independentEvaluatorVotes,
      intervalUnit: independentEvaluatorVotes ? "evaluator" : "comparison",
      winRateA,
      winRateA95: wilson(pair.winsA, pair.games),
      preferred: pair.winsA > pair.winsB ? pair.variantA : pair.winsB > pair.winsA ? pair.variantB : null,
    };
  }).sort((left, right) => left.variantA.localeCompare(right.variantA) || left.variantB.localeCompare(right.variantB));
}

function rank(segment) {
  const variants = [...new Set(segment.flatMap((vote) => [vote.left, vote.right]))].sort();
  const index = new Map(variants.map((variant, i) => [variant, i]));
  const n = variants.length;
  const wins = Array(n).fill(0);
  const matches = Array(n).fill(0);
  const pairMatches = Array.from({ length: n }, () => Array(n).fill(0));

  for (const vote of segment) {
    const a = index.get(vote.left);
    const b = index.get(vote.right);
    const w = index.get(vote.winner);
    wins[w] += 1;
    matches[a] += 1;
    matches[b] += 1;
    pairMatches[a][b] += 1;
    pairMatches[b][a] += 1;
  }

  // Minorization-maximization Bradley–Terry fit with a small symmetric prior
  // for observed pairs so tiny experiments do not diverge to infinite ratings.
  let strength = Array(n).fill(1);
  const prior = 0.5;
  for (let iteration = 0; iteration < 500; iteration += 1) {
    const next = Array(n).fill(0);
    for (let i = 0; i < n; i += 1) {
      let adjustedWins = wins[i];
      let denom = 0;
      for (let j = 0; j < n; j += 1) {
        if (i === j || pairMatches[i][j] === 0) continue;
        adjustedWins += prior;
        const adjustedMatches = pairMatches[i][j] + 2 * prior;
        denom += adjustedMatches / (strength[i] + strength[j]);
      }
      next[i] = denom > 0 ? adjustedWins / denom : 1;
    }
    const geometricMean = Math.exp(next.reduce((sum, value) => sum + Math.log(Math.max(value, 1e-12)), 0) / n);
    next.forEach((value, i) => { next[i] = value / geometricMean; });
    const delta = Math.max(...next.map((value, i) => Math.abs(value - strength[i])));
    strength = next;
    if (delta < 1e-10) break;
  }

  return variants.map((variant, i) => {
    const [low, high] = wilson(wins[i], matches[i]);
    return {
      variant,
      comparisons: matches[i],
      wins: wins[i],
      winRate: matches[i] ? wins[i] / matches[i] : 0,
      winRate95: [low, high],
      winRate95Unit: "comparison",
      btStrength: strength[i],
      btRating: 1000 + 400 * Math.log10(strength[i]),
    };
  }).sort((a, b) => b.btRating - a.btRating);
}

function slicesBy(field, summarize) {
  const values = [...new Set(votes.map((vote) => vote[field]))].sort();
  return Object.fromEntries(values.map((value) => [value, summarize(votes.filter((vote) => vote[field] === value))]));
}

const result = {
  schemaVersion: 1,
  comparisons: votes.length,
  raters: new Set(votes.map((vote) => vote.raterId)).size,
  inference: {
    populationUnit: "evaluator",
    overallIntervals: "comparison-level descriptive only",
    directSurfacePairIntervals: "evaluator-level only when independentEvaluatorVotes=true",
  },
  overall: rank(votes),
  headToHead: headToHead(votes),
  bySurface: slicesBy("surface", rank),
  headToHeadBySurface: slicesBy("surface", headToHead),
  byRaterClass: slicesBy("raterClass", rank),
  headToHeadByRaterClass: slicesBy("raterClass", headToHead),
};
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
