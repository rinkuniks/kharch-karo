"use client";

import { useWallet } from "@/components/providers/WalletProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { formatINR } from "@/lib/format";

/** Sticky mobile bottom bar — plan §31 / design.md §30 (one-hand reach, sticky CTA). */
export function MobileBar() {
  const { remaining, purchases, setCartOpen } = useWallet();
  const { theme, toggle } = useTheme();
  const animatedRemaining = useAnimatedNumber(remaining, 500);

  return (
    <div className="glass-strong fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-line px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-ink-muted">
          Left to burn
        </p>
        <p className="font-display text-lg font-bold text-accent-secondary tabular-nums">
          {formatINR(animatedRemaining)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggle}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white/5 text-ink-secondary transition-colors hover:border-line-strong hover:text-ink"
        >
          {theme === "dark" ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="rounded-full bg-accent px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_0_24px_rgb(124_92_255/0.35)] transition-all hover:bg-accent/90"
        >
          Collection ({purchases.length})
        </button>
      </div>
    </div>
  );
}
