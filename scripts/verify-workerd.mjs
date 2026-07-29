import { spawn } from "node:child_process";
import process from "node:process";

const port = 8787;
const origin = `http://127.0.0.1:${port}`;
const child = spawn("pnpm", ["exec", "opennextjs-cloudflare", "preview", "--port", String(port)], {
  stdio: ["ignore", "pipe", "pipe"],
  detached: true,
  env: { ...process.env, CI: "1", WRANGLER_SEND_METRICS: "false" },
});
let stdout = "";
let stderr = "";
child.stdout.on("data", (chunk) => { stdout += chunk; process.stdout.write(chunk); });
child.stderr.on("data", (chunk) => { stderr += chunk; process.stderr.write(chunk); });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function waitForServer() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try {
      const response = await fetch(`${origin}/api/health`);
      if (response.ok) return;
    } catch {}
    if (child.exitCode !== null) throw new Error(`workerd exited early (${child.exitCode})\n${stdout}\n${stderr}`);
    await sleep(250);
  }
  throw new Error(`workerd did not become ready\n${stdout}\n${stderr}`);
}
async function expectResponse(route, expectedStatus, contentType) {
  const response = await fetch(`${origin}${route}`, { redirect: "manual" });
  if (response.status !== expectedStatus) throw new Error(`${route}: expected ${expectedStatus}, got ${response.status}`);
  if (contentType && !response.headers.get("content-type")?.includes(contentType)) throw new Error(`${route}: unexpected content-type ${response.headers.get("content-type")}`);
  return response;
}
try {
  await waitForServer();
  const health = await (await expectResponse("/api/health", 200, "application/json")).json();
  if (!health.ok || health.runtime !== "cloudflare-workers-compatible") throw new Error(`invalid health payload ${JSON.stringify(health)}`);
  await expectResponse("/", 200, "text/html");
  await expectResponse("/projects", 200, "text/html");
  await expectResponse("/writing", 200, "text/html");
  await expectResponse("/projects/runtime", 200, "text/html");
  await expectResponse("/writing/the-future-will-not-wait", 200, "text/html");
  await expectResponse("/feed.xml", 200, "application/rss+xml");
  await expectResponse("/sitemap.xml", 200, "application/xml");
  await expectResponse("/opengraph-image", 200, "image/png");
  const redirect = await expectResponse("/work", 308);
  if (!redirect.headers.get("location")?.endsWith("/projects")) throw new Error(`unexpected redirect ${redirect.headers.get("location")}`);
  console.log("workerd verification passed");
} finally {
  const stopGroup = (signal) => {
    if (child.pid) {
      try { process.kill(-child.pid, signal); } catch (error) {
        if (error?.code !== "ESRCH") throw error;
      }
    }
  };
  stopGroup("SIGTERM");
  await Promise.race([new Promise((resolve) => child.once("exit", resolve)), sleep(5000)]);
  if (child.exitCode === null) stopGroup("SIGKILL");
}
