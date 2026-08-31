/**
 * Analytics scaffold — plan §24 event taxonomy.
 * Currently pushes to window.dataLayer (GA4-ready) and logs in dev.
 * Wire PostHog/GA here once NEXT_PUBLIC_ANALYTICS_ID exists.
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
  }
}

export function track(event: AnalyticsEvent, props: Props = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...props });
  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics]", event, props);
  }
}
