"use client";

import { useEffect, useMemo, useState } from "react";
import PhotosSection from "./PhotosSection";

type Props = {
  startsAtISO: string; // e.g. "2026-03-21T17:00:00+01:00"
};

export default function PhotosGate({ startsAtISO }: Props) {
  const startsAt = useMemo(() => new Date(startsAtISO).getTime(), [startsAtISO]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15_000); // check every 15s
    return () => clearInterval(id);
  }, []);

  const hasStarted = now >= startsAt;

  if (!hasStarted) {
    return (
      <section className="mt-10 rounded-2xl border border-border/60 bg-card/45 p-6 backdrop-blur">
        <h2 className="text-lg font-semibold">Bilder från kvällen</h2>
        <p className="mt-2 text-sm text-foreground/70">
          Uppladdning öppnar när kalaset börjar: <span className="font-semibold">21 mars kl. 17:00</span>. Då kan du ladda upp bilder från kvällen, och se bilder som andra har laddat upp!
        </p>
      </section>
    );
  }

  return <PhotosSection />;
}