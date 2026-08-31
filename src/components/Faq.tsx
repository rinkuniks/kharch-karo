"use client";

import { Reveal } from "@/components/Reveal";

const FAQS = [
  {
    q: "Is this real money?",
    a: "No. Kharch Karo is a virtual entertainment experience. No real purchases are made through the game. Ever.",
  },
  {
    q: "Do I need to sign up?",
    a: "No login. No OTP. No email. Open the site and start spending anonymously.",
  },
  {
    q: "Where does my session go?",
    a: "Nowhere. Your session lives in your browser only — nothing is uploaded until real accounts exist.",
  },
  {
    q: "What happens when I hit ₹0?",
    a: "You get your Damage Report: a spender personality, stats and a share card. Then you do it all again.",
  },
  {
    q: "Can I win anything?",
    a: "Bragging rights, a personality verdict and maximum dopamine. That's the whole prize pool.",
  },
];

/** FAQ — plan §33.11, doubles as the §26 trust/legal surface. */
export function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-20 lg:px-8" aria-label="Frequently asked questions">
      <Reveal>
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-accent-secondary">
          FAQ
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink">
          Questions, answered
        </h2>
        <div className="mt-8 space-y-3">
          {FAQS.map((item) => (
            <details key={item.q} className="glass group rounded-2xl px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between font-display text-sm font-bold text-ink [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden
                  className="ml-4 text-ink-muted transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{item.a}</p>
            </details>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
