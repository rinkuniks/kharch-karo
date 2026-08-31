"use client";

import { Button } from "@/components/ui/button";

/** Hero — design.md §8: 100svh, left headline / right visual, subtle radial gradients. */
export function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-32 pb-20"
    >
      {/* Ambient background — design.md §8: purple 0.20 / cyan 0.12 radial gradients + grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute -top-40 left-1/4 h-[480px] w-[480px] rounded-full bg-accent/20 blur-[140px]" />
        <div className="absolute top-1/3 right-0 h-[360px] w-[360px] rounded-full bg-accent-secondary/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-14 px-5 lg:grid-cols-2 lg:items-center lg:px-8">
        {/* Left — headline, sub, CTAs (entrance sequence per §9) */}
        <div>
          <p
            className="hero-rise text-[11px] font-semibold uppercase tracking-[0.3em] text-accent-secondary"
            style={{ animationDelay: "200ms" }}
          >
            India&apos;s virtual spending playground
          </p>

          <h1
            className="hero-rise mt-6 font-display text-[42px] leading-[1.02] font-bold tracking-tight text-ink sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "350ms" }}
          >
            What would you do with{" "}
            <span className="text-gradient">₹1 Crore?</span>
          </h1>

          <p
            className="hero-rise mt-6 max-w-md text-base leading-relaxed text-ink-secondary"
            style={{ animationDelay: "500ms" }}
          >
            You can&apos;t actually spend it. That&apos;s the fun. Pick a wallet, blow
            it all, collect your Damage Report.
          </p>

          <div
            className="hero-rise mt-8 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "650ms" }}
          >
            <Button size="lg" onClick={() => scrollTo("spend")}>
              Start Spending →
            </Button>
            <Button variant="outline" size="lg" onClick={() => scrollTo("challenge")}>
              Today&apos;s Challenge
            </Button>
          </div>

          <p
            className="hero-rise mt-6 text-[11px] uppercase tracking-[0.24em] text-ink-muted"
            style={{ animationDelay: "800ms" }}
          >
            Zero rupees. Maximum dopamine.
          </p>
        </div>

        {/* Right — floating glass product orbs (stand-in for lazy-loaded 3D per §13) */}
        <div
          className="hero-rise relative mx-auto hidden h-[440px] w-full max-w-md lg:block"
          style={{ animationDelay: "800ms" }}
        >
          <div className="glow-purple absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/25 blur-[100px]" />

          <div className="glass float-slow absolute top-6 left-6 flex h-32 w-32 items-center justify-center rounded-3xl text-5xl" aria-hidden>
            🏎️
          </div>
          <div className="glass float-slower absolute top-20 right-8 flex h-40 w-40 items-center justify-center rounded-3xl text-6xl" aria-hidden>
            🏝️
          </div>
          <div className="glass float-slow absolute bottom-16 left-20 flex h-28 w-28 items-center justify-center rounded-3xl text-4xl" style={{ animationDelay: "1.4s" }} aria-hidden>
            📱
          </div>

          <div className="glass float-slower absolute right-0 bottom-0 w-56 rounded-3xl p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-muted">
              Damage report
            </p>
            <p className="text-gradient mt-1 font-display text-2xl font-bold">
              ₹1,00,00,000
            </p>
            <p className="mt-1 text-xs text-ink-secondary">Financial Menace 💀</p>
          </div>
        </div>
      </div>
    </section>
  );
}
