import { execFileSync } from "node:child_process";
import process from "node:process";

const args = process.argv.slice(2);
if (args.some((arg) => arg !== "--dry-run") || args.filter((arg) => arg === "--dry-run").length > 1) {
  console.error("promotion admission accepts only optional --dry-run; owner repository overrides are not publication authority");
  process.exit(2);
}
const dryRun = args.includes("--dry-run");

function runPreflight() {
  return execFileSync("node", ["scripts/run-web-promotion-preflight.mjs"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", process.stderr],
  });
}

try {
  const result = JSON.parse(runPreflight());
  const shortRevision = result.receipt.sourceRevision.slice(0, 12);
  const shortReceipt = result.receiptDigest.slice(7, 19);
  const tagName = `web-promotion-${shortRevision}-${shortReceipt}`;
  const envelope = {
    schemaVersion: 0,
    kind: "ordivon.web-promotion-admission-experimental",
    receiptDigest: result.receiptDigest,
    receipt: result.receipt,
  };
  const message = `${JSON.stringify(envelope)}\n`;
  if (!dryRun) {
    execFileSync("git", ["tag", "-a", tagName, result.receipt.sourceRevision, "-m", message], { stdio: "inherit" });
  }
  process.stdout.write(`${JSON.stringify({ tagName, dryRun, ...envelope }, null, 2)}\n`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(2);
}
