"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { parseBudget } from "@/lib/format";
import type { Category, Product } from "@/lib/products";

export interface Purchase {
  id: string;
  productId: string;
  name: string;
  price: number;
  qty: number;
  emoji: string;
  category: Category;
}

interface WalletContextValue {
  budget: string;
  customAmount: number | null;
  total: number;
  remaining: number;
  spent: number;
  purchases: Purchase[];
  broke: boolean;
  showDamage: boolean;
  canDismissDamage: boolean;
  deniedProductId: string | null;
  purchasePulse: number;
  spentByCategory: Partial<Record<Category, number>>;
  cartOpen: boolean;
  searchOpen: boolean;
  quickView: Product | null;
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  selectBudget: (value: string) => void;
  selectCustom: (amount: number) => void;
  addToWallet: (product: Product, qty?: number) => boolean;
  removeFromWallet: (purchaseId: string) => void;
  finishSession: () => void;
  dismissDamage: () => void;
  reset: () => void;
  restartWithCr: () => void;
  clearDenied: () => void;
}

const WalletContext = createContext<WalletContextValue | null>(null);
const STORAGE_KEY = "kharch-karo-session-v1";

export function WalletProvider({ children }: { children: ReactNode }) {
  const [budget, setBudget] = useState("1Cr");
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [finished, setFinished] = useState(false);
  const [deniedProductId, setDeniedProductId] = useState<string | null>(null);
  const [purchasePulse, setPurchasePulse] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [hydrated, setHydrated] = useState(false);

  /* Local anonymous session — plan §16 (no login, session lives in the browser) */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as {
          budget?: string;
          customAmount?: number | null;
          purchases?: Purchase[];
        };
        if (saved.budget) setBudget(saved.budget);
        if (saved.customAmount) setCustomAmount(saved.customAmount);
        if (Array.isArray(saved.purchases)) setPurchases(saved.purchases);
      }
    } catch {
      /* corrupted storage — start fresh */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ budget, customAmount, purchases })
      );
    } catch {
      /* storage unavailable — session stays in memory */
    }
  }, [hydrated, budget, customAmount, purchases]);

  const total = customAmount ?? parseBudget(budget);
  const spent = useMemo(
    () => purchases.reduce((sum, p) => sum + p.price * p.qty, 0),
    [purchases]
  );
  const remaining = total - spent;
  const broke = purchases.length > 0 && remaining <= 0;
  const showDamage = broke || finished;
  const spentByCategory = useMemo(() => {
    const map: Partial<Record<Category, number>> = {};
    for (const p of purchases) {
      map[p.category] = (map[p.category] ?? 0) + p.price * p.qty;
    }
    return map;
  }, [purchases]);

  const clearSession = useCallback(() => {
    setPurchases([]);
    setFinished(false);
    setDeniedProductId(null);
  }, []);

  const selectBudget = useCallback(
    (value: string) => {
      setBudget(value);
      setCustomAmount(null);
      clearSession();
    },
    [clearSession]
  );

  const selectCustom = useCallback(
    (amount: number) => {
      setBudget("custom");
      setCustomAmount(amount);
      clearSession();
    },
    [clearSession]
  );

  const addToWallet = useCallback(
    (product: Product, qty = 1): boolean => {
      setDeniedProductId(null);
      const cost = product.price * qty;
      if (cost > remaining) {
        setDeniedProductId(product.id);
        return false;
      }
      setPurchases((prev) => [
        ...prev,
        {
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          qty,
          emoji: product.emoji,
          category: product.category,
        },
      ]);
      setPurchasePulse((n) => n + 1);
      return true;
    },
    [remaining]
  );

  const removeFromWallet = useCallback((purchaseId: string) => {
    setPurchases((prev) => prev.filter((p) => p.id !== purchaseId));
  }, []);

  /* ---- PROVIDER VALUE APPENDED BELOW ---- */

  const reset = useCallback(() => clearSession(), [clearSession]);

  const restartWithCr = useCallback(() => {
    setBudget("1Cr");
    setCustomAmount(null);
    clearSession();
  }, [clearSession]);

  const value = useMemo<WalletContextValue>(
    () => ({
      budget,
      customAmount,
      total,
      remaining,
      spent,
      purchases,
      broke,
      showDamage,
      canDismissDamage: !broke,
      deniedProductId,
      purchasePulse,
      spentByCategory,
      cartOpen,
      searchOpen,
      quickView,
      setCartOpen,
      setSearchOpen,
      openQuickView: (p: Product) => setQuickView(p),
      closeQuickView: () => setQuickView(null),
      selectBudget,
      selectCustom,
      addToWallet,
      removeFromWallet,
      finishSession: () => setFinished(true),
      dismissDamage: () => setFinished(false),
      reset,
      restartWithCr,
      clearDenied: () => setDeniedProductId(null),
    }),
    [
      budget,
      customAmount,
      total,
      remaining,
      spent,
      purchases,
      broke,
      showDamage,
      deniedProductId,
      purchasePulse,
      spentByCategory,
      cartOpen,
      searchOpen,
      quickView,
      selectBudget,
      selectCustom,
      addToWallet,
      removeFromWallet,
      reset,
      restartWithCr,
    ]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside <WalletProvider>");
  return ctx;
}
