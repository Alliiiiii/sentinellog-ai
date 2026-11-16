"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { fetchLogs, fetchSummary, refreshLogs } from "@/lib/api";

type Log = { id: number; timestamp: string; ip: string; event: string; severity: string; details: string };

const SEV_COLOR: Record<string, string> = {
  critical: "text-red-400",
  high: "text-orange-400",
  medium: "text-yellow-400",
  low: "text-blue-400",
  info: "text-zinc-400",
};

export default function Dashboard() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const [l, s] = await Promise.all([fetchLogs(), fetchSummary()]);
      setLogs(l);
      setSummary(s.summary);
    } catch (e: any) {
      setErr(e.message || "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const chartData = (() => {
    const buckets: Record<string, number> = {};
    for (const l of logs) {
      const d = new Date(l.timestamp);
      const key = `${d.getHours().toString().padStart(2, "0")}:${Math.floor(d.getMinutes() / 10) * 10}`.padStart(5, "0");
      buckets[key] = (buckets[key] || 0) + 1;
    }
    return Object.keys(buckets).sort().map((k) => ({ time: k, count: buckets[k] }));
  })();

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">SentinelLog AI</h1>
          <p className="text-sm text-zinc-400">Security Information & Event Management Dashboard</p>
        </div>
        <button
          onClick={async () => { await refreshLogs(); await load(); }}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
        >
          Refresh Logs
        </button>
      </header>

      {err && <div className="mb-4 rounded-lg bg-red-900/40 p-3 text-red-300">{err} — is the backend running on :8000?</div>}

      <section className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs text-zinc-400">Total Events</p>
          <p className="mt-1 text-3xl font-bold">{logs.length}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs text-zinc-400">Critical/High</p>
          <p className="mt-1 text-3xl font-bold text-red-400">
            {logs.filter((l) => l.severity === "critical" || l.severity === "high").length}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs text-zinc-400">Unique IPs</p>
          <p className="mt-1 text-3xl font-bold">{new Set(logs.map((l) => l.ip)).size}</p>
        </div>
      </section>

      <section className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="mb-4 text-lg font-semibold">Attack Frequency Over Time</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="time" stroke="#a1a1aa" fontSize={12} />
              <YAxis stroke="#a1a1aa" fontSize={12} />
              <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #3f3f46" }} />
              <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mb-8 rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-5">
        <h2 className="mb-2 text-lg font-semibold text-emerald-300">AI Threat Summary</h2>
        <p className="text-sm leading-relaxed text-zinc-300">
          {loading ? "Analyzing logs…" : summary || "No summary available."}
        </p>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="mb-4 text-lg font-semibold">Recent Logs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-zinc-400">
              <tr>
                <th className="pb-2">Time</th>
                <th className="pb-2">IP</th>
                <th className="pb-2">Event</th>
                <th className="pb-2">Severity</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 25).map((l) => (
                <tr key={l.id} className="border-t border-zinc-800">
                  <td className="py-2 font-mono text-xs text-zinc-400">{new Date(l.timestamp).toLocaleTimeString()}</td>
                  <td className="py-2 font-mono text-xs">{l.ip}</td>
                  <td className="py-2">{l.event}</td>
                  <td className={`py-2 font-semibold ${SEV_COLOR[l.severity] || ""}`}>{l.severity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
