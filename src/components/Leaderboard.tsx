"use client";

import { formatINR } from "@/lib/format";
import { LEADERBOARD_ENTRIES, MEDALS } from "@/lib/leaderboard";

/** Top spenders wall — plan §14; medals via explicit tokens (no dynamic Tailwind class names). */
export function Leaderboard() {
  return (
    <section aria-label="Leaderboard" className="glass rounded-3xl p-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-accent-secondary">
        Top spenders today
      </p>

      <ol className="mt-4 space-y-3">
        {LEADERBOARD_ENTRIES.map((entry, i) => {
          const medal = MEDALS[i] ?? MEDALS[MEDALS.length - 1];
          return (
            <li key={entry.id} className="flex items-center gap-3">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{
                  color: medal.color,
                  background: medal.glow,
                  border: `1px solid ${medal.color}33`,
                }}
              >
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink">
                  {entry.name}
                </span>
                <span className="block text-[11px] text-ink-muted">{entry.city}</span>
              </span>
              <span className="font-display text-sm font-bold text-ink-secondary tabular-nums">
                {formatINR(entry.spent)}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
