const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchLogs() {
  const r = await fetch(`${BASE}/api/logs`, { cache: "no-store" });
  if (!r.ok) throw new Error("failed to fetch logs");
  return r.json();
}

export async function fetchSummary() {
  const r = await fetch(`${BASE}/api/summarize`, { cache: "no-store" });
  if (!r.ok) throw new Error("failed to fetch summary");
  return r.json();
}

export async function refreshLogs() {
  const r = await fetch(`${BASE}/api/logs/refresh`, { method: "POST" });
  if (!r.ok) throw new Error("failed to refresh");
  return r.json();
}
