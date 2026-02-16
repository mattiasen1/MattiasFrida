// app/page.tsx
import Link from "next/link";
import Countdown from "./components/Countdown";
import PhotoMarquee from "./components/PhotoMarquee";
import PhotosSection from "./components/PhotosSection";

export default function HomePage() {
    const party = {
      title: "Vi fyller 30!",
      names: "Frida & Mattias",
      date: "21 mars 2026",
      time: "17:00 – 22:00 (dans till 01:00)",
      locationName: "Gamla Stadshotellet · Heart & Bones",
      address: "Drottninggatan 9, 753 10 Uppsala",
    };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.35),transparent_65%)] blur-2xl" />
        <div className="absolute -left-32 top-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.28),transparent_60%)] blur-2xl" />
        <div className="absolute -right-40 top-72 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.22),transparent_60%)] blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.08),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.06),transparent_40%)]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-5 py-14 sm:py-20">
        {/* Top tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-sm backdrop-blur">
          <span aria-hidden>🎉</span>
          <span className="opacity-90">Födelsedagskalas</span>
        </div>
        {/* Hero */}
        <header className="mt-6">
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            {party.title}
          </h1>
          <p className="mt-3 text-lg text-foreground/80 sm:text-xl">
            <span className="font-semibold">{party.names}</span> kalas, tjoho! 🥳
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Pill>📅 {party.date}</Pill>
            <Pill>🕔 Start kl. 17:00</Pill>
            <Pill>📍 Uppsala</Pill>
          </div>
        </header>

        <Countdown targetISO="2026-03-21T17:00:00+01:00" />
        {/* Details card */}
        <section className="mt-10 rounded-2xl border border-border/60 bg-card/55 p-6 backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Praktisk information</h2>

              <div className="mt-4 grid gap-3 text-foreground/85">
                <DetailRow label="När" value={`${party.date}, kl. ${party.time}`} />
                <DetailRow
                  label="Var"
                  value={`${party.locationName}, ${party.address}`}
                />
                <DetailRow label="Hur" value="Förmingel 17:00 · Middag 18:00 · Bar öppen hela kvällen" />
              </div>
            </div>

            {/* CTA */}
            <div className="w-full sm:w-[280px]">
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Link
                  href="/info"
                  className="rounded-xl border border-border/70 bg-card/40 px-3 py-2 text-center text-sm font-semibold backdrop-blur"
                >
                  Praktisk info
                </Link>
                <Link
                  href="/playlist"
                  className="rounded-xl border border-border/70 bg-card/40 px-3 py-2 text-center text-sm font-semibold backdrop-blur"
                >
                  Lägg till låt
                </Link>
              </div>
            </div>
          </div>
        </section>

        <PhotosSection />
        {/* Fun cards */}
        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          <FunCard
            icon="🍸"
            title="Kvällen"
            body="Förmingel från 17:00, middag 18:00. Baren är öppen under kvällen. Dans fram till 01:00."
          />
          <FunCard
            icon="🧥"
            title="Klädkod: Udda kavaj"
            body="Lite finare. Folkdräkt OK, kostym OK, långklänning OK, skjorta OK, byxdress OK. Mjukiskläder INTE OK."
          />
          <FunCard
            icon="💃"
            title="Kalas"
            body="Fest, skratt, bra mat, bra musik och ännu bättre sällskap."
          />
        </section>


        <footer className="mt-12 text-sm text-foreground/55">
          / Frida och Mattias <span aria-hidden>❤️</span>
        </footer>
      </div>
    </main>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border/60 bg-card/35 px-3 py-1 text-sm text-foreground/80 backdrop-blur">
      {children}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[88px_1fr] gap-3">
      <div className="text-sm text-foreground/60">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function FunCard({ title, body, icon }: { title: string; body: string; icon: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/45 p-5 backdrop-blur transition hover:bg-card/60">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-card/60 text-lg">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-foreground/70">{body}</p>
        </div>
      </div>
    </div>
  );
}
