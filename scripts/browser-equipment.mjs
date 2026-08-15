import { execFileSync } from "node:child_process";
import { constants as fsConstants } from "node:fs";
import { access, readdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import process from "node:process";

let workstationBindingPromise;

async function isExecutable(path) {
  if (!path) return false;
  try { await access(path, fsConstants.X_OK); return true; }
  catch { return false; }
}

async function findProvisionedBrowser(root, depth = 0) {
  if (!root || depth > 4) return null;
  let entries;
  try { entries = await readdir(root, { withFileTypes: true }); }
  catch { return null; }
  for (const entry of entries) {
    if (!entry.isFile() || !["chrome", "headless_shell"].includes(entry.name)) continue;
    const path = join(root, entry.name);
    if (await isExecutable(path)) return path;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const found = await findProvisionedBrowser(join(root, entry.name), depth + 1);
    if (found) return found;
  }
  return null;
}

async function workstationBinding() {
  if (workstationBindingPromise) return workstationBindingPromise;
  workstationBindingPromise = (async () => {
    const tool = process.env.ORDIVON_EQUIPMENT_BINDING || "/root/tools/bin/equipment-binding";
    if (!(await isExecutable(tool))) return null;
    try {
      const output = execFileSync(tool, ["browser", "--family", "chromium"], { encoding: "utf8", timeout: 15000 });
      const value = JSON.parse(output);
      if (value?.schemaVersion !== 1 || value?.kind !== "ordivon.workstation-equipment-binding" || value?.state !== "AVAILABLE") return null;
      if (value?.equipmentId !== "browser:playwright-chromium" || value?.executionTarget !== "local_linux") return null;
      if (!(await isExecutable(value.executable))) return null;
      return value;
    } catch {
      // Workstation projection is an optimization, not a portability requirement.
      return null;
    }
  })();
  return workstationBindingPromise;
}

export async function resolveBrowserExecutable(playwrightExecutablePath, { explicit = process.env.ORDIVON_WEB_BROWSER } = {}) {
  if (await isExecutable(explicit)) return explicit;
  const binding = await workstationBinding();
  if (binding) return binding.executable;

  const directCandidates = [playwrightExecutablePath, "/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome"].filter(Boolean);
  for (const candidate of directCandidates) if (await isExecutable(candidate)) return candidate;

  const roots = [process.env.PLAYWRIGHT_BROWSERS_PATH, join(homedir(), ".cache", "ms-playwright"), "/root/.cache/ms-playwright"].filter(Boolean);
  for (const root of [...new Set(roots.map((value) => resolve(value)))]) {
    const found = await findProvisionedBrowser(root);
    if (found) return found;
  }
  throw new Error(`No provisioned Chromium executable was found. Set ORDIVON_WEB_BROWSER or provision Playwright Chromium.`);
}

export async function resolveBrowserCacheRoot(playwrightExecutablePath) {
  const binding = await workstationBinding();
  const projected = binding?.environment?.PLAYWRIGHT_BROWSERS_PATH;
  if (typeof projected === "string" && await findProvisionedBrowser(projected)) return projected;

  const roots = [process.env.PLAYWRIGHT_BROWSERS_PATH, join(homedir(), ".cache", "ms-playwright")].filter(Boolean);
  for (const root of [...new Set(roots.map((value) => resolve(value)))]) {
    if (await findProvisionedBrowser(root)) return root;
  }

  if (await isExecutable(playwrightExecutablePath)) {
    const marker = `${process.platform === "win32" ? "\\" : "/"}.cache${process.platform === "win32" ? "\\" : "/"}ms-playwright`;
    const normalized = resolve(playwrightExecutablePath);
    const index = normalized.indexOf(marker);
    if (index >= 0) return normalized.slice(0, index + marker.length);
  }
  throw new Error("No provisioned Playwright Chromium cache is available; set PLAYWRIGHT_BROWSERS_PATH or provision Chromium once.");
}

export async function browserEquipmentEvidence(playwrightExecutablePath) {
  const binding = await workstationBinding();
  if (binding) return { source: "workstation-equipment-binding", bindingDigest: binding.bindingDigest, executable: binding.executable };
  return { source: "portable-fallback", bindingDigest: null, executable: await resolveBrowserExecutable(playwrightExecutablePath) };
}
