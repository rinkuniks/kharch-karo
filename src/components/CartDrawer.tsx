"use client";

import { useWallet } from "@/components/providers/WalletProvider";
import { Drawer } from "@/components/ui/drawer";
import { EmptyState } from "@/components/ui/empty-state";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { formatINR } from "@/lib/format";

/** Cart drawer — "YOUR COLLECTION" (design.md §18) + early session finish (plan §52.8). */
export function CartDrawer() {
  const { cartOpen, setCartOpen, purchases, spent, total, remaining, finishSession, removeFromWallet } =
    useWallet();
  const animatedSpent = useAnimatedNumber(spent, 500);

  return (
    <Drawer open={cartOpen} onClose={() => setCartOpen(false)} label="Your collection">
      <div className="flex items-center justify-between border-b border-line px-6 py-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-ink-muted">
            Your collection
          </p>
          <p className="mt-1 font-display text-lg font-bold text-ink">
            {purchases.length} purchase{purchases.length === 1 ? "" : "s"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCartOpen(false)}
          aria-label="Close collection"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-secondary transition-colors hover:border-line-strong hover:text-ink"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {purchases.length === 0 ? (
          <EmptyState
            emoji="🛍️"
            title="Nothing burned yet"
            subtitle="Your collection is embarrassingly empty. Go add something ridiculous."
          />
        ) : (
          <ul className="space-y-2">
            {purchases.map((p) => (
              <li
                key={p.id}
                className="group flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 transition-all duration-200 hover:border-line-strong hover:bg-surface-elevated"
              >
                {p.image ? (
                  <img
                    src={p.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-11 w-11 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <span aria-hidden className="text-xl">
                    {p.emoji}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-ink">
                    {p.name}
                  </span>
                  <span className="text-xs text-ink-muted">
                    {p.qty > 1 ? `${p.qty} × ${formatINR(p.price)}` : formatINR(p.price)}
                  </span>
                </span>
                <span className="font-display text-sm font-bold text-ink-secondary tabular-nums">
                  −{formatINR(p.price * p.qty)}
                </span>
                <button
                  type="button"
                  onClick={() => removeFromWallet(p.id)}
                  aria-label={`Remove ${p.name} from collection`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-muted transition-all duration-200 hover:bg-error/10 hover:text-error sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-line px-6 py-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-secondary">Total burned</span>
          <span className="font-display text-xl font-bold text-error tabular-nums">
            {formatINR(animatedSpent)}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between text-xs text-ink-muted">
          <span>Wallet</span>
          <span className="tabular-nums">
            {formatINR(remaining)} of {formatINR(total)} left
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            setCartOpen(false);
            finishSession();
          }}
          disabled={purchases.length === 0}
          className="mt-4 w-full rounded-full bg-accent py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_28px_rgb(124_92_255/0.4)] transition-all duration-300 hover:bg-accent/90 disabled:pointer-events-none disabled:opacity-50"
        >
          Finish session → Damage Report
        </button>
        <p className="mt-3 text-center text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          No real money. No real orders. Ever.
        </p>
      </div>
    </Drawer>
  );
}
