import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export — the app is fully client-side (no SSR/API routes),
  // which lets it host on Firebase Hosting's free Spark plan.
  output: "export",
};

export default nextConfig;

