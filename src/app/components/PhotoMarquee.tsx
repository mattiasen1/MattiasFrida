import Image from "next/image";

type Photo = { src: string; alt: string };

type PhotoMarqueeProps = {
  photos: Photo[];
  secondsPerLoop?: number;
};

export default function PhotoMarquee({
  photos,
  secondsPerLoop = 22,
}: PhotoMarqueeProps) {
  const doubled = [...photos, ...photos];
  const rotations = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-3"];

  return (
    <section className="mt-10">
      <div className="mb-3 text-sm text-foreground/70">Throwbacks</div>

      <div className="marquee relative overflow-hidden rounded-2xl border border-border/60 bg-card/25 backdrop-blur">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background/80 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background/80 to-transparent" />

        <div
          className="marquee-track flex w-max gap-4 p-4 will-change-transform"
          style={{ animation: `photo-marquee ${secondsPerLoop}s linear infinite` }}
        >
          {doubled.map((p, idx) => {
            const isSecondHalf = idx >= photos.length;
            return (
              <div
                key={`${p.src}-${idx}`}
                aria-hidden={isSecondHalf ? true : undefined}
                className="shrink-0 rounded-2xl border border-border/60 bg-card/55 p-2 shadow-lg transition hover:-translate-y-1"
              >
                <div
                  className={[
                    "relative overflow-hidden rounded-xl",
                    "h-[200px] w-[150px] sm:h-[240px] sm:w-[180px]",
                    rotations[idx % rotations.length],
                  ].join(" ")}
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 150px, 180px"
                    priority={idx < 2}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
