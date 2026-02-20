"use client";

import { useEffect, useMemo, useState } from "react";

type CountdownProps = {
  targetISO: string; // e.g. "2026-03-21T17:00:00+01:00"
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export default function Countdown({ targetISO }: CountdownProps) {
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    // Set initial time on mount
    setNow(Date.now());
    
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Prevent hydration mismatch by not rendering until client-side
  if (now === null) {
    return (
      <div className="mt-8 rounded-2xl border border-border/60 bg-card/45 p-5 backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm text-foreground/70">Nedräkning</div>
            <div className="text-lg font-semibold">Till kalaset!</div>
          </div>

          <div className="flex w-full flex-wrap justify-start gap-2 sm:w-auto sm:justify-center sm:gap-3">
            <TimeBox label="dagar" value="--" />
            <TimeBox label="tim" value="--" />
            <TimeBox label="min" value="--" />
            <TimeBox label="sek" value="--" />
          </div>
        </div>
      </div>
    );
  }

  const diff = Math.max(0, target - now);

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds / (60 * 60)) % 24);
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const seconds = totalSeconds % 60;

  const isOver = diff === 0;

  return (
    <div className="mt-8 rounded-2xl border border-border/60 bg-card/45 p-5 backdrop-blur">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm text-foreground/70">Nedräkning</div>
          <div className="text-lg font-semibold">
            {isOver ? "Det är dags!!!!" : "Till kalaset!"}
          </div>
        </div>

        <div className="flex w-full flex-wrap justify-start gap-2 sm:w-auto sm:justify-center sm:gap-3">
          <TimeBox label="dagar" value={String(days)} />
          <TimeBox label="tim" value={pad2(hours)} />
          <TimeBox label="min" value={pad2(minutes)} />
          <TimeBox label="sek" value={pad2(seconds)} />
        </div>
      </div>
    </div>
  );
}

function TimeBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[72px] flex-1 rounded-xl border border-border/60 bg-background/40 px-3 py-2 text-center sm:min-w-[92px] sm:flex-none sm:px-4 sm:py-3">
      <div className="text-2xl font-semibold tabular-nums leading-none sm:text-3xl">
        {value}
      </div>
      <div className="mt-1 text-xs text-foreground/60">{label}</div>
    </div>
  );
}
