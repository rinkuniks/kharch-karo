import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 130,
            height: 130,
            borderRadius: 32,
            background: "linear-gradient(135deg, #7C5CFF 0%, #00E5FF 100%)",
            color: "#050505",
            fontSize: 82,
            fontWeight: 700,
          }}
        >
          KK
        </div>
      </div>
    ),
    size
  );
}
