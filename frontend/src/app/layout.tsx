import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SentinelLog AI — Security Dashboard",
  description: "Lightweight SIEM dashboard with AI threat summaries.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">{children}</body>
    </html>
  );
}
