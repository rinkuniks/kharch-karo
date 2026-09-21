// Geolocation tracking — ipapi.co (free, no key needed, 1000 req/day) for the
// visitor's location, localStorage for the local admin view, and Firestore
// `visits` (when configured) so the dashboard can aggregate across visitors.

export interface VisitRecord {
  id: string;
  timestamp: number;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  lat: number;
  lon: number;
  isp: string;
  timezone: string;
}

// Firestore sync happens through dynamic imports so the static export stays
// buildable with zero Firebase configuration.

const STORAGE_KEY = "kharch-karo-visits";
const IP_API = "https://ipapi.co/json/";

function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function readStore(): VisitRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as VisitRecord[]) : [];
  } catch {
    return [];
  }
}

function writeStore(visits: VisitRecord[]): void {
  const trimmed = visits.slice(-500);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function getVisits(): VisitRecord[] {
  return readStore().sort((a, b) => b.timestamp - a.timestamp);
}

export function getStats() {
  const visits = readStore();
  const byCountry: Record<string, number> = {};
  const byCity: Record<string, number> = {};

  for (const v of visits) {
    byCountry[v.country] = (byCountry[v.country] ?? 0) + 1;
    byCity[`${v.city}, ${v.countryCode}`] = (byCity[`${v.city}, ${v.countryCode}`] ?? 0) + 1;
  }

  const total = visits.length;
  const uniqueCountries = Object.keys(byCountry).length;
  const lastVisit = visits.length ? visits[visits.length - 1] : null;

  return { total, uniqueCountries, byCountry, byCity, lastVisit };
}

export async function trackVisit(): Promise<VisitRecord | null> {
  try {
    const sessionKey = "kharch-karo-session-tracked";
    if (sessionStorage.getItem(sessionKey)) return null;

    const res = await fetch(IP_API);
    if (!res.ok) return null;
    const data = await res.json();

    const visit: VisitRecord = {
      id: makeId(),
      timestamp: Date.now(),
      country: data.country_name ?? "Unknown",
      countryCode: data.country_code ?? "??",
      region: data.region ?? "Unknown",
      city: data.city ?? "Unknown",
      lat: data.latitude ?? 0,
      lon: data.longitude ?? 0,
      isp: data.org ?? data.isp ?? "Unknown",
      timezone: data.timezone ?? "Unknown",
    };

    const store = readStore();
    store.push(visit);
    writeStore(store);
    sessionStorage.setItem(sessionKey, "1");

    // Best-effort global sync — never blocks the game.
    try {
      const { db } = await import("./firebase");
      if (db) {
        const fs = await import("firebase/firestore");
        await fs.addDoc(fs.collection(db, "visits"), { ...visit, createdAt: fs.serverTimestamp() });
      }
    } catch {
      /* offline or unconfigured — local store is enough */
    }

    return visit;
  } catch {
    return null;
  }
}

/** Live visits from Firestore `visits` (falls back to local store offline). */
export async function fetchRemoteVisits(count = 50): Promise<{ visits: VisitRecord[]; live: boolean }> {
  const local = getVisits();
  try {
    const { db } = await import("./firebase");
    if (!db) return { visits: local, live: false };
    const fs = await import("firebase/firestore");
    const q = fs.query(fs.collection(db, "visits"), fs.orderBy("timestamp", "desc"), fs.limit(count));
    const snap = await fs.getDocs(q);
    if (snap.empty) return { visits: local, live: true };
    const visits = snap.docs.map((d) => {
      const v = d.data() as Partial<VisitRecord>;
      return {
        id: d.id,
        timestamp: typeof v.timestamp === "number" ? v.timestamp : Date.now(),
        country: String(v.country ?? "Unknown"),
        countryCode: String(v.countryCode ?? "??"),
        region: String(v.region ?? "Unknown"),
        city: String(v.city ?? "Unknown"),
        lat: Number(v.lat ?? 0),
        lon: Number(v.lon ?? 0),
        isp: String(v.isp ?? "Unknown"),
        timezone: String(v.timezone ?? "Unknown"),
      } satisfies VisitRecord;
    });
    return { visits, live: true };
  } catch {
    return { visits: local, live: false };
  }
}

export function getStatsFrom(visits: VisitRecord[]) {
  const byCountry: Record<string, number> = {};
  const byCity: Record<string, number> = {};
  for (const v of visits) {
    byCountry[v.country] = (byCountry[v.country] ?? 0) + 1;
    byCity[`${v.city}, ${v.countryCode}`] = (byCity[`${v.city}, ${v.countryCode}`] ?? 0) + 1;
  }
  return {
    total: visits.length,
    uniqueCountries: Object.keys(byCountry).length,
    byCountry,
    byCity,
    lastVisit: visits.length ? visits[visits.length - 1] : null,
  };
}

