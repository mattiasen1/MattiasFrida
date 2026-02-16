"use client";

import { useState } from "react";

export default function UploadBox({ onDone }: { onDone: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function upload() {
    if (!file) return;
    setBusy(true);
    setMsg(null);

    try {
      const r = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type, pin }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error ?? "Kunde inte skapa upload-url");
      if (file.size > 10 * 1024 * 1024) throw new Error("Max 10 MB");

      const put = await fetch(data.uploadUrl, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      });
      if (!put.ok) throw new Error("Uppladdningen misslyckades");

      setMsg("Uppladdat!");
      setFile(null);
      onDone();
    } catch (e: any) {
      setMsg(e?.message ?? "Något gick fel");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-border/60 bg-card/45 p-5 backdrop-blur">
      <div className="text-lg font-semibold">Ladda upp en bild</div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_160px_auto] sm:items-center">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full rounded-xl border border-border bg-card/40 p-2 text-sm"
        />
        <input
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="PIN-kod"
          className="w-full rounded-xl border border-border bg-card/40 p-2 text-sm"
        />
        <button
          onClick={upload}
          disabled={!file || busy}
          className="rounded-xl bg-accent px-4 py-2 font-semibold text-accent-foreground disabled:opacity-50"
        >
          {busy ? "Laddar upp..." : "Ladda upp"}
        </button>
      </div>
      {msg && <div className="mt-3 text-sm text-foreground/80">{msg}</div>}
    </div>
  );
}
