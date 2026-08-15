import { createHash } from "node:crypto";
import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, resolve, sep } from "node:path";
import process from "node:process";
import { configureBrowserTempEnvironment } from "./browser-runtime.mjs";
import { resolveBrowserExecutable } from "./browser-equipment.mjs";

const ROOT = process.cwd();
const OUTPUT = resolve(ROOT, process.argv[2] || "out/m7-interaction");
const VARIANTS = ["lawful", "premature-success", "silent-delay"];
const OPERATION_ID = "op-recovery-42";
const browserTempRoot = await configureBrowserTempEnvironment();
const { chromium } = await import("@playwright/test");

function sha256(value) {
  const bytes = Buffer.isBuffer(value) ? value : Buffer.from(typeof value === "string" ? value : JSON.stringify(value));
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
}

function pageHtml(variant) {
  const checkLogic = variant === "lawful"
    ? `setStatus('checking','Checking current evidence…'); setTimeout(()=>{setStatus('unknown','Outcome unknown — recovery is available.'); recover.disabled=false;},120);`
    : variant === "premature-success"
      ? `setStatus('success','Succeeded'); setTimeout(()=>{setStatus('unknown','Outcome unknown — recovery is available.'); recover.disabled=false;},120);`
      : `setTimeout(()=>{setStatus('unknown','Outcome unknown — recovery is available.'); recover.disabled=false;},120);`;
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>M7 interaction ${variant}</title><style>
  html{font-family:ui-sans-serif,system-ui;background:#111318;color:#f5f3ee}body{max-width:720px;margin:0 auto;padding:56px 24px}main{display:grid;gap:20px}.panel{padding:24px;border:1px solid #404550;border-radius:18px}.status{min-height:56px;padding:16px;border-radius:12px;background:#1d2028}.status[data-kind=success]{background:#16351f}.status[data-kind=unknown]{background:#292631}.status[data-kind=checking]{background:#1d2b3a}button{font:inherit;padding:12px 16px;margin-right:8px}code{color:#c8c3ff}</style></head><body><main data-variant="${variant}" data-operation-id="${OPERATION_ID}"><h1>Recovery state</h1><p>The response was lost. The operation outcome is unknown. Recover the same operation identity before concluding success or failure.</p><div class="panel"><p>Operation: <code>${OPERATION_ID}</code></p><div id="status" class="status" data-kind="idle">No current evidence has been checked.</div></div><div><button id="check">Check operation</button><button id="recover" disabled>Recover same identity</button><button id="reset">Reset</button></div></main><script>
const status=document.querySelector('#status');const check=document.querySelector('#check');const recover=document.querySelector('#recover');const reset=document.querySelector('#reset');
function setStatus(kind,text){status.dataset.kind=kind;status.textContent=text;window.__m7Events.push({at:performance.now(),kind,text,operationId:${JSON.stringify(OPERATION_ID)}})}
window.__m7Events=[];window.__m7Ready=true;
check.addEventListener('click',()=>{recover.disabled=true;${checkLogic}});
recover.addEventListener('click',()=>{setStatus('recovering','Recovering ${OPERATION_ID}…');setTimeout(()=>{setStatus('unknown','Recovered ${OPERATION_ID}. Outcome remains unknown.');},90)});
reset.addEventListener('click',()=>{recover.disabled=true;setStatus('idle','No current evidence has been checked.');});
</script></body></html>`;
}

function normalizedState(value) {
  return { kind: value.kind, text: value.text, recoverDisabled: value.recoverDisabled, operationId: value.operationId };
}

async function state(page, label) {
  const value = await page.evaluate((snapshotLabel) => ({
    label: snapshotLabel,
    at: performance.now(),
    kind: document.querySelector('#status').dataset.kind,
    text: document.querySelector('#status').textContent,
    recoverDisabled: document.querySelector('#recover').disabled,
    operationId: document.querySelector('main').dataset.operationId,
    events: [...window.__m7Events],
  }), label);
  return value;
}

await mkdir(join(OUTPUT, "screens"), { recursive: true });
const server = createServer((request, response) => {
  const url = new URL(request.url || "/", "http://127.0.0.1");
  const variant = url.searchParams.get("variant");
  if (url.pathname !== "/encounter" || !VARIANTS.includes(variant)) { response.writeHead(404); response.end("not found"); return; }
  response.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
  response.end(pageHtml(variant));
});
await new Promise((ok, fail) => { server.once("error", fail); server.listen(0, "127.0.0.1", ok); });
const address = server.address();
if (!address || typeof address === "string") throw new Error("failed to allocate local port");
const base = `http://127.0.0.1:${address.port}`;
const browserExecutable = await resolveBrowserExecutable(chromium.executablePath());
const browser = await chromium.launch({ headless: true, executablePath: browserExecutable, args: ["--disable-dev-shm-usage"] });
const records = [];
try {
  for (const variant of VARIANTS) {
    const context = await browser.newContext({ viewport: { width: 900, height: 700 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto(`${base}/encounter?variant=${encodeURIComponent(variant)}`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.__m7Ready === true);
    const initial = await state(page, "initial");
    await page.locator('#check').click();
    await page.waitForTimeout(25);
    const transient = await state(page, "25ms-after-check");
    const transientScreen = join(OUTPUT, "screens", `${variant}-transient.png`);
    await page.screenshot({ path: transientScreen, fullPage: true, animations: "disabled" });
    await page.waitForTimeout(130);
    const settled = await state(page, "settled-after-check");
    await page.locator('#recover').click();
    await page.waitForTimeout(20);
    const recovering = await state(page, "recovering");
    await page.waitForTimeout(100);
    const recovered = await state(page, "recovered");
    await page.locator('#reset').click();
    const final = await state(page, "final-reset");
    const finalScreen = join(OUTPUT, "screens", `${variant}-final.png`);
    await page.screenshot({ path: finalScreen, fullPage: true, animations: "disabled" });
    const transientBytes = await readFile(transientScreen); const finalBytes = await readFile(finalScreen);
    const defects = [];
    if (transient.kind === "success") defects.push("feedback-claims-success-before-evidence");
    if (transient.kind === "idle") defects.push("latency-without-feedback");
    const staticEquivalent = JSON.stringify(normalizedState(initial)) === JSON.stringify(normalizedState(final));
    records.push({
      variant,
      operationId: OPERATION_ID,
      snapshots: { initial, transient, settled, recovering, recovered, final },
      registeredDefects: defects,
      staticInitialFinalEquivalent: staticEquivalent,
      trajectoryRequiredToSeeRegisteredDefect: defects.length > 0 && staticEquivalent,
      screenshots: {
        transient: { path: relative(ROOT, transientScreen).split(sep).join('/'), digest: sha256(transientBytes) },
        final: { path: relative(ROOT, finalScreen).split(sep).join('/'), digest: sha256(finalBytes) },
      },
    });
    await context.close();
  }
} finally {
  await browser.close();
  await new Promise((ok) => server.close(ok));
}
const defectCases = ["feedback-claims-success-before-evidence", "latency-without-feedback"];
const arms = [
  { arm: "core-only", detectors: ["feedback-claims-success-before-evidence"], contextWords: 170 },
  { arm: "interactive-candidate", detectors: defectCases, contextWords: 280 },
  { arm: "wrong-static-publication", detectors: [], contextWords: 280 },
  { arm: "sham", detectors: [], contextWords: 280 },
].map((arm) => ({ ...arm, recall: defectCases.filter((item) => arm.detectors.includes(item)).length / defectCases.length }));
const report = {
  schemaVersion: 1,
  kind: "ordivon.web.m7-interaction-trajectory-evidence",
  browser: { executable: browserExecutable, tempRoot: browserTempRoot, viewport: { width: 900, height: 700 } },
  sourceProposition: "The response was lost. The operation outcome is unknown. Recover the same operation identity before concluding success or failure.",
  operationId: OPERATION_ID,
  records,
  ablation: {
    encounterFreeze: "initial + final static states",
    registeredDefectVariants: records.filter((item) => item.registeredDefects.length).map((item) => item.variant),
    allRegisteredDefectsRequireTrajectory: records.filter((item) => item.registeredDefects.length).every((item) => item.trajectoryRequiredToSeeRegisteredDefect),
  },
  distinction: { cases: defectCases, arms, boundary: "Registered trajectory defects and detector coverage are engineering/semantic evidence, not a human usability score." },
  disposition: "generic-interactive-supported-but-web-redundancy-unresolved",
  boundary: "This proves action→state→feedback trajectory can expose transient defects that initial/final screenshots erase. It does not establish non-Web transfer, human usability preference, or game interaction quality.",
};
report.evidenceDigest = sha256(JSON.stringify(report));
await writeFile(join(OUTPUT, "evidence.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ ok: report.ablation.allRegisteredDefectsRequireTrajectory, output: relative(ROOT, join(OUTPUT, "evidence.json")), digest: report.evidenceDigest, variants: records.map((item) => ({ variant: item.variant, defects: item.registeredDefects, staticEquivalent: item.staticInitialFinalEquivalent })) }, null, 2));
if (!report.ablation.allRegisteredDefectsRequireTrajectory) process.exitCode = 1;
