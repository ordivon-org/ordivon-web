import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const context = JSON.parse(await readFile(resolve(ROOT, "design/context.json"), "utf8"));
const tokens = JSON.parse(await readFile(resolve(ROOT, "design/tokens.json"), "utf8"));

function fail(message) {
  throw new Error(`design context: ${message}`);
}

async function exists(relativePath) {
  try { await stat(resolve(ROOT, relativePath)); return true; } catch { return false; }
}

function collectTokens(node, inheritedType = null, result = []) {
  if (!node || typeof node !== "object" || Array.isArray(node)) return result;
  const type = typeof node.$type === "string" ? node.$type : inheritedType;
  if (Object.hasOwn(node, "$value")) {
    result.push({ type, variable: node.$extensions?.["org.ordivon.css"]?.variable });
    return result;
  }
  for (const [key, value] of Object.entries(node)) if (!key.startsWith("$")) collectTokens(value, type, result);
  return result;
}

if (context.schemaVersion !== 1 || context.kind !== "ordivon.web.design-context") fail("unsupported context schema");

for (const [name, path] of Object.entries(context.authority || {})) {
  if (typeof path !== "string" || !(await exists(path))) fail(`authority ${name} points to missing ${path}`);
}

const primitiveIds = new Set();
for (const primitive of context.primitives || []) {
  if (!primitive.id || primitiveIds.has(primitive.id)) fail(`duplicate or missing primitive id ${primitive.id}`);
  primitiveIds.add(primitive.id);
  if (!(await exists(primitive.source))) fail(`primitive ${primitive.id} source is missing: ${primitive.source}`);
  const source = await readFile(resolve(ROOT, primitive.source), "utf8");
  for (const name of primitive.exports || []) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (!new RegExp(`export\\s+(?:async\\s+)?(?:function|const|class)\\s+${escaped}\\b`).test(source)) {
      fail(`primitive ${primitive.id} cannot find exported symbol ${name} in ${primitive.source}`);
    }
  }
}

const surfaceIds = new Set();
const surfaceRoutes = new Set();
for (const surface of context.benchmarkSurfaces || []) {
  if (!surface.id || surfaceIds.has(surface.id)) fail(`duplicate or missing benchmark surface id ${surface.id}`);
  if (typeof surface.route !== "string" || !surface.route.startsWith("/")) fail(`surface ${surface.id} has invalid route`);
  if (surfaceRoutes.has(surface.route)) fail(`duplicate benchmark route ${surface.route}`);
  if (!surface.primaryTask || !Array.isArray(surface.visualConcerns) || surface.visualConcerns.length === 0) fail(`surface ${surface.id} lacks evaluation context`);
  surfaceIds.add(surface.id);
  surfaceRoutes.add(surface.route);
}
if (surfaceIds.size < 3) fail("benchmark set is too narrow to compare unlike page tasks");

const expression = context.upstreamExpressionResearch;
if (!expression || typeof expression !== "object") fail("missing upstream expression research binding");
if (typeof expression.repository !== "string" || !expression.repository) fail("upstream expression research lacks repository");
if (typeof expression.revision !== "string" || !/^[0-9a-f]{40}$/.test(expression.revision)) fail("upstream expression research lacks exact Git revision");
if (typeof expression.path !== "string" || !expression.path) fail("upstream expression research lacks path");
if (typeof expression.role !== "string" || !expression.role) fail("upstream expression research lacks role");
for (const field of ["protocol", "knowledgeModel", "profileBaseline"]) {
  if (typeof expression[field] !== "string" || !expression[field]) fail(`upstream expression research lacks ${field}`);
}

const consumption = context.expressionConsumption;
if (!consumption || typeof consumption !== "object") fail("missing expression consumption contract");
if (consumption.knowledgeLayer !== "medium_prior") fail("Web expression profile must remain a medium prior");
if (JSON.stringify(consumption.coreLoop) !== JSON.stringify(["frame", "bind", "express", "render", "audit", "decide"])) fail("Web expression loop drifted from Studio core");
for (const outcome of ["revise", "no-op", "promote"]) if (!consumption.decisionOutcomes?.includes(outcome)) fail(`missing expression decision outcome ${outcome}`);

const tokenList = collectTokens(tokens);
const variables = new Set();
for (const token of tokenList) {
  if (!token.type || typeof token.variable !== "string" || !token.variable.startsWith("--")) fail("token lacks type or CSS variable mapping");
  if (variables.has(token.variable)) fail(`duplicate token variable ${token.variable}`);
  variables.add(token.variable);
}
if (!tokenList.length) fail("token source is empty");

console.log(`design_context=passed tokens=${tokenList.length} primitives=${primitiveIds.size} surfaces=${surfaceIds.size} expression_revision=${expression.revision.slice(0, 8)}`);
