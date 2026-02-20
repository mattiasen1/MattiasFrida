"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Photo = { src: string; alt: string };

const DISPLAY_MS = 8000; // total tid per bild
const FADE_MS = 1500;

export default function PartyPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // hämta bilder
  async function loadPhotos() {
    const res = await fetch("/api/photos");
    const data = await res.json();
    setPhotos(data.photos ?? []);
  }

  // initial load + polling
  useEffect(() => {
    loadPhotos();
    const poll = setInterval(loadPhotos, 30000);
    return () => clearInterval(poll);
  }, []);

  // slideshow-loop
  useEffect(() => {
    if (photos.length === 0) return;

    const timer = setInterval(() => {
      setVisible(false); // fade out

      setTimeout(() => {
        setIndex((i) => (i + 1) % photos.length);
        setVisible(true); // fade in
      }, FADE_MS);
    }, DISPLAY_MS);

    return () => clearInterval(timer);
  }, [photos]);

  if (!photos.length) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white/60">
        Väntar på bilder...
      </div>
    );
  }

  const photo = photos[index];

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-black overflow-hidden">
      {/* vignette */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_35%,rgba(0,0,0,0.65)_100%)]" />
      </div>

      <div
        className={`transition-opacity duration-[2200ms] ease-in-out ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          width={1920}
          height={1080}
          unoptimized
          priority
          className={`
            max-h-screen
            max-w-screen
            object-contain
            drop-shadow-[0_30px_80px_rgba(0,0,0,0.7)]
            transition-transform
            duration-[12000ms]
            ease-[cubic-bezier(0.4,0,0.2,1)]
            ${visible ? "scale-[1.12]" : "scale-100"}
          `}
        />
      </div>
    </div>
  );
}
