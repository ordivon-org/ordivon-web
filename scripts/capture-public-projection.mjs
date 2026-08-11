import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import process from "node:process";
import { probePublicProjection } from "./probe-public-projection.mjs";

const args = process.argv.slice(2);
const check = args[0] === "--check";
const [repo, output] = check ? args.slice(1) : args;
if (!repo || !output) {
  console.error("usage: node scripts/capture-public-projection.mjs [--check] <repo> <output>");
  process.exit(2);
}

const projection = probePublicProjection(repo);
if (!projection.admission.accepted) {
  console.error(`projection source rejected: ${JSON.stringify(projection.admission)}`);
  process.exit(1);
}

const destination = resolve(output);
const serialized = `${JSON.stringify(projection, null, 2)}\n`;
if (check) {
  const existing = await readFile(destination, "utf8");
  if (existing !== serialized) {
    console.error(`projection_capture=drift project=${projection.project.id} revision=${projection.source.revision} output=${output}`);
    process.exit(1);
  }
  console.log(`projection_capture=verified project=${projection.project.id} revision=${projection.source.revision} output=${output}`);
} else {
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, serialized);
  console.log(`projection_capture=written project=${projection.project.id} revision=${projection.source.revision} output=${output}`);
}
