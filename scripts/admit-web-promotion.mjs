import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import process from "node:process";

function git(cwd, args, options = {}) {
  return execFileSync("git", args, { cwd, encoding: "utf8", ...options }).trim();
}

function refExists(cwd, ref) {
  try {
    execFileSync("git", ["show-ref", "--verify", "--quiet", ref], {
      cwd,
      stdio: "ignore",
    });
    return true;
  } catch (error) {
    if (error && typeof error === "object" && error.status === 1) return false;
    throw error;
  }
}

export function ensurePromotionTag({ tagName, sourceRevision, envelope, cwd = process.cwd() }) {
  const ref = `refs/tags/${tagName}`;
  const message = JSON.stringify(envelope);
  if (!refExists(cwd, ref)) {
    execFileSync("git", ["tag", "-a", tagName, sourceRevision, "-m", `${message}\n`], {
      cwd,
      stdio: "inherit",
    });
    return "created";
  }

  if (git(cwd, ["cat-file", "-t", ref]) !== "tag") {
    throw new Error(`existing promotion ref is not an annotated tag: ${tagName}`);
  }
  const target = git(cwd, ["rev-parse", `${ref}^{}`]);
  if (target !== sourceRevision) {
    throw new Error(`existing promotion tag targets ${target}, expected ${sourceRevision}`);
  }
  const existingMessage = execFileSync(
    "git",
    ["for-each-ref", ref, "--format=%(contents)"],
    { cwd, encoding: "utf8" },
  ).trim();
  if (existingMessage !== message) {
    throw new Error(`existing promotion tag carries different admission content: ${tagName}`);
  }
  return "existing";
}

function runPreflight() {
  return execFileSync("node", ["scripts/run-web-promotion-preflight.mjs"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", process.stderr],
  });
}

function main() {
  const args = process.argv.slice(2);
  if (args.some((arg) => arg !== "--dry-run") || args.filter((arg) => arg === "--dry-run").length > 1) {
    console.error("promotion admission accepts only optional --dry-run; owner repository overrides are not publication authority");
    process.exit(2);
  }
  const dryRun = args.includes("--dry-run");

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
    const tagDisposition = dryRun
      ? "dry-run"
      : ensurePromotionTag({
          tagName,
          sourceRevision: result.receipt.sourceRevision,
          envelope,
        });
    process.stdout.write(`${JSON.stringify({ tagName, tagDisposition, dryRun, ...envelope }, null, 2)}\n`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(2);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
