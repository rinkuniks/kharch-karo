import type { MetadataRoute } from "next";

/** PWA manifest — plan §47 (installable, app-like experience). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kharch Karo — Virtual Spending Playground",
    short_name: "Kharch Karo",
    description:
      "Pick a wallet, spend it all on things you can't afford, collect your Damage Report. No real money.",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
