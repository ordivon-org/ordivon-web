import { articles } from "@/lib/content";
export const dynamic = "force-static";
export function GET() {
  const items = articles.map((article) => `<item><title><![CDATA[${article.title}]]></title><link>https://ordivon.com/writing/${article.slug}</link><guid>https://ordivon.com/writing/${article.slug}</guid><pubDate>${new Date(`${article.date}T12:00:00Z`).toUTCString()}</pubDate><description><![CDATA[${article.description}]]></description><category><![CDATA[${article.type}]]></category></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Ordivon Writing</title><link>https://ordivon.com/writing</link><description>Essays, reports, releases, and design arguments from Ordivon.</description><language>en</language><lastBuildDate>${new Date(`${articles[0].date}T12:00:00Z`).toUTCString()}</lastBuildDate>${items}</channel></rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}
