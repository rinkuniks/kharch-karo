// Geolocation tracking — uses ipapi.co (free, no key needed, 1000 req/day)
// Stores visit data in localStorage for the admin dashboard

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

    return visit;
  } catch {
    return null;
  }
}
