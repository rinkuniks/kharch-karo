"use client";

import { Reveal } from "@/components/Reveal";

const STEPS = [
  {
    n: "01",
    title: "Pick a wallet",
    body: "₹10K to ₹10Cr — or invent your own fantasy number. No KYC, obviously.",
  },
  {
    n: "02",
    title: "Burn it",
    body: "Cars, biryani, islands, phones. Add it all and watch the counter die.",
  },
  {
    n: "03",
    title: "Take your Damage Report",
    body: "A personalized spender personality you can share. Then do it again.",
  },
];

/** "How it works" — plan §33.6 (product teaches itself, no tutorial carousel §35). */
export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8" aria-label="How it works">
      <Reveal>
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-accent-secondary">
          How it works
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink">
          Three steps to financial ruin
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.n} className="glass rounded-3xl p-6">
              <p className="text-gradient font-display text-4xl font-bold">{step.n}</p>
              <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{step.body}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
