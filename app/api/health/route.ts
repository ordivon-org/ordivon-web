export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  return Response.json({ ok: true, runtime: "cloudflare-workers-compatible", requestUrl: request.url, generatedAt: new Date().toISOString() });
}
