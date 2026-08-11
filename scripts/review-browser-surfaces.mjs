import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { access, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { extname, join, relative, resolve, sep } from "node:path";
import process from "node:process";
import { chromium } from "@playwright/test";

const ROOT = process.cwd();
const STATIC_ROOT = resolve(ROOT, "out");
const DEFAULT_OUTPUT = resolve(STATIC_ROOT, "reviews", "browser");

const MIME = new Map([
  [".html", "text/html; charset=utf-8"], [".js", "text/javascript; charset=utf-8"], [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"], [".xml", "application/xml; charset=utf-8"], [".txt", "text/plain; charset=utf-8"],
  [".svg", "image/svg+xml"], [".png", "image/png"], [".jpg", "image/jpeg"], [".jpeg", "image/jpeg"], [".webp", "image/webp"],
  [".ico", "image/x-icon"], [".woff", "font/woff"], [".woff2", "font/woff2"],
]);

function sha256(bytes) { return `sha256:${createHash("sha256").update(bytes).digest("hex")}`; }
async function fileDigest(path) { return sha256(await readFile(path)); }

function parseArgs(argv) {
  const routes = [];
  let outputDirectory = DEFAULT_OUTPUT;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--route") {
      const route = argv[index + 1];
      if (!route) throw new Error("--route requires a path");
      routes.push(route.startsWith("/") ? route : `/${route}`);
      index += 1;
    } else if (arg === "--output-dir") {
      const value = argv[index + 1];
      if (!value) throw new Error("--output-dir requires a path");
      outputDirectory = resolve(ROOT, value);
      index += 1;
    } else throw new Error(`unknown argument: ${arg}`);
  }
  return { routes, outputDirectory };
}

function routeId(route) {
  if (route === "/") return "home";
  return route.replace(/^\/+|\/+$/g, "").replace(/[^a-zA-Z0-9._-]+/g, "-") || "home";
}

async function sourceTreeDigest() {
  const listed = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], { cwd: ROOT });
  const paths = listed.toString("utf8").split("\0").filter(Boolean).sort();
  const digest = createHash("sha256");
  for (const path of paths) {
    digest.update(path, "utf8"); digest.update("\0"); digest.update(await readFile(resolve(ROOT, path))); digest.update("\0");
  }
  return { digest: `sha256:${digest.digest("hex")}`, fileCount: paths.length };
}

async function resolveStaticFile(pathname) {
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch { return null; }
  if (decoded.includes("\0")) return null;
  const relativePath = decoded.replace(/^\/+/, "");
  const candidates = !relativePath || decoded.endsWith("/")
    ? [join(STATIC_ROOT, relativePath, "index.html")]
    : [join(STATIC_ROOT, relativePath), join(STATIC_ROOT, relativePath, "index.html")];
  for (const candidate of candidates) {
    const absolute = resolve(candidate);
    if (absolute !== STATIC_ROOT && !absolute.startsWith(`${STATIC_ROOT}${sep}`)) continue;
    try { if ((await stat(absolute)).isFile()) return absolute; } catch {}
  }
  return null;
}

async function startStaticServer() {
  const server = createServer(async (request, response) => {
    const url = new URL(request.url || "/", "http://127.0.0.1");
    const file = await resolveStaticFile(url.pathname);
    if (!file) { response.writeHead(404, { "content-type": "text/plain; charset=utf-8" }); response.end("not found\n"); return; }
    const bytes = await readFile(file);
    response.writeHead(200, { "content-type": MIME.get(extname(file)) || "application/octet-stream", "cache-control": "no-store" });
    response.end(bytes);
  });
  await new Promise((ok, fail) => { server.once("error", fail); server.listen(0, "127.0.0.1", ok); });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("failed to allocate local browser-review port");
  return { server, baseUrl: `http://127.0.0.1:${address.port}` };
}

async function isExecutable(path) {
  try { await access(path, fsConstants.X_OK); return true; }
  catch { return false; }
}

async function findProvisionedBrowser(root, depth = 0) {
  if (!root || depth > 4) return null;
  let entries;
  try { entries = await readdir(root, { withFileTypes: true }); } catch { return null; }
  for (const entry of entries) {
    const path = join(root, entry.name);
    if (entry.isFile() && (entry.name === "chrome" || entry.name === "headless_shell") && await isExecutable(path)) return path;
  }
  for (const entry of entries) if (entry.isDirectory()) {
    const found = await findProvisionedBrowser(join(root, entry.name), depth + 1);
    if (found) return found;
  }
  return null;
}

async function resolveBrowserExecutable() {
  const directCandidates = [
    process.env.ORDIVON_WEB_BROWSER,
    chromium.executablePath(),
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
  ].filter(Boolean);
  for (const candidate of directCandidates) if (await isExecutable(candidate)) return candidate;

  const searchRoots = [
    process.env.PLAYWRIGHT_BROWSERS_PATH,
    "/root/.cache/ms-playwright",
  ].filter(Boolean);
  for (const root of searchRoots) {
    const found = await findProvisionedBrowser(root);
    if (found) return found;
  }

  throw new Error(`No provisioned Chromium executable was found. Tried ${directCandidates.join(", ")} and cache roots ${searchRoots.join(", ")}. Set ORDIVON_WEB_BROWSER to an exact executable when using another workstation.`);
}

async function resolveBrowserTempRoot() {
  const explicit = process.env.ORDIVON_WEB_BROWSER_TMPDIR;
  const ambient = explicit || process.env.TMPDIR || process.env.TMP || process.env.TEMP || "/tmp";
  const chromiumSocketSuffixBudget = 48;
  const unixSocketBudget = 100;
  if (Buffer.byteLength(ambient) + chromiumSocketSuffixBudget <= unixSocketBudget) return ambient;
  await access("/tmp", fsConstants.W_OK).catch(() => {
    throw new Error(`browser temporary root is too long for Chromium Unix sockets (${ambient}); set ORDIVON_WEB_BROWSER_TMPDIR to a short writable path`);
  });
  process.env.TMPDIR = "/tmp";
  process.env.TMP = "/tmp";
  process.env.TEMP = "/tmp";
  return "/tmp";
}

const { routes: requestedRoutes, outputDirectory } = parseArgs(process.argv.slice(2));
await access(resolve(STATIC_ROOT, "index.html"), fsConstants.R_OK).catch(() => { throw new Error("static candidate is missing: run `pnpm build` first, or use `pnpm browser:review`"); });
const designContext = JSON.parse(await readFile(resolve(ROOT, "design/context.json"), "utf8"));
const routes = requestedRoutes.length ? [...new Set(requestedRoutes)] : designContext.benchmarkSurfaces.map((surface) => surface.route);
const sourceState = await sourceTreeDigest();
const sourceHead = execFileSync("git", ["rev-parse", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim();
const decisionContext = await Promise.all(["content/editorial/agent-web-system.md", "design/context.json", "design/expression-profile.md"].map(async (path) => ({ path, digest: await fileDigest(resolve(ROOT, path)) })));
await mkdir(join(outputDirectory, "model-views"), { recursive: true });
const { server, baseUrl } = await startStaticServer();
const browserExecutable = await resolveBrowserExecutable();
const browserTempRoot = await resolveBrowserTempRoot();
const browser = await chromium.launch({ headless: true, executablePath: browserExecutable, args: ["--disable-dev-shm-usage"] });
const profiles = [
  { id: "desktop", viewport: { width: 1440, height: 1000 }, isMobile: false, hasTouch: false },
  { id: "mobile", viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true },
];
const surfaces = [];
const failures = [];

try {
  for (const route of routes) for (const profile of profiles) {
    const context = await browser.newContext({ viewport: profile.viewport, deviceScaleFactor: 1, isMobile: profile.isMobile, hasTouch: profile.hasTouch, reducedMotion: "reduce", colorScheme: "dark" });
    const page = await context.newPage();
    const pageErrors = [];
    const consoleErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "load", timeout: 15_000 });
    await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
    await page.waitForTimeout(80);
    const metrics = await page.evaluate(() => ({ title: document.title, innerWidth: window.innerWidth, innerHeight: window.innerHeight, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight }));
    const overflow = metrics.scrollWidth > metrics.innerWidth + 1;
    const status = response?.status() ?? 0;
    const id = `${routeId(route)}.${profile.id}`;
    const screenshotPath = join(outputDirectory, "model-views", `${id}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false, animations: "disabled", caret: "hide" });
    const screenshotBytes = await readFile(screenshotPath);
    const modelViewPath = relative(outputDirectory, screenshotPath).split(sep).join("/");
    const mechanicalFailures = [];
    if (status < 200 || status >= 400) mechanicalFailures.push(`http-status:${status}`);
    if (overflow) mechanicalFailures.push(`horizontal-overflow:${metrics.scrollWidth}>${metrics.innerWidth}`);
    if (pageErrors.length) mechanicalFailures.push(`page-errors:${pageErrors.length}`);
    if (consoleErrors.length) mechanicalFailures.push(`console-errors:${consoleErrors.length}`);
    if (mechanicalFailures.length) failures.push({ route, profile: profile.id, failures: mechanicalFailures });
    surfaces.push({ route, profile: profile.id, viewport: profile.viewport, responseStatus: status, metrics, pageErrors, consoleErrors, horizontalOverflow: overflow, modelView: { kind: "browser-viewport", path: modelViewPath, mediaType: "image/png", byteLength: screenshotBytes.length, digest: sha256(screenshotBytes), intendedConsumer: "vision-capable-agent" } });
    await context.close();
  }
} finally {
  await browser.close();
  await new Promise((ok) => server.close(ok));
}

const packet = {
  schemaVersion: 1,
  kind: "ordivon.web.browser-review-packet",
  candidate: { gitHead: sourceHead, sourceTreeDigest: sourceState.digest, sourceFileCount: sourceState.fileCount },
  decisionContext,
  routes,
  browser: { executable: browserExecutable, tempRoot: browserTempRoot, profiles: profiles.map(({ id, viewport }) => ({ id, viewport })) },
  surfaces,
  mechanicalAudit: { status: failures.length ? "failed" : "passed", failures, boundary: "HTTP status, browser exceptions, console errors and horizontal overflow are mechanical browser facts; they do not establish semantic, aesthetic or human-experience correctness." },
  semanticAudit: { status: "pending-agent-inspection", note: "Inspect the exact model-view pixels against the digest-bound decision context. Source code, DOM checks and mechanical browser success do not substitute for rendered semantic judgment." },
  inspectionLayers: [
    { order: 1, kind: "desktop-mobile-viewport-scan", inputs: surfaces.map((surface) => surface.modelView.path) },
    { order: 2, kind: "targeted-browser-state", when: "scroll position, focus, menu state, hover, filtering, animation or another interaction remains material" },
  ],
  interpretationBoundary: "The packet materializes exact browser pixels and mechanical facts. A vision-capable Agent remains responsible for hierarchy, implicit visual semantics, task legibility and expression audit; human/expert evidence remains conditional on a residual human-response claim.",
};
const packetPath = join(outputDirectory, "review.json");
await writeFile(packetPath, `${JSON.stringify(packet, null, 2)}\n`);
process.stdout.write(`${JSON.stringify({ status: packet.mechanicalAudit.status, packet: relative(ROOT, packetPath), routes: routes.length, surfaces: surfaces.length, sourceTreeDigest: sourceState.digest }, null, 2)}\n`);
if (failures.length) process.exitCode = 1;
