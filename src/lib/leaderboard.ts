import { formatINR } from "./format";

export interface LeaderboardEntry {
  id: string;
  name: string;
  city: string;
  spent: number;
}

/** Mock daily leaderboard — real one arrives with Supabase (plan §14/§20). */
export const LEADERBOARD_ENTRIES: LeaderboardEntry[] = [
  { id: "e1", name: "Rahul", city: "Mumbai", spent: 9_950_000 },
  { id: "e2", name: "Priya", city: "Delhi", spent: 9_700_000 },
  { id: "e3", name: "Arjun", city: "Bengaluru", spent: 9_500_000 },
  { id: "e4", name: "Simran", city: "Chandigarh", spent: 9_200_000 },
  { id: "e5", name: "Vikram", city: "Chennai", spent: 8_900_000 },
];

export const MEDALS = [
  { color: "#FFB800", glow: "rgb(255 184 0 / 0.18)" },
  { color: "#C9D1D9", glow: "rgb(201 209 217 / 0.14)" },
  { color: "#CD7F32", glow: "rgb(205 127 50 / 0.14)" },
  { color: "#5E6673", glow: "rgb(94 102 115 / 0.1)" },
];

/** Mock global rank for a session's total spend (plan §10 "Rank"). */
export function getMockRank(spent: number): string {
  if (spent <= 0) return "—";
  const ahead = LEADERBOARD_ENTRIES.filter((e) => e.spent > spent).length;
  const rank = ahead + 1;
  return rank > LEADERBOARD_ENTRIES.length
    ? `Top ${LEADERBOARD_ENTRIES.length + 1}`
    : `#${rank} today`;
}
