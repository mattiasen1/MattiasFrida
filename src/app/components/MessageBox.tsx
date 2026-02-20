"use client";

import { useState } from "react";
import Link from "next/link";

export default function MessageBox() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function submit() {
    setStatus(null);

    if (!name.trim() || !message.trim()) {
      setStatus("Skriv både namn och en hälsning 💛");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, message }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Kunde inte spara");

      setName("");
      setMessage("");
      setStatus("Tack! Hälsningen är sparad!");
    } catch (e: any) {
      setStatus(e?.message ?? "Något gick fel");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-10 rounded-2xl border border-border/60 bg-card/45 p-6 backdrop-blur sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Skriv en hälsning</h2>
          <p className="mt-1 text-sm text-foreground/70">
            Säg något roligt till oss! 
          </p>
        </div>

        <Link
          href="/halsningar"
          className="w-fit rounded-xl border border-border/70 bg-card/40 px-3 py-2 text-center text-sm font-semibold backdrop-blur hover:bg-card/60"
        >
          Se alla hälsningar →
        </Link>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {/* Name */}
        <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ditt namn"
            className="order-1 w-full rounded-xl border border-border bg-card/40 p-3 text-sm outline-none focus:ring-2 focus:ring-pink-400/60"
            maxLength={40}
        />

        {/* Message */}
        <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Din hälsning…"
            className="order-2 min-h-[120px] w-full rounded-xl border border-border bg-card/40 p-3 text-sm outline-none focus:ring-2 focus:ring-pink-400/60 sm:col-span-2"
            maxLength={500}
        />

        {/* Send */}
        <button
            onClick={submit}
            disabled={busy}
            className="order-3 rounded-xl bg-pink-500 px-3 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-pink-600 disabled:opacity-50 sm:col-span-2"
        >
            {busy ? "Skickar..." : "Skicka hälsning"}
        </button>
        </div>

      {status && <div className="mt-3 text-sm text-foreground/75">{status}</div>}
    </section>
  );
}