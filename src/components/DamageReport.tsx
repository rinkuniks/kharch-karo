"use client";

import { useEffect } from "react";
import { useWallet } from "@/components/providers/WalletProvider";
import { ShareCard } from "@/components/ShareCard";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { track } from "@/lib/analytics";
import { formatINR } from "@/lib/format";
import { getMockRank } from "@/lib/leaderboard";
import { computePersonality } from "@/lib/personality";

/** Damage Report — plan §10 full stat sheet + §29 restart options. */
export function DamageReport() {
  const {
    showDamage,
    canDismissDamage,
    dismissDamage,
    spent,
    purchases,
    reset,
    restartWithCr,
    spentByCategory,
    total,
  } = useWallet();
  const personality = computePersonality(spentByCategory, total > 0 ? spent / total : 0);
  const animatedSpent = useAnimatedNumber(spent, 1200);

  useEffect(() => {
    if (showDamage) track("session_completed", { spent, budget: total });
  }, [showDamage, spent, total]);

  if (!showDamage) return null;

  const pct = total > 0 ? Math.min(100, Math.round((spent / total) * 100)) : 0;
  const biggest = purchases.reduce<null | (typeof purchases)[number]>(
    (best, p) => (!best || p.price * p.qty > best.price * best.qty ? p : best),
    null
  );
  const rank = getMockRank(spent);
  const funFact = biggest
    ? Math.floor(biggest.price / 2_499) > 1
      ? `You could have bought ${Math.floor(biggest.price / 2_499).toLocaleString("en-IN")} royal biryani feasts instead of the ${biggest.name}.`
      : brokeLine(pct)
    : "You spent it ALL. Every. Single. Rupee.";

  const stats: Array<[string, string]> = [
    ["You started with", formatINR(total)],
    ["You spent", formatINR(animatedSpent)],
    ["You have left", formatINR(Math.max(0, total - spent))],
    ["Budget burned", `${pct}%`],
    ["Purchases", String(purchases.reduce((n, p) => n + p.qty, 0))],
    ["Biggest flex", biggest ? `${biggest.emoji} ${biggest.name}` : "—"],
    ["Global rank", rank],
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Damage report"
      className="fade-scale-in fixed inset-0 z-60 flex items-center justify-center overflow-y-auto bg-bg/95 px-4 py-16 backdrop-blur-xl"
    >
      <div className="w-full max-w-lg">
        <div className="text-center">
          {canDismissDamage && (
            <button
              type="button"
              onClick={dismissDamage}
              aria-label="Back to spending"
              className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-secondary transition-colors hover:border-line-strong hover:text-ink"
            >
              ✕
            </button>
          )}
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-error">
            Your damage report
          </p>
          <div className="mt-5 text-7xl" aria-hidden>
            {pct >= 98 ? "💀" : "🧾"}
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            {pct >= 98 ? "You're broke." : "Nice damage."}
          </h2>

          {/* Personality verdict — plan §9/§10 */}
          <div className="glass mt-8 rounded-3xl p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-muted">
              Spender personality
            </p>
            <p
              className="mt-1 font-display text-2xl font-bold"
              style={{ color: personality.color }}
            >
              <span aria-hidden>{personality.emoji}</span> {personality.name}
            </p>
            <p className="mt-1 text-sm text-ink-secondary">{personality.blurb}</p>

            <dl className="mt-6 space-y-2 text-left">
              {stats.map(([label, val]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-2.5 text-sm"
                >
                  <dt className="text-ink-muted">{label}</dt>
                  <dd className="font-display font-bold text-ink tabular-nums">{val}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-5 rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-left text-xs leading-relaxed text-ink-secondary">
              <span className="font-bold text-warning">Fun fact:</span> {funFact}
            </p>
          </div>

          <div className="mt-6">
            <ShareCard personality={personality} />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="flex-1 rounded-full bg-accent py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_32px_rgb(124_92_255/0.4)] transition-all duration-300 hover:bg-accent/90"
            >
              Spend again →
            </button>
            <button
              type="button"
              onClick={restartWithCr}
              className="flex-1 rounded-full border border-line-strong py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-ink transition-all duration-300 hover:border-accent hover:text-accent"
            >
              Restart with ₹1Cr
            </button>
          </div>
          <p className="mt-4 text-[11px] text-ink-muted">
            Kharch Karo is a virtual entertainment experience. No real purchases are made
            through the game.
          </p>
        </div>
      </div>
    </div>
  );
}

function brokeLine(pct: number): string {
  return pct >= 98
    ? "You spent it ALL. Every. Single. Rupee."
    : "Somehow the money vanished anyway. Physics?";
}
