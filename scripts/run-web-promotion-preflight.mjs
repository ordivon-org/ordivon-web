import { execFileSync } from "node:child_process";
import process from "node:process";

import { buildPromotionReceipt } from "./prepare-web-promotion.mjs";
import { reportAgentWebCurrentness } from "./report-agent-web-currentness.mjs";
import { requireCanonicalSourceIntegration } from "./source-integration.mjs";

function runLogged(command, args) {
  execFileSync(command, args, { stdio: ["ignore", process.stderr, process.stderr] });
}

try {
  if (process.argv.length !== 2) throw new Error("promotion preflight does not accept owner repository overrides");
  requireCanonicalSourceIntegration();
  const before = await reportAgentWebCurrentness(["--require-current"]);
  if (before.admission.accepted !== true) throw new Error("initial owner currentness gate rejected promotion");
  runLogged("pnpm", ["check"]);
  runLogged("pnpm", ["pages:prepare"]);
  const after = await reportAgentWebCurrentness(["--require-current"]);
  if (after.admission.accepted !== true) throw new Error("final owner currentness gate rejected promotion");
  const result = await buildPromotionReceipt({ currentnessReport: after, verificationProfile: "pnpm-check+pages-prepare" });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(2);
}
