import Image from "next/image";

type PhotoStripProps = {
  photos: { src: string; alt: string }[];
};

export default function PhotoStrip({ photos }: PhotoStripProps) {
  const rotations = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-3"];

  return (
    <section className="mt-10">
      <div className="mb-3 text-sm text-foreground/70">Throwbacks (valfritt men stark vibe)</div>

      <div className="flex gap-4 overflow-x-auto pb-3 [-webkit-overflow-scrolling:touch]">
        {photos.map((p, idx) => (
          <div
            key={p.src}
            className={[
              "shrink-0",
              "rounded-2xl border border-border/60 bg-card/55 p-2 shadow-lg backdrop-blur",
              "transition hover:-translate-y-1",
              rotations[idx % rotations.length],
            ].join(" ")}
          >
            <div className="relative h-[210px] w-[160px] overflow-hidden rounded-xl sm:h-[240px] sm:w-[180px]">
              <Image
                src={p.src}
                alt={p.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 160px, 180px"
                priority={idx < 2}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
