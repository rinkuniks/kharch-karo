import { formatINR } from "./format";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export interface LeaderboardEntry {
  id: string;
  name: string;
  city: string;
  spent: number;
}

/** Seed wall shown offline / before Firestore has data (plan §14/§20). */
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

/** Live top-spenders from Firestore `scores` (falls back to seed when offline/unconfigured). */
export async function fetchLeaderboard(count = 5): Promise<LeaderboardEntry[]> {
  if (!db) return LEADERBOARD_ENTRIES.slice(0, count);
  try {
    const q = query(collection(db, "scores"), orderBy("spent", "desc"), limit(count));
    const snap = await getDocs(q);
    if (snap.empty) return LEADERBOARD_ENTRIES.slice(0, count);
    return snap.docs.map((d) => {
      const v = d.data() as { name?: string; city?: string; spent?: number };
      return {
        id: d.id,
        name: String(v.name ?? "Anonymous").slice(0, 24),
        city: String(v.city ?? "India").slice(0, 24),
        spent: Number(v.spent ?? 0),
      };
    });
  } catch {
    return LEADERBOARD_ENTRIES.slice(0, count);
  }
}

/** Submit a finished session to the global board. No login — anonymous arcade style. */
export async function submitScore(entry: { name: string; city: string; spent: number }): Promise<boolean> {
  if (!db) return false;
  try {
    await addDoc(collection(db, "scores"), {
      name: entry.name.slice(0, 24),
      city: entry.city.slice(0, 24),
      spent: Math.round(entry.spent),
      createdAt: serverTimestamp(),
    });
    return true;
  } catch {
    return false;
  }
}

export function formatSpent(spent: number): string {
  return formatINR(spent);
}

