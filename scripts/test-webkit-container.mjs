import { spawn } from "node:child_process";

const port = 8788;
const external = process.env.PW_EXTERNAL_SERVER === "1";
const base = process.env.PW_BASE_URL || `http://127.0.0.1:${port}`;
const image = "mcr.microsoft.com/playwright:v1.62.0-noble";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const preview = external ? null : spawn("pnpm", ["exec", "wrangler", "dev", "--port", String(port)], { stdio: ["ignore", "pipe", "pipe"], detached: true });
let log = "";
preview?.stdout.on("data", (chunk) => { log += chunk; });
preview?.stderr.on("data", (chunk) => { log += chunk; });
async function waitReady() {
  for (let i = 0; i < 120; i += 1) {
    try { if ((await fetch(base)).status === 200) return; } catch {}
    if (preview?.exitCode !== null && preview) throw new Error(`preview exited (${preview.exitCode})\n${log}`);
    await sleep(100);
  }
  throw new Error(`preview did not become ready\n${log}`);
}
function runDocker() {
  return new Promise((resolve, reject) => {
    const host = new URL(base).hostname;
    const args = ["run", "--rm", "--network", "host"];
    if (process.env.PW_HOST_IP) args.push("--add-host", `${host}:${process.env.PW_HOST_IP}`);
    args.push(
      "-e", "PW_EXTERNAL_SERVER=1",
      "-e", `PW_BASE_URL=${base}`,
      "-e", "PLAYWRIGHT_BROWSERS_PATH=/ms-playwright",
      "-v", `${process.cwd()}:/work`, "-w", "/work",
      image,
      "node", "node_modules/@playwright/test/cli.js", "test",
      "--config", "playwright.release.config.ts", "--project=webkit-release",
    );
    const child = spawn("docker", args, { stdio: "inherit" });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolve() : reject(new Error(`WebKit container exited ${code}`)));
  });
}
try {
  await waitReady();
  await runDocker();
} finally {
  if (preview) {
    try { process.kill(-preview.pid, "SIGTERM"); } catch {}
    await sleep(400);
    if (preview.exitCode === null) { try { process.kill(-preview.pid, "SIGKILL"); } catch {} }
  }
}
