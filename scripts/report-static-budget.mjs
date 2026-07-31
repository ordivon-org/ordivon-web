import { readFile, stat } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const root = process.cwd();
const routes = ["", "writing", "writing/from-tokens-to-work", "research", "system", "projects"];
const advisories = [];
const results = [];

for (const route of routes) {
  const htmlPath = join(root, "out", route, "index.html");
  const html = await readFile(htmlPath, "utf8");
  const scripts = [...new Set([...html.matchAll(/<script[^>]+src="([^"]+\.js)"/g)].map((match) => match[1]))];
  const styles = [...new Set([...html.matchAll(/<link[^>]+href="([^"]+\.css)"/g)].map((match) => match[1]))];
  async function measure(paths) {
    let raw = 0; let gzip = 0;
    for (const path of paths) {
      const content = await readFile(join(root, "out", decodeURIComponent(path).replace(/^\//, "")));
      raw += content.length; gzip += gzipSync(content).length;
    }
    return { raw, gzip };
  }
  const js = await measure(scripts); const css = await measure(styles);
  const label = `/${route}`.replace(/\/$/, "") || "/";
  if (js.gzip > 180_000) advisories.push(`${label}: JavaScript gzip ${js.gzip} exceeds advisory 180000`);
  if (css.gzip > 25_000) advisories.push(`${label}: CSS gzip ${css.gzip} exceeds advisory 25000`);
  results.push({ route: label, scripts: scripts.length, styles: styles.length, js, css, html: (await stat(htmlPath)).size });
}
console.log(JSON.stringify({ kind: "static-budget-report", blocking: false, results, advisories }, null, 2));
