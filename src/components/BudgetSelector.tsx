"use client";

import { useState } from "react";
import { useWallet } from "@/components/providers/WalletProvider";
import { track } from "@/lib/analytics";
import { BUDGETS, formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

const MAX_CUSTOM = 100_000_000_000; // ₹100Cr — enough fantasy for anyone

/** Budget selection — visual cards (plan §5) + optional custom fantasy budget. */
export function BudgetSelector() {
  const { budget, customAmount, selectBudget, selectCustom } = useWallet();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const isCustom = budget === "custom";

  const submitCustom = () => {
    const parsed = Number(draft.replace(/[^0-9]/g, ""));
    if (!Number.isFinite(parsed) || parsed < 1000) return;
    const clamped = Math.min(parsed, MAX_CUSTOM);
    track("budget_selected", { budget: "custom", amount: clamped });
    selectCustom(clamped);
    setEditing(false);
    setDraft("");
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
      {BUDGETS.map((option) => {
        const active = !isCustom && option.value === budget;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              track("budget_selected", { budget: option.value, amount: option.amount });
              selectBudget(option.value);
            }}
            aria-pressed={active}
            className={cn(
              "rounded-2xl border px-4 py-4 text-left transition-all duration-300 ease-cinematic",
              active
                ? "glow-purple border-accent bg-accent/10"
                : "border-line bg-glass hover:border-line-strong hover:bg-white/[0.07]"
            )}
          >
            <span
              className={cn(
                "font-display text-lg font-bold tracking-tight",
                active ? "text-accent" : "text-ink"
              )}
            >
              {option.label}
            </span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
              {option.mode}
            </span>
          </button>
        );
      })}

      {/* Custom fantasy budget — plan §5 "Enter your fantasy budget" */}
      <div
        className={cn(
          "rounded-2xl border px-4 py-4 transition-all duration-300 ease-cinematic",
          isCustom
            ? "glow-purple border-accent bg-accent/10"
            : "border-dashed border-line-strong bg-glass hover:bg-white/[0.07]"
        )}
      >
        {editing ? (
          <div className="flex flex-col gap-2">
            <label htmlFor="custom-budget" className="sr-only">
              Enter your fantasy budget
            </label>
            <div className="flex items-center gap-1">
              <span className="font-display text-lg font-bold text-accent">₹</span>
              <input
                id="custom-budget"
                autoFocus
                inputMode="numeric"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitCustom()}
                placeholder="5000000"
                className="w-full bg-transparent font-display text-lg font-bold text-ink outline-none placeholder:text-ink-muted"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={submitCustom}
                className="rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white"
              >
                Set
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-full border border-line-strong px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-pressed={isCustom}
            className="h-full w-full text-left"
          >
            <span
              className={cn(
                "font-display text-lg font-bold tracking-tight",
                isCustom ? "text-accent" : "text-ink"
              )}
            >
              {isCustom && customAmount ? formatINR(customAmount) : "Custom"}
            </span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
              {isCustom ? "Your fantasy" : "Fantasy mode"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
