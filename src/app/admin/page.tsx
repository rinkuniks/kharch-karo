"use client";

import { useEffect, useState } from "react";
import { getVisits, getStats, type VisitRecord } from "@/lib/geolocation";

function FlagEmoji({ code }: { code: string }) {
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((c) => 0x1f1e6 + c.charCodeAt(0) - 65);
  return <span>{String.fromCodePoint(...codePoints)}</span>;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function AdminPage() {
  const [visits, setVisits] = useState<VisitRecord[]>([]);
  const [stats, setStats] = useState<ReturnType<typeof getStats> | null>(null);

  useEffect(() => {
    setVisits(getVisits());
    setStats(getStats());
  }, []);

  if (!stats) return <div className="p-8 text-ink">Loading...</div>;

  return (
    <div className="min-h-screen bg-bg p-6 text-ink lg:p-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-accent-secondary">
            Analytics
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
            Visitor Locations
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Tracked via IP geolocation (ipapi.co). Stored locally in your browser.
          </p>
        </header>

        {/* Country breakdown */}
        {Object.keys(stats.byCountry).length > 0 && (
          <div className="mb-8 rounded-2xl border border-line bg-surface p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-ink-secondary">
              By country
            </h2>
            <div className="space-y-2">
              {Object.entries(stats.byCountry)
                .sort((a, b) => b[1] - a[1])
                .map(([country, count]) => {
                  const pct = Math.round((count / stats.total) * 100);
                  return (
                    <div key={country} className="flex items-center gap-3">
                      <span className="w-8 text-right text-xs text-ink-muted tabular-nums">{pct}%</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-32 truncate text-sm text-ink">{country}</span>
                      <span className="text-xs text-ink-muted tabular-nums">{count}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Recent visits table */}
        <div className="rounded-2xl border border-line bg-surface">
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-ink-secondary">Recent visits</h2>
          </div>
          {visits.length === 0 ? (
            <div className="p-8 text-center text-sm text-ink-muted">
              No visits recorded yet. Open this page from different locations to see data.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                    <th className="px-5 py-3">When</th>
                    <th className="px-5 py-3">Country</th>
                    <th className="px-5 py-3">City</th>
                    <th className="px-5 py-3">ISP</th>
                    <th className="px-5 py-3">Timezone</th>
                  </tr>
                </thead>
                <tbody>
                  {visits.slice(0, 50).map((v) => (
                    <tr key={v.id} className="border-b border-line/50 hover:bg-surface-elevated">
                      <td className="px-5 py-3 text-ink-muted">{timeAgo(v.timestamp)}</td>
                      <td className="px-5 py-3"><FlagEmoji code={v.countryCode} /> {v.country}</td>
                      <td className="px-5 py-3 text-ink-secondary">{v.city}, {v.region}</td>
                      <td className="px-5 py-3 text-ink-muted">{v.isp}</td>
                      <td className="px-5 py-3 text-ink-muted">{v.timezone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
