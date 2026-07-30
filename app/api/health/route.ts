export const dynamic = "force-static";

export function GET() {
  return Response.json({
    ok: true,
    runtime: "static-export",
    release: "v2-round3",
  });
}
