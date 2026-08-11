import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import process from "node:process";

const INPUT = new URL("../design/tokens.json", import.meta.url);
const OUTPUT = new URL("../styles/generated-design-tokens.css", import.meta.url);
const EXTENSION = "org.ordivon.css";
const GENERIC_FAMILIES = new Set(["serif", "sans-serif", "monospace", "cursive", "fantasy", "system-ui", "ui-serif", "ui-sans-serif", "ui-monospace"]);

function fail(message) {
  throw new Error(`design tokens: ${message}`);
}

function collect(node, path = [], inheritedType = null, result = []) {
  if (!node || typeof node !== "object" || Array.isArray(node)) return result;
  const localType = typeof node.$type === "string" ? node.$type : inheritedType;
  if (Object.hasOwn(node, "$value")) {
    const css = node.$extensions?.[EXTENSION];
    if (!css || typeof css.variable !== "string" || !css.variable.startsWith("--")) {
      fail(`${path.join(".") || "<root>"} is missing ${EXTENSION}.variable`);
    }
    if (!localType) fail(`${path.join(".")} has no token type`);
    result.push({ path: path.join("."), type: localType, value: node.$value, variable: css.variable });
    return result;
  }
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    collect(value, [...path, key], localType, result);
  }
  return result;
}

function colorToCss(value, path) {
  if (!value || value.colorSpace !== "srgb" || !Array.isArray(value.components) || value.components.length !== 3) {
    fail(`${path} must use an explicit sRGB color value`);
  }
  if (value.components.some((item) => typeof item !== "number" || item < 0 || item > 1)) {
    fail(`${path} has invalid sRGB components`);
  }
  const alpha = value.alpha ?? 1;
  if (typeof alpha !== "number" || alpha < 0 || alpha > 1) fail(`${path} has invalid alpha`);
  if (alpha === 1 && typeof value.hex === "string") return value.hex.toLowerCase();
  const [r, g, b] = value.components.map((item) => Math.round(item * 255));
  return `rgba(${r},${g},${b},${alpha})`;
}

function dimensionToCss(value, path) {
  if (!value || typeof value.value !== "number" || !["px", "rem"].includes(value.unit)) {
    fail(`${path} must use a numeric px/rem dimension`);
  }
  return `${value.value}${value.unit}`;
}

function fontFamilyToCss(value, path) {
  const families = typeof value === "string" ? [value] : value;
  if (!Array.isArray(families) || families.length === 0 || families.some((item) => typeof item !== "string" || !item.trim())) {
    fail(`${path} must use a non-empty fontFamily string or array`);
  }
  return families.map((family) => GENERIC_FAMILIES.has(family) ? family : JSON.stringify(family)).join(",");
}

function tokenToCss(token) {
  if (token.type === "color") return colorToCss(token.value, token.path);
  if (token.type === "dimension") return dimensionToCss(token.value, token.path);
  if (token.type === "fontFamily") return fontFamilyToCss(token.value, token.path);
  fail(`${token.path} uses unsupported type ${token.type}`);
}

function render(tokens, sourceDigest) {
  const seen = new Set();
  const rows = tokens.map((token) => {
    if (seen.has(token.variable)) fail(`duplicate CSS variable ${token.variable}`);
    seen.add(token.variable);
    return `  ${token.variable}:${tokenToCss(token)};`;
  });
  return `/* Generated from design/tokens.json. Do not edit. source=${sourceDigest} */\n:root {\n${rows.join("\n")}\n}\n`;
}

const source = await readFile(INPUT, "utf8");
const data = JSON.parse(source);
const tokens = collect(data);
if (!tokens.length) fail("no tokens found");
const digest = `sha256:${createHash("sha256").update(source).digest("hex")}`;
const output = render(tokens, digest);

if (process.argv.includes("--check")) {
  let current = "";
  try { current = await readFile(OUTPUT, "utf8"); } catch {}
  if (current !== output) {
    console.error(`design_token_projection=drift tokens=${tokens.length}`);
    process.exit(1);
  }
  console.log(`design_token_projection=verified tokens=${tokens.length} digest=${digest}`);
} else {
  await writeFile(OUTPUT, output);
  console.log(`design_token_projection=written tokens=${tokens.length} digest=${digest}`);
}
