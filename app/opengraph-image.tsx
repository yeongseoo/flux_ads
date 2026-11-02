import { ImageResponse } from "next/og";

export const alt = "FLUX ADS — Your Website. Your Revenue.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: "#101828", color: "#fff", fontFamily: "sans-serif", position: "relative" }}>
        <div style={{ position: "absolute", right: -160, top: -200, width: 720, height: 720, borderRadius: 720, background: "radial-gradient(circle, rgba(65,105,245,0.55), rgba(65,105,245,0) 65%)", display: "flex" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "#1d2939", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 16px", gap: 7 }}>
            <div style={{ width: 30, height: 6, borderRadius: 6, background: "#4169F5" }} />
            <div style={{ width: 20, height: 6, borderRadius: 6, background: "#8EA6FF" }} />
            <div style={{ width: 11, height: 6, borderRadius: 6, background: "#fff" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>
            FLUX
            <span style={{ marginLeft: 12, fontSize: 20, letterSpacing: 4, color: "#A9BCFF", background: "rgba(65,105,245,0.25)", padding: "4px 10px", borderRadius: 8 }}>ADS</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -3, lineHeight: 1.05 }}>Your Website.</div>
          <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -3, lineHeight: 1.05, color: "#7C98FF" }}>Your Revenue.</div>
          <div style={{ marginTop: 28, fontSize: 28, color: "#B6C0D4" }}>Ad monetization support for independent websites & blogs</div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#98A2B3" }}>Beta Partner Program</div>
      </div>
    ),
    size,
  );
}
