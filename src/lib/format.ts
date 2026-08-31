/** Budget options — amounts are the single source of truth for the wallet engine. */
export interface BudgetOption {
  value: string;
  label: string;
  mode: string;
  amount: number;
}

export const BUDGETS: BudgetOption[] = [
  { value: "10K", label: "₹10K", mode: "Weekend Mode", amount: 10_000 },
  { value: "50K", label: "₹50K", mode: "Salary Mode", amount: 50_000 },
  { value: "1L", label: "₹1L", mode: "Treat Yourself", amount: 100_000 },
  { value: "10L", label: "₹10L", mode: "Rich-ish", amount: 1_000_000 },
  { value: "1Cr", label: "₹1Cr", mode: "Crorepati", amount: 10_000_000 },
  { value: "10Cr", label: "₹10Cr", mode: "Money Is Fake", amount: 100_000_000 },
];

export function parseBudget(value: string): number {
  return BUDGETS.find((b) => b.value === value)?.amount ?? 10_000_000;
}

/** Indian-format a rupee amount: 10000000 -> "₹1,00,00,000" */
export function formatINR(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}
