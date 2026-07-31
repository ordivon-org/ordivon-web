import { articles } from "@/lib/content";
export const dynamic = "force-static";

function escape(value: string) { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"); }

export function GET() {
  const items = articles.map((article) => {
    const url = `https://ordivon.com/writing/${article.slug}`;
    const updated = article.modifiedDate || article.date;
    return `<item><title><![CDATA[${article.title}]]></title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${new Date(`${updated}T12:00:00Z`).toUTCString()}</pubDate><description><![CDATA[${article.description}]]></description><category><![CDATA[${article.type}]]></category><category><![CDATA[${article.status}]]></category><category><![CDATA[${article.evidenceLevel}]]></category><source url="${escape(article.canonicalResearchRecord)}">Canonical research record</source></item>`;
  }).join("");
  const latest = articles.reduce((date, article) => (article.modifiedDate || article.date) > date ? (article.modifiedDate || article.date) : date, articles[0].date);
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Ordivon Writing</title><link>https://ordivon.com/writing</link><atom:link href="https://ordivon.com/feed.xml" rel="self" type="application/rss+xml"/><description>Essays, experiments, architecture decisions, and release reports about durable AI agent work.</description><language>en</language><lastBuildDate>${new Date(`${latest}T12:00:00Z`).toUTCString()}</lastBuildDate>${items}</channel></rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}
