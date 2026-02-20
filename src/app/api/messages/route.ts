import { NextResponse } from "next/server";
import { BlobServiceClient } from "@azure/storage-blob";
import crypto from "crypto";

type GuestMessage = {
  id: string;
  name: string;
  message: string;
  createdAt: string; // ISO
};

function getClients() {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = process.env.BLOB_CONTAINER_NAME;

  if (!conn) throw new Error("AZURE_STORAGE_CONNECTION_STRING is missing");
  if (!containerName) throw new Error("BLOB_CONTAINER_NAME is missing");

  const service = BlobServiceClient.fromConnectionString(conn);
  const container = service.getContainerClient(containerName);
  return { container };
}

function clean(s: unknown, max: number) {
  const v = String(s ?? "").trim();
  // Keep it simple: strip control chars, limit length
  const noCtl = v.replace(/[\u0000-\u001F\u007F]/g, "");
  return noCtl.slice(0, max);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = clean(body.name, 40);
    const message = clean(body.message, 500);

    if (!name || !message) {
      return NextResponse.json(
        { error: "Fyll i både namn och meddelande." },
        { status: 400 }
      );
    }

    const { container } = getClients();

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const payload: GuestMessage = { id, name, message, createdAt };

    const blobName = `guestbook/${Date.now()}-${id}.json`;
    const blob = container.getBlockBlobClient(blobName);

    await blob.upload(JSON.stringify(payload, null, 2), Buffer.byteLength(JSON.stringify(payload)), {
      blobHTTPHeaders: { blobContentType: "application/json; charset=utf-8" },
    });

    return NextResponse.json({ ok: true, id });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Serverfel" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { container } = getClients();

    const items: GuestMessage[] = [];

    for await (const b of container.listBlobsFlat({ prefix: "guestbook/" })) {
      if (!b.name.endsWith(".json")) continue;
      const blob = container.getBlobClient(b.name);
      const res = await blob.download();
      const text = await streamToString(res.readableStreamBody);
      const parsed = JSON.parse(text) as GuestMessage;
      items.push(parsed);
    }

    // newest first
    items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    return NextResponse.json({ messages: items });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Serverfel" },
      { status: 500 }
    );
  }
}

async function streamToString(stream: NodeJS.ReadableStream | null) {
  if (!stream) return "";
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf-8");
}