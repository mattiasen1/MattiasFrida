"use client";

import { useEffect, useState } from "react";
import PhotoMarquee from "./PhotoMarquee";

type Photo = { src: string; alt: string };

export default function LiveGallery({ refreshKey }: { refreshKey: number }) {
  const [photos, setPhotos] = useState<Photo[]>([]);

  async function load() {
    const r = await fetch("/api/photos", { cache: "no-store" });
    const d = await r.json();
    setPhotos(d.photos ?? []);
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 20000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    load();
  }, [refreshKey]);

  if (!photos.length) {
    return <div className="mt-8 text-sm text-foreground/70">Inga bilder än – bli först! 📸</div>;
  }

  return <PhotoMarquee photos={photos} secondsPerLoop={26} />;
}
