import { createHash } from "node:crypto";
import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, resolve, sep } from "node:path";
import process from "node:process";
import { configureBrowserTempEnvironment } from "./browser-runtime.mjs";
import { resolveBrowserExecutable } from "./browser-equipment.mjs";

const ROOT = process.cwd();
const browserTempRoot = await configureBrowserTempEnvironment();
const { chromium } = await import("@playwright/test");

function sha256(value) {
  const bytes = Buffer.isBuffer(value) ? value : Buffer.from(typeof value === "string" ? value : JSON.stringify(value));
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  return value;
}

function digestJson(value) { return sha256(JSON.stringify(stable(value))); }

function parseArgs(argv) {
  let manifest = "experiments/r6/instrumentation-fixture.json";
  let participants = 40;
  let outputDir = "out/r6/encounter";
  let mode = "instrumentation";
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--manifest") manifest = argv[++index];
    else if (arg === "--participants") participants = Number(argv[++index]);
    else if (arg === "--output-dir") outputDir = argv[++index];
    else if (arg === "--mode") mode = argv[++index];
    else throw new Error(`unknown argument: ${arg}`);
  }
  if (!manifest || !Number.isInteger(participants) || participants < 2 || !outputDir) throw new Error("invalid R6 encounter arguments");
  if (!["instrumentation", "capture"].includes(mode)) throw new Error("--mode must be instrumentation or capture");
  return { manifest: resolve(ROOT, manifest), participants, outputDir: resolve(ROOT, outputDir), mode };
}

function validateManifest(raw) {
  if (raw?.schemaVersion !== 1 || raw?.kind !== "ordivon.web.r6-encounter-manifest") throw new Error("unsupported R6 encounter manifest");
  if (!raw.experimentId || !raw.assignmentSalt || !Array.isArray(raw.variants) || raw.variants.length < 2) throw new Error("incomplete encounter manifest");
  const ids = new Set();
  let probability = 0;
  const variants = raw.variants.map((item) => {
    if (!item?.variantId || ids.has(item.variantId)) throw new Error("variant IDs must be unique non-empty strings");
    ids.add(item.variantId);
    if (!(item.probability > 0 && item.probability <= 1)) throw new Error(`invalid probability for ${item.variantId}`);
    probability += item.probability;
    if (!Array.isArray(item.sections) || !item.sections.length) throw new Error(`variant ${item.variantId} requires sections`);
    const normalized = { ...item, variantDigest: digestJson({ variantId: item.variantId, title: item.title, sections: item.sections }) };
    return normalized;
  });
  if (Math.abs(probability - 1) > 1e-9) throw new Error(`variant probabilities must sum to 1, got ${probability}`);
  return { ...raw, variants, manifestDigest: digestJson({ ...raw, variants: variants.map((item) => ({ variantId: item.variantId, probability: item.probability, title: item.title, sections: item.sections })) }) };
}

function assignmentUniform(salt, participantId) {
  const bytes = createHash("sha256").update(`${salt}\0${participantId}`).digest();
  return bytes.readUIntBE(0, 6) / 2 ** 48;
}

function assignVariant(manifest, participantId) {
  const u = assignmentUniform(manifest.assignmentSalt, participantId);
  let cumulative = 0;
  for (const variant of manifest.variants) {
    cumulative += variant.probability;
    if (u < cumulative) return { variant, assignmentUniform: u };
  }
  return { variant: manifest.variants.at(-1), assignmentUniform: u };
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function renderPage({ manifest, participantId, assignmentId, variant, mode }) {
  const sections = variant.sections.map((section) => `<section data-evidence-id="${escapeHtml(section.evidenceId)}"><h2>${escapeHtml(section.heading || section.evidenceId)}</h2><p>${escapeHtml(section.text)}</p></section>`).join("\n");
  const instrumentation = mode === "instrumentation" ? `<button type="button" data-instrumentation-outcome="acknowledged">Record instrumentation outcome</button>` : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(variant.title || manifest.experimentId)}</title><style>html{font-family:ui-sans-serif,system-ui;background:#111;color:#f5f5f2}body{max-width:760px;margin:0 auto;padding:48px 24px 80px;line-height:1.65}main{display:grid;gap:28px}section{padding:20px 0;border-top:1px solid #444}h1{font-size:clamp(2rem,6vw,4.4rem);line-height:.95}h2{font-size:1rem;text-transform:uppercase;letter-spacing:.08em;color:#bbb}button{margin-top:24px;padding:12px 16px;font:inherit;background:#f5f5f2;color:#111;border:0}</style></head><body><main data-experiment-id="${escapeHtml(manifest.experimentId)}" data-assignment-id="${escapeHtml(assignmentId)}" data-participant-id="${escapeHtml(participantId)}" data-variant-id="${escapeHtml(variant.variantId)}" data-variant-digest="${escapeHtml(variant.variantDigest)}"><header><p>Controlled R6 encounter</p><h1>${escapeHtml(variant.title || variant.variantId)}</h1></header>${sections}${instrumentation}</main><script>const payload={experimentId:${JSON.stringify(manifest.experimentId)},assignmentId:${JSON.stringify(assignmentId)},participantId:${JSON.stringify(participantId)},variantId:${JSON.stringify(variant.variantId)},variantDigest:${JSON.stringify(variant.variantDigest)}};async function emit(eventType,detail={}){const response=await fetch('/event',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...payload,eventType,detail,clientTimestampMs:Date.now()})});if(!response.ok)throw new Error('event emission failed: '+response.status);}window.addEventListener('DOMContentLoaded',()=>emit('exposure',{visibilityState:document.visibilityState}));const instrumentation=document.querySelector('[data-instrumentation-outcome]');if(instrumentation)instrumentation.addEventListener('click',async(event)=>{const target=event.currentTarget;await emit('outcome',{outcomeType:'instrumentation-confirmation',value:target.dataset.instrumentationOutcome});target.dataset.recorded='true';});</script></body></html>`;
}

const args = parseArgs(process.argv.slice(2));
const manifest = validateManifest(JSON.parse(await readFile(args.manifest, "utf8")));
await mkdir(join(args.outputDir, "model-views"), { recursive: true });
const assignments = [];
const events = [];
const assignmentById = new Map();

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", "http://127.0.0.1");
  if (request.method === "GET" && url.pathname === "/encounter") {
    const participantId = url.searchParams.get("participant");
    if (!participantId) { response.writeHead(400); response.end("participant required"); return; }
    const { variant, assignmentUniform: u } = assignVariant(manifest, participantId);
    const assignmentId = `assignment://${sha256(`${manifest.experimentId}\0${participantId}`).slice(7, 31)}`;
    const assignment = { experimentId: manifest.experimentId, assignmentId, participantId, variantId: variant.variantId, variantDigest: variant.variantDigest, assignmentProbability: variant.probability, assignmentUniform: u };
    assignments.push(assignment); assignmentById.set(assignmentId, assignment);
    const html = renderPage({ manifest, participantId, assignmentId, variant, mode: args.mode });
    response.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" }); response.end(html); return;
  }
  if (request.method === "POST" && url.pathname === "/event") {
    const chunks = []; for await (const chunk of request) chunks.push(chunk);
    let body; try { body = JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { response.writeHead(400); response.end("invalid json"); return; }
    const assignment = assignmentById.get(body.assignmentId);
    if (!assignment || assignment.participantId !== body.participantId || assignment.variantId !== body.variantId || assignment.variantDigest !== body.variantDigest) { response.writeHead(409); response.end("assignment mismatch"); return; }
    if (!["exposure", "outcome"].includes(body.eventType)) { response.writeHead(400); response.end("invalid event"); return; }
    events.push({ ...body, serverObservedAtMs: Date.now(), assignmentProbability: assignment.assignmentProbability });
    response.writeHead(204); response.end(); return;
  }
  response.writeHead(404); response.end("not found");
});
await new Promise((ok, fail) => { server.once("error", fail); server.listen(0, "127.0.0.1", ok); });
const address = server.address();
if (!address || typeof address === "string") throw new Error("failed to allocate R6 encounter port");
const baseUrl = `http://127.0.0.1:${address.port}`;
const browserExecutable = await resolveBrowserExecutable(chromium.executablePath());
const browser = await chromium.launch({ headless: true, executablePath: browserExecutable, args: ["--disable-dev-shm-usage"] });
const representative = new Map();
const configuredViewport = manifest.encounter?.viewport || { width: 1080, height: 900 };
if (!Number.isInteger(configuredViewport.width) || !Number.isInteger(configuredViewport.height) || configuredViewport.width < 320 || configuredViewport.height < 320) throw new Error("invalid encounter viewport");

try {
  for (let index = 1; index <= args.participants; index += 1) {
    const participantId = `synthetic-browser:${index.toString().padStart(4, "0")}`;
    const context = await browser.newContext({ viewport: configuredViewport, reducedMotion: "reduce", colorScheme: "dark" });
    const page = await context.newPage();
    const response = await page.goto(`${baseUrl}/encounter?participant=${encodeURIComponent(participantId)}`, { waitUntil: "networkidle", timeout: 15_000 });
    if (!response || response.status() !== 200) throw new Error(`encounter failed for ${participantId}`);
    const variantId = await page.locator("main").getAttribute("data-variant-id");
    await page.waitForFunction(() => document.visibilityState === "visible");
    if (args.mode === "instrumentation") {
      await page.locator("[data-instrumentation-outcome]").click();
      await page.waitForFunction(() => document.querySelector("[data-instrumentation-outcome]")?.getAttribute("data-recorded") === "true");
    }
    if (!representative.has(variantId)) {
      const screenshotPath = join(args.outputDir, "model-views", `${variantId}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true, animations: "disabled", caret: "hide" });
      const screenshotBytes = await readFile(screenshotPath);
      const visibleText = await page.locator("main").innerText();
      const evidence = await page.locator("[data-evidence-id]").evaluateAll((nodes) => nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return { evidenceId: node.getAttribute("data-evidence-id"), heading: node.querySelector("h2")?.textContent?.trim() || "", text: node.querySelector("p")?.textContent?.trim() || "", top: rect.top, bottom: rect.bottom, intersectsInitialViewport: rect.bottom > 0 && rect.top < window.innerHeight };
      }));
      const viewportEvidence = evidence.filter((item) => item.intersectsInitialViewport).map((item) => ({ evidenceId: item.evidenceId, heading: item.heading, text: item.text, top: item.top, bottom: item.bottom }));
      representative.set(variantId, { variantId, screenshot: relative(args.outputDir, screenshotPath).split(sep).join("/"), screenshotDigest: sha256(screenshotBytes), visibleText, visibleTextDigest: sha256(visibleText), evidence, viewportEvidence, viewportEvidenceDigest: digestJson(viewportEvidence), encounterMode: "initial-viewport-no-scroll" });
    }
    await context.close();
  }
} finally {
  await browser.close();
  await new Promise((ok) => server.close(ok));
}

const assignmentIds = new Set(assignments.map((item) => item.assignmentId));
const exposureCounts = new Map(); const outcomeCounts = new Map();
for (const event of events) {
  const target = event.eventType === "exposure" ? exposureCounts : outcomeCounts;
  target.set(event.assignmentId, (target.get(event.assignmentId) || 0) + 1);
}
const variantCounts = Object.fromEntries(manifest.variants.map((variant) => [variant.variantId, assignments.filter((item) => item.variantId === variant.variantId).length]));
const integrity = {
  assignmentCount: assignments.length,
  uniqueAssignmentCount: assignmentIds.size,
  allAssignmentsUnique: assignments.length === args.participants && assignmentIds.size === args.participants,
  allExposuresRealizedExactlyOnce: [...assignmentIds].every((id) => exposureCounts.get(id) === 1),
  allInstrumentationOutcomesRealizedExactlyOnce: args.mode === "capture" ? null : [...assignmentIds].every((id) => outcomeCounts.get(id) === 1),
  allPropensitiesExplicit: assignments.every((item) => item.assignmentProbability > 0 && item.assignmentProbability <= 1),
  allVariantDigestsBound: assignments.every((item) => manifest.variants.some((variant) => variant.variantId === item.variantId && variant.variantDigest === item.variantDigest)),
};
const packet = {
  schemaVersion: 1,
  kind: "ordivon.web.r6-encounter-receipt",
  experimentId: manifest.experimentId,
  manifestDigest: manifest.manifestDigest,
  mode: args.mode,
  observerClass: "synthetic-browser-participant",
  browser: { executable: browserExecutable, tempRoot: browserTempRoot, viewport: configuredViewport },
  assignmentPolicy: { kind: "deterministic-hash-randomization", saltDigest: sha256(manifest.assignmentSalt), probabilities: Object.fromEntries(manifest.variants.map((variant) => [variant.variantId, variant.probability])) },
  variantCounts,
  variants: manifest.variants.map(({ variantId, variantDigest, probability }) => ({ variantId, variantDigest, probability })),
  assignments,
  events,
  representativeEncounters: [...representative.values()],
  integrity,
  interpretationBoundary: "This receipt proves assignment, propensity, rendered-browser exposure, exact representative encounter bytes/text, and event capture. Synthetic-browser outcome clicks prove instrumentation only; they are not human preference, comprehension, memory, trust, or behavior evidence.",
};
packet.receiptDigest = digestJson(packet);
await writeFile(join(args.outputDir, "receipt.json"), `${JSON.stringify(packet, null, 2)}\n`);
process.stdout.write(`${JSON.stringify({ ok: Object.values(integrity).filter((value) => value !== null).every(Boolean), experimentId: packet.experimentId, receipt: relative(ROOT, join(args.outputDir, "receipt.json")), receiptDigest: packet.receiptDigest, variantCounts, integrity }, null, 2)}\n`);
if (!Object.values(integrity).filter((value) => value !== null).every(Boolean)) process.exitCode = 1;
