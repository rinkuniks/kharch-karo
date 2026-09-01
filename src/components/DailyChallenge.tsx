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
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [left, setLeft] = useState(CHALLENGES[0].seconds);
  const [expired, setExpired] = useState(false);

  const challenge = CHALLENGES[index];

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (running && left === 0) {
      setRunning(false);
      setExpired(true);
    }
  }, [running, left]);

  const start = () => {
    track("challenge_started", { challengeId: challenge.id });
    setExpired(false);
    setLeft(challenge.seconds);
    setRunning(true);
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
