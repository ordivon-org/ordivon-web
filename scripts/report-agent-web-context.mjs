import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const readJson = async (path) => JSON.parse(await readFile(resolve(ROOT, path), "utf8"));
const design = await readJson("design/context.json");
const tokens = await readJson("design/tokens.json");

function collectTokenPaths(node, path = [], inheritedType = null, result = []) {
  if (!node || typeof node !== "object" || Array.isArray(node)) return result;
  const type = typeof node.$type === "string" ? node.$type : inheritedType;
  if (Object.hasOwn(node, "$value")) {
    result.push({
      path: path.join("."),
      type,
      variable: node.$extensions?.["org.ordivon.css"]?.variable,
      description: node.$description || null,
    });
    return result;
  }
  for (const [key, value] of Object.entries(node)) if (!key.startsWith("$")) collectTokenPaths(value, [...path, key], type, result);
  return result;
}

const projectedProjects = [];
for (const slug of ["harness", "security", "game"]) {
  const source = await readJson(`content/projects/${slug}-source.json`);
  const publication = await readJson(`content/projects/${slug}-publication.json`);
  projectedProjects.push({
    slug,
    projectId: source.project.id,
    sourceRevision: source.source.revision,
    publicSourceDigest: source.source.publicSourceDigest,
    sourceUpdatedAt: source.source.updated,
    dependencyCount: source.source.documents.length,
    maturity: publication.project.maturity,
    publicState: publication.project.state,
  });
}

const output = {
  schemaVersion: 1,
  kind: "ordivon.web.agent-context-report",
  canonicalEntry: "content/editorial/agent-web-system.md",
  authority: design.authority,
  projectedProjects,
  design: {
    tokenSource: design.authority.tokens,
    tokens: collectTokenPaths(tokens),
    primitives: design.primitives,
    benchmarkSurfaces: design.benchmarkSurfaces,
    expressionProfile: design.authority.expressionProfile,
    upstreamExpressionResearch: design.upstreamExpressionResearch,
  },
};

process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
