import { spawn, spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const secretPath = process.env.ORDIVON_CLOUDFLARE_SECRET || "/root/.config/ordivon/secrets/cloudflare.json";
let config = {};
if (!process.env.CLOUDFLARE_API_TOKEN || !process.env.CLOUDFLARE_ACCOUNT_ID) {
  config = JSON.parse(await readFile(secretPath, "utf8"));
}
const token = process.env.CLOUDFLARE_API_TOKEN || config.api_token;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || config.account_id;
if (!token || !accountId) throw new Error("Cloudflare account token and account ID are required");

const env = {
  ...process.env,
  CLOUDFLARE_API_TOKEN: token,
  CLOUDFLARE_ACCOUNT_ID: accountId,
  CI: "true",
  WRANGLER_SEND_METRICS: "false",
  NODE_OPTIONS: [process.env.NODE_OPTIONS, "--dns-result-order=ipv4first"].filter(Boolean).join(" "),
};
const status = spawnSync("git", ["status", "--porcelain"], { encoding: "utf8" });
if (status.status !== 0 || status.stdout.trim()) throw new Error("refusing to deploy a dirty or unreadable Git worktree");
const revisionResult = spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" });
const revision = revisionResult.status === 0 ? revisionResult.stdout.trim() : "";
if (!/^[0-9a-f]{40}$/.test(revision)) throw new Error("refusing to deploy without an exact Git revision");
const args = ["node_modules/wrangler/bin/wrangler.js", "deploy", "--config", "wrangler.jsonc", "--message", `Ordivon Web V2 hosted preview ${revision}`];
const child = spawn(process.execPath, args, { env, stdio: "inherit" });
child.once("error", (error) => { throw error; });
child.once("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exitCode = code ?? 1;
});
