import { ImageResponse } from "next/og";
export const alt = "Ordivon Web V2";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#171714", color: "#f2f0e9", fontFamily: "Arial" }}>
      <div style={{ fontSize: 30, letterSpacing: 8 }}>ORDIVON</div>
      <div style={{ fontSize: 76, maxWidth: 900, lineHeight: 1 }}>Continuity for agents that act in a changing world.</div>
      <div style={{ fontSize: 26, color: "#71d0ad" }}>Web V2 · Round 1 technical proof</div>
    </div>, size
  );
}
