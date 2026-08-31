"use client";

import { useEffect } from "react";
import { BudgetSelector } from "@/components/BudgetSelector";
import { CartDrawer } from "@/components/CartDrawer";
import { DailyChallenge } from "@/components/DailyChallenge";
import { DamageReport } from "@/components/DamageReport";
import { DamageWall } from "@/components/DamageWall";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Leaderboard } from "@/components/Leaderboard";
import { MobileBar } from "@/components/MobileBar";
import { Navbar } from "@/components/Navbar";
import { ProductQuickView } from "@/components/ProductQuickView";
import { Reveal } from "@/components/Reveal";
import { SearchOverlay } from "@/components/SearchOverlay";
import { SpendingExperience } from "@/components/SpendingExperience";
import { WalletDisplay } from "@/components/WalletDisplay";
import { WalletProvider } from "@/components/providers/WalletProvider";
import { ToastProvider } from "@/components/ui/toast";
import { track } from "@/lib/analytics";

/** App shell — state centralized in WalletProvider, composition kept modular (design.md §47). */
export function KharchApp() {
  useEffect(() => {
    track("landing_view");
  }, []);

  return (
    <WalletProvider>
      <ToastProvider>
        {/* Film grain overlay */}
        <div
          aria-hidden
          className="bg-noise pointer-events-none fixed inset-0 z-70 opacity-[0.04]"
        />

        <Navbar />

        <main className="relative pb-24 lg:pb-0">
          <Hero />

          {/* Step 01 — budget selection */}
          <section
            className="mx-auto max-w-6xl px-5 pb-20 lg:px-8"
            aria-label="Budget selection"
          >
            <Reveal>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-accent-secondary">
                    Step 01
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink">
                    Choose your wallet
                  </h2>
                </div>
                <p className="text-xs text-ink-muted">Fictional money only. Obviously.</p>
              </div>
              <BudgetSelector />
            </Reveal>
          </section>

          {/* Step 02 — spending floor + sidebar HUD */}
          <section
            className="mx-auto grid max-w-7xl gap-10 px-5 pb-24 lg:grid-cols-[1fr_340px] lg:px-8"
            aria-label="Spending floor"
          >
            <Reveal>
              <SpendingExperience />
            </Reveal>

            <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
              <Reveal>
                <WalletDisplay />
              </Reveal>
              <Reveal delay={120}>
                <DailyChallenge />
              </Reveal>
              <Reveal delay={240}>
                <Leaderboard />
              </Reveal>
            </aside>
          </section>

          {/* Landing sections — plan §33 */}
          <HowItWorks />
          <DamageWall />
          <Faq />

          {/* Footer — design.md §23 + plan §26 legal line */}
          <footer className="mx-auto max-w-6xl px-5 pb-28 lg:px-8 lg:pb-12">
            <Reveal>
              <div className="glass flex flex-col items-center gap-2 rounded-3xl px-6 py-10 text-center">
                <p className="font-display text-sm font-bold tracking-[0.2em] text-ink uppercase">
                  Kharch Karo <span aria-hidden>💸</span>
                </p>
                <p className="text-xs text-ink-secondary">
                  Spend like nobody&apos;s watching. No real money. No real regrets.
                </p>
                <a
                  href="/demo/kharch-karo-demo.mp4"
                  target="_blank"
                  rel="noopener"
                  className="mt-2 rounded-full border border-line-strong px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-secondary transition-colors hover:border-accent hover:text-accent"
                >
                  ▶ Watch the demo
                </a>
                <p className="mt-2 max-w-md text-[11px] leading-relaxed text-ink-muted">
                  Kharch Karo is a virtual entertainment experience. No real purchases are
                  made through the game.
                </p>
                <p className="mt-3 text-[10px] uppercase tracking-[0.24em] text-ink-muted">
                  © 2026 Kharch Karo · System online ●
                </p>
              </div>
            </Reveal>
          </footer>
        </main>

        {/* Overlays */}
        <MobileBar />
        <CartDrawer />
        <SearchOverlay />
        <ProductQuickView />
        <DamageReport />
      </ToastProvider>
    </WalletProvider>
  );
}
