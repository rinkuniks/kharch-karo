import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { gaId } from "@/lib/analytics";

/* design.md §4 — Space Grotesk display, Inter body */
const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kharch Karo 💸 — Spend your dream money",
    template: "%s — Kharch Karo",
  },
  description:
    "India's virtual spending playground. Pick a wallet, blow it all on things you can't afford, collect your Damage Report. Zero rupees. Maximum dopamine.",
  keywords: [
    "virtual spending game",
    "spend 1 crore",
    "kharch karo",
    "shopping game india",
    "damage report",
  ],
  openGraph: {
    title: "Kharch Karo 💸 — What would you do with ₹1 Crore?",
    description:
      "Get a virtual budget. Spend it on everything you've ever wanted. Regret absolutely nothing.",
    type: "website",
    siteName: "Kharch Karo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kharch Karo 💸 — What would you do with ₹1 Crore?",
    description:
      "Get a virtual budget. Spend it on everything you've ever wanted. Regret absolutely nothing.",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const GA_ID = gaId();
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {GA_ID ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga-boot" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        ) : null}
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
