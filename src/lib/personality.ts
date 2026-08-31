import type { Category } from "./products";

export interface Personality {
  id: string;
  name: string;
  emoji: string;
  color: string;
  blurb: string;
  category?: Category;
}

export const PERSONALITIES: Personality[] = [
  { id: "financial-menace", name: "Financial Menace", emoji: "💀", color: "#FF5577", blurb: "You didn't spend money. You performed a disappearing act." },
  { id: "tech-bro", name: "Tech Bro", emoji: "📱", color: "#00E5FF", blurb: "If it has a battery and a keynote, you own it.", category: "Tech" },
  { id: "fit-check", name: "Fit Check Icon", emoji: "👟", color: "#7C5CFF", blurb: "Drip funded entirely by imaginary money.", category: "Fashion" },
  { id: "car-guy", name: "Car Guy", emoji: "🏎️", color: "#FFB547", blurb: "Your garage has a waiting list.", category: "Cars" },
  { id: "foodie", name: "Certified Foodie", emoji: "🍛", color: "#35E39A", blurb: "Wallet empty. Stomach full. Heart happy.", category: "Food" },
  { id: "jetsetter", name: "Jetsetter", emoji: "✈️", color: "#00E5FF", blurb: "Boarding passes are your love language.", category: "Travel" },
  { id: "main-character", name: "Main Character", emoji: "😎", color: "#7C5CFF", blurb: "Private islands and VIP boxes. As expected.", category: "Flex" },
  { id: "reluctant-spender", name: "The Reluctant Spender", emoji: "🧘", color: "#9BA3AF", blurb: "₹0 spent. There is no prize for this." },
];

/**
 * Damage Report personality engine.
 * Picks the personality for the category the user burned the most money on;
 * near-total burners become Financial Menace, non-spenders get shamed gently.
 */
export function computePersonality(
  spentByCategory: Partial<Record<Category, number>>,
  spentRatio: number
): Personality {
  if (spentRatio >= 0.98) return PERSONALITIES[0];

  let best: { category: Category; total: number } | null = null;
  for (const [category, total] of Object.entries(spentByCategory) as [Category, number][]) {
    if (!best || total > best.total) best = { category, total };
  }
  if (!best) return PERSONALITIES[PERSONALITIES.length - 1];

  return PERSONALITIES.find((p) => p.category === best.category) ?? PERSONALITIES[0];
}
