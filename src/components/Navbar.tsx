"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/components/providers/WalletProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function BagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M6 7h12l1 14H5L6 7Z" />
      <path d="M9 10V6a3 3 0 0 1 6 0v4" />
    </svg>
  );
}

/** Floating glass navigation — design.md §7 + §30 mobile header (LOGO · SEARCH · CART). */
export function Navbar() {
  const { remaining, purchases, setCartOpen, setSearchOpen } = useWallet();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={cn(
          "glass-strong flex w-full max-w-5xl items-center justify-between gap-3 rounded-full transition-all duration-500 ease-cinematic",
          scrolled ? "px-4 py-2" : "px-5 py-3"
        )}
      >
        <a
          href="#top"
          className="font-display text-sm font-bold uppercase tracking-[0.18em] text-ink"
        >
          Kharch<span className="text-accent"> Karo</span>
          <span aria-hidden className="ml-1">
            💸
          </span>
        </a>

        <div className="hidden items-center gap-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-secondary md:flex">
          <a href="#wallet" className="transition-colors hover:text-ink">
            Wallet
          </a>
          <a href="#spend" className="transition-colors hover:text-ink">
            Spend
          </a>
          <a href="#challenge" className="transition-colors hover:text-ink">
            Challenge
          </a>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white/5 text-ink-secondary transition-colors hover:border-line-strong hover:text-ink"
          >
            {theme === "dark" ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search products"
            className="flex h-10 items-center gap-2 rounded-full border border-line bg-white/5 px-3 text-ink-secondary transition-colors hover:border-line-strong hover:text-ink"
          >
            <SearchIcon className="h-4 w-4" />
            <kbd className="hidden rounded border border-line-strong px-1.5 text-[10px] font-semibold lg:inline">
              Ctrl K
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Your collection, ${purchases.length} items`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white/5 text-ink-secondary transition-colors hover:border-line-strong hover:text-ink"
          >
            <BagIcon className="h-4 w-4" />
            {purchases.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                {purchases.length}
              </span>
            )}
          </button>

          <div className="hidden rounded-full border border-line-strong bg-white/5 px-4 py-1.5 text-right sm:block">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-ink-muted">
              Balance
            </p>
            <p className="font-display text-sm font-bold text-accent-secondary tabular-nums">
              {formatINR(remaining)}
            </p>
          </div>
        </div>
      </nav>
    </header>
  );
}
