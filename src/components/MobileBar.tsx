"use client";

import { useWallet } from "@/components/providers/WalletProvider";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { formatINR } from "@/lib/format";

/** Sticky mobile bottom bar — plan §31 / design.md §30 (one-hand reach, sticky CTA). */
export function MobileBar() {
  const { remaining, purchases, setCartOpen } = useWallet();
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
      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className="rounded-full bg-accent px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_0_24px_rgb(124_92_255/0.35)] transition-all hover:bg-accent/90"
      >
        Collection ({purchases.length})
      </button>
    </div>
  );
}
