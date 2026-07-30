import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

function resolveBuildId() {
  if (process.env.ORDIVON_BUILD_ID) return process.env.ORDIVON_BUILD_ID;
  return execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
}

async function filesUnder(directory) {
  const files = [];
  async function walk(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) await walk(full);
      else files.push(full);
    }
  }
  await walk(directory);
  return files.sort();
}

async function manifest() {
  const rows = [];
  for (const file of await filesUnder("out")) {
    const digest = createHash("sha256").update(await readFile(file)).digest("hex");
    rows.push(`${digest}  ${file.replace(/^out\//, "")}`);
  }
  return rows;
}

async function build(buildId) {
  await rm(".next", { recursive: true, force: true });
  await rm("out", { recursive: true, force: true });
  const result = spawnSync("pnpm", ["build"], {
    stdio: "inherit",
    env: { ...process.env, ORDIVON_BUILD_ID: buildId },
  });
  if (result.status !== 0) throw new Error(`build exited ${result.status}`);
  return manifest();
}

const buildId = resolveBuildId();
const first = await build(buildId);
const second = await build(buildId);
if (first.length !== second.length || first.some((row, index) => row !== second[index])) {
  const changed = first.filter((row, index) => row !== second[index]).slice(0, 20);
  throw new Error(`static export is not byte reproducible for build ${buildId}: ${changed.join("\n")}`);
}
const manifestText = `${second.join("\n")}\n`;
const manifestSha256 = createHash("sha256").update(manifestText).digest("hex");
await mkdir("artifacts/v2-round3", { recursive: true });
await writeFile("artifacts/v2-round3/reproducibility.json", `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  buildId,
  files: second.length,
  manifestSha256,
  byteReproducible: true,
}, null, 2)}\n`);
console.log(`byte-reproducible static export: ${second.length} files, build ${buildId}, manifest ${manifestSha256}`);
