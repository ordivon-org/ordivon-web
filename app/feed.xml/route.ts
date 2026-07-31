import { articles } from "@/lib/content";
export const dynamic = "force-static";

function escape(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
function atomDate(value: string) { return `${value}T12:00:00Z`; }

export function GET() {
  const entries = articles.map((article) => {
    const url = `https://ordivon.com/writing/${article.slug}`;
    const related = article.canonicalResearchRecord ? `<link rel="related" href="${escape(article.canonicalResearchRecord)}" title="Canonical research record"/>` : "";
    return `<entry><title>${escape(article.title)}</title><id>${url}</id><link rel="alternate" href="${url}"/><published>${atomDate(article.publishedAt)}</published><updated>${atomDate(article.revisedAt || article.publishedAt)}</updated><summary>${escape(article.description)}</summary><category term="${escape(article.type)}"/><category term="${escape(article.status)}"/><category term="${article.evidenceLevel}"/>${related}</entry>`;
  }).join("");
  const latest = articles.reduce((date, article) => (article.revisedAt || article.publishedAt) > date ? (article.revisedAt || article.publishedAt) : date, articles[0].publishedAt);
  const xml = `<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>Ordivon Writing</title><id>https://ordivon.com/writing</id><link rel="alternate" href="https://ordivon.com/writing"/><link rel="self" href="https://ordivon.com/feed.xml"/><updated>${atomDate(latest)}</updated><subtitle>Essays, experiments, architecture decisions, and release reports about durable AI agent work.</subtitle>${entries}</feed>`;
  return new Response(xml, { headers: { "content-type": "application/atom+xml; charset=utf-8" } });
}
