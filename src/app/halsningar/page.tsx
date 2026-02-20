"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type GuestMessage = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

function hashTo01(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

export default function HalsningarPage() {
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/messages", { cache: "no-store" });
    const data = await res.json();
    setMessages(data.messages ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 20000);
    return () => clearInterval(id);
  }, []);

  const placed = useMemo(() => {
    return messages.map((m) => {
      const a = hashTo01(m.id + "a");
      const b = hashTo01(m.id + "b");
      const c = hashTo01(m.id + "c");

      // keep within safe margins; cards will still overlap a bit (fun!)
      const left = 6 + a * 88;  // vw
      const top = 8 + b * 80;   // vh
      const rot = (c * 10 - 5).toFixed(2); // -5..+5 deg
      return { ...m, left, top, rot };
    });
  }, [messages]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.28),transparent_65%)] blur-2xl" />
        <div className="absolute -left-32 top-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.22),transparent_60%)] blur-2xl" />
        <div className="absolute -right-40 top-72 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.18),transparent_60%)] blur-2xl" />
      </div>

      <div className="relative mx-auto w-full px-4 py-10 sm:px-6 lg:px-10 xl:px-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Hälsningar</h1>
          </div>

          <Link
            href="/"
            className="rounded-xl border border-border/70 bg-card/40 px-3 py-2 text-sm font-semibold backdrop-blur hover:bg-card/60"
          >
            ← Tillbaka
          </Link>
        </div>
      </div>

      {/* Floating canvas */}
        <section className="relative w-full px-4 pb-20 sm:px-6 lg:px-10 xl:px-16">
            {loading && (
                <div className="mb-6 rounded-2xl border border-border/60 bg-card/30 p-4 text-sm text-foreground/70 backdrop-blur">
                Hämtar hälsningar…
                </div>
            )}

            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5">
                {messages.map((m) => (
                    <MasonryCard key={m.id} m={m} />
                ))}
            </div>
        </section>
    </main>
  );
}

function MasonryCard({ m }: { m: GuestMessage }) {
  const r = hashTo01(m.id + "r");
  const t = hashTo01(m.id + "t");
  const hue = Math.round(hashTo01(m.id + "h") * 12);

  const accents = [
    "border-pink-400/30",
    "border-blue-400/30",
    "border-emerald-400/30",
    "border-violet-400/30",
    "border-amber-400/30",
  ];
  const accent = accents[hue % accents.length];

  // small playful transforms (but not enough to cause overlaps)
  const rot = (r * 6 - 3).toFixed(2);     // -3..+3 deg
  const dx = (t * 10 - 5).toFixed(2);     // -5..+5 px

  return (
    <div
      className={[
        "mb-4 break-inside-avoid",
        "rounded-2xl border bg-card/55 p-5 shadow-lg backdrop-blur",
        "transition hover:-translate-y-1 hover:bg-card/70",
        accent,
      ].join(" ")}
      style={{
        transform: `translateX(${dx}px) rotate(${rot}deg)`,
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="font-semibold">{m.name}</div>
        <div className="text-xs text-foreground/55">
          {new Date(m.createdAt).toLocaleString("sv-SE", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/80">
        {m.message}
      </p>
    </div>
  );
}