"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface Challenge {
  id: string;
  title: string;
  reward: string;
  seconds: number;
}

const CHALLENGES: Challenge[] = [
  { id: "burn-exact", title: "Burn exactly ₹99,999", reward: "🔥 500 XP", seconds: 90 },
  { id: "food-only", title: "Spend only on food", reward: "🍔 300 XP", seconds: 60 },
  { id: "one-car", title: "Drive out in a car", reward: "🚗 400 XP", seconds: 120 },
];

/** Daily challenge card with a real countdown (fixed from the old broken timer). */
export function DailyChallenge() {
  const [index] = useState(0);
  const [left, setLeft] = useState(CHALLENGES[0].seconds);
  const [running, setRunning] = useState(false);
  const [expired, setExpired] = useState(false);
  /** Absolute end timestamp for the active run (null = never started). */
  const [endsAt, setEndsAt] = useState<number | null>(null);

  const challenge = CHALLENGES[index];
  const totalSeconds = challenge.seconds;

  // Every setState + time read happens inside the interval callback, so rendering
  // stays pure and no state is synchronised from an effect body.
  useEffect(() => {
    if (endsAt === null) return;
    const id = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setLeft(remaining);
      if (remaining === 0) {
        clearInterval(id);
        setRunning(false);
        setExpired(true);
      }
    }, 250);
    return () => clearInterval(id);
  }, [endsAt]);

  const start = () => {
    track("challenge_started", { challengeId: challenge.id });
    setLeft(totalSeconds);
    setRunning(true);
    setExpired(false);
    setEndsAt(Date.now() + totalSeconds * 1000);
  };

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <section
      id="challenge"
      aria-label="Daily challenge"
      className="glass scroll-mt-28 rounded-3xl p-6"
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-warning">
          Today&apos;s challenge
        </p>
        <span aria-hidden className="text-lg">
          {expired ? "💤" : "⚡"}
        </span>
      </div>

      <p className="mt-3 font-display text-lg font-bold tracking-tight text-ink">
        {expired ? "Challenge expired. Come back tomorrow." : challenge.title}
      </p>
      <p className="mt-2 text-xs text-ink-secondary">{challenge.reward}</p>

      <p
        className={cn(
          "mt-4 font-display text-4xl font-bold tracking-tight tabular-nums sm:text-5xl",
          expired ? "text-ink-muted" : "text-ink"
        )}
      >
        {mm}:{ss}
      </p>

      <button
        type="button"
        onClick={start}
        disabled={running}
        className="mt-5 w-full rounded-full bg-warning/15 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-warning transition-colors duration-300 hover:bg-warning/25 disabled:pointer-events-none disabled:opacity-50"
      >
        {running ? "In progress…" : expired ? "Try again" : "Start challenge"}
      </button>
    </section>
  );
}
