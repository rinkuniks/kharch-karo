import { ImageResponse } from "next/og";

export const dynamic = "force-static";

/** Branded OpenGraph card for link previews — plan §11/§23 shareable results. */
export const alt = "Kharch Karo — Spend your dream money";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            background:
              "radial-gradient(500px 300px at 25% 15%, rgba(124,92,255,0.20), transparent), radial-gradient(420px 260px at 78% 80%, rgba(0,229,255,0.12), transparent)",
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 30,
            letterSpacing: 14,
            color: "#00E5FF",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          INDIA&apos;S VIRTUAL SPENDING PLAYGROUND
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: -3,
            color: "#F5F7FA",
          }}
        >
          What would you do with
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 10,
            fontSize: 120,
            fontWeight: 700,
            letterSpacing: -4,
            background: "linear-gradient(100deg, #7C5CFF 0%, #00E5FF 100%)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          1 Crore?
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 42,
            fontSize: 34,
            color: "#9BA3AF",
          }}
        >
          Spend your dream money. Lose nothing.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 24,
            letterSpacing: 6,
            color: "#5E6673",
            textTransform: "uppercase",
          }}
        >
          KHARCH KARO
        </div>
      </div>
    ),
    size
  );
}
