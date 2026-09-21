"use client";

import { useEffect, useState } from "react";
import { formatINR } from "@/lib/format";
import { LEADERBOARD_ENTRIES, MEDALS, fetchLeaderboard, type LeaderboardEntry } from "@/lib/leaderboard";

/** Top spenders wall — live from Firestore, seed fallback offline (plan §14). */
export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(LEADERBOARD_ENTRIES);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchLeaderboard(5).then((rows) => {
      if (cancelled) return;
      // If Firestore returned real docs (ids differ from seed), mark live.
      const isLive = rows.some((r) => !r.id.startsWith("e"));
      setEntries(rows);
      setLive(isLive);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section aria-label="Leaderboard" className="glass rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-accent-secondary">
          Top spenders today
        </p>
        <span className="rounded-full border border-line px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
          {live ? "● Live" : "Demo"}
        </span>
      </div>

      <ol className="mt-4 space-y-3">
        {entries.map((entry, i) => {
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

