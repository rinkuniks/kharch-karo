/**
 * Analytics — plan §24 event taxonomy.
 * 100% path: set NEXT_PUBLIC_GA_ID in .env.local and events stream to GA4 via gtag.
 * Without the ID, events still push to window.dataLayer (GA4-ready) and log in dev.
 */
export type AnalyticsEvent =
  | "landing_view"
  | "budget_selected"
  | "category_viewed"
  | "product_viewed"
  | "product_added"
  | "purchase_attempt"
  | "session_completed"
  | "share_clicked"
  | "challenge_started";

type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

function sendToGA(event: AnalyticsEvent, props: Props): void {
  if (!GA_ID || typeof window === "undefined") return;
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", event, props);
      return;
    }
    // gtag not loaded yet — queue via dataLayer, picked up once the GA script boots.
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event, ...props });
  } catch {
    /* analytics must never break the game */
  }
}

export function track(event: AnalyticsEvent, props: Props = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...props });
  sendToGA(event, props);
  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics]", event, props);
  }
}

export function gaId(): string {
  return GA_ID;
}

