"use client";

import { useEffect } from "react";
import { useWallet } from "@/components/providers/WalletProvider";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { formatINR } from "@/lib/format";
import { PRODUCTS } from "@/lib/products";
import { cn } from "@/lib/utils";

/** Virtual wallet HUD — animated balance counter, burn progress, denial feedback. */
export function WalletDisplay() {
  const {
    total,
    remaining,
    spent,
    purchases,
    purchasePulse,
    deniedProductId,
    clearDenied,
  } = useWallet();

  const animatedRemaining = useAnimatedNumber(remaining);
  const animatedSpent = useAnimatedNumber(spent);
  const pct = total > 0 ? Math.min(100, (spent / total) * 100) : 0;
  const denied = PRODUCTS.find((p) => p.id === deniedProductId);

  useEffect(() => {
    if (!deniedProductId) return;
    const timer = setTimeout(clearDenied, 2200);
    return () => clearTimeout(timer);
  }, [deniedProductId, clearDenied]);

  return (
    <section
      id="wallet"
      aria-label="Virtual wallet"
      className="glass scroll-mt-28 rounded-3xl p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-muted">
            Your virtual wallet
          </p>
          <p
            key={purchasePulse}
            className={cn(
              "pulse-ring mt-2 rounded-lg font-display text-3xl font-bold tracking-tight tabular-nums",
              remaining <= 0 ? "text-error" : "text-ink"
            )}
          >
            {formatINR(animatedRemaining)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-muted">
            Spent
          </p>
          <p className="mt-2 font-display text-lg font-bold text-ink-secondary tabular-nums">
            {formatINR(animatedSpent)}
          </p>
        </div>
      </div>

      {/* Burn progress — accent → cyan gradient */}
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-secondary transition-all duration-700 ease-cinematic"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
        <span>
          {purchases.length} purchase{purchases.length === 1 ? "" : "s"}
        </span>
        <span>{pct.toFixed(0)}% burned</span>
      </div>

      {denied && (
        <p
          role="status"
          className="fade-scale-in mt-4 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-xs leading-relaxed text-error"
        >
          Insufficient balance for {denied.name}. The fantasy has limits. 💀
        </p>
      )}
    </section>
  );
}
