import { ImageResponse } from "next/og";

export const alt = "Ordivon — persistent work for capable agents";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#10110f", color: "#f2efe6", fontFamily: "Arial" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 28, letterSpacing: 8 }}><span style={{ width: 30, height: 30, border: "2px solid #6ce2b2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, letterSpacing: 0 }}>O</span> ORDIVON</div>
      <div style={{ fontSize: 82, maxWidth: 980, lineHeight: .96, letterSpacing: -4 }}>Agents should outlive the sessions that think for them.</div>
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", fontSize: 24, color: "#9e9f97" }}><span>Task continuity · committed effects · durable evidence</span><span>ordivon.com</span></div>
    </div>, size
  );
}
