import { ImageResponse } from "next/og";

/** App icon (512×512) — PWA + favicon, plan §47. */
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
          borderRadius: 96,
          border: "6px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 300,
            height: 300,
            borderRadius: 72,
            background: "linear-gradient(135deg, #7C5CFF 0%, #00E5FF 100%)",
            color: "#050505",
            fontSize: 190,
            fontWeight: 700,
            letterSpacing: "-8px",
          }}
        >
          KK
        </div>
      </div>
    ),
    size
  );
}
