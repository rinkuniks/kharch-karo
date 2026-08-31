"use client";

import { Reveal } from "@/components/Reveal";

const WALL = [
  {
    name: "Rohan",
    wallet: "₹1Cr",
    personality: "Financial Menace 💀",
    color: "#FF5577",
    quote: "Bought a private island before lunch. Kept going.",
  },
  {
    name: "Ananya",
    wallet: "₹10L",
    personality: "Tech Bro 📱",
    color: "#00E5FF",
    quote: "Four phones. Two laptops. One person. Zero regrets.",
  },
  {
    name: "Kabir",
    wallet: "₹50K",
    personality: "Certified Foodie 🍛",
    color: "#35E39A",
    quote: "The biryani economy will remember me.",
  },
  {
    name: "Simran",
    wallet: "₹1L",
    personality: "Car Guy 🏎️",
    color: "#FFB547",
    quote: "Spent it all on wheels I can't drive. Yet.",
  },
];

/** Social proof + example damage reports — plan §33.10 / §33.7. */
export function DamageWall() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8" aria-label="Wall of damage">
      <Reveal>
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-accent-secondary">
          Social proof
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink">
          Wall of Damage
        </h2>
        <p className="mt-2 text-sm text-ink-secondary">
          Recent carnage from the playground.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WALL.map((entry) => (
            <figure key={entry.name} className="glass rounded-3xl p-6">
              <p
                className="font-display text-sm font-bold"
                style={{ color: entry.color }}
              >
                {entry.personality}
              </p>
              <blockquote className="mt-3 text-sm leading-relaxed text-ink-secondary">
                &ldquo;{entry.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 flex items-center justify-between text-xs">
                <span className="font-semibold text-ink">{entry.name}</span>
                <span className="text-ink-muted tabular-nums">{entry.wallet} wallet</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
