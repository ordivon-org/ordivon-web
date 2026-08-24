import { execFileSync, spawnSync } from "node:child_process";
import process from "node:process";

function git(cwd, ...args) {
  return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
}

export function inspectCanonicalSourceIntegration({
  cwd = process.cwd(),
  remote = "origin",
  branch = "main",
  refresh = true,
} = {}) {
  if (refresh) execFileSync("git", ["fetch", remote, branch, "--quiet"], { cwd, stdio: "ignore" });
  const sourceRevision = git(cwd, "rev-parse", "HEAD");
  const remoteRef = `refs/remotes/${remote}/${branch}`;
  let canonicalRevision;
  try {
    canonicalRevision = git(cwd, "rev-parse", remoteRef);
  } catch {
    throw new Error(`canonical Web source ref is unavailable: ${remote}/${branch}`);
  }
  const ancestry = spawnSync("git", ["merge-base", "--is-ancestor", sourceRevision, canonicalRevision], {
    cwd,
    encoding: "utf8",
  });
  if (ancestry.status !== 0 && ancestry.status !== 1) {
    throw new Error(ancestry.stderr.trim() || "failed to compare Web source with canonical branch");
  }
  return {
    sourceRevision,
    canonicalRef: `${remote}/${branch}`,
    canonicalRevision,
    integrated: ancestry.status === 0,
    truthRole: "source-integration-currentness-not-publication-authority",
  };
}

export function requireCanonicalSourceIntegration(options = {}) {
  const result = inspectCanonicalSourceIntegration(options);
  if (!result.integrated) {
    throw new Error(
      `promotion admission requires Web source ${result.sourceRevision} to be integrated into ${result.canonicalRef} before publication admission; current ${result.canonicalRef} is ${result.canonicalRevision}`,
    );
  }
  return result;
}
