import { NextResponse } from "next/server";
import { BlobServiceClient, BlobSASPermissions } from "@azure/storage-blob";
import crypto from "crypto";

function safe(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 80);
}

export async function POST(req: Request) {
  const { filename, contentType, pin } = await req.json().catch(() => ({}));

  if (process.env.UPLOAD_PIN && pin !== process.env.UPLOAD_PIN) {
    return NextResponse.json({ error: "Fel PIN" }, { status: 401 });
  }

  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING!;
  const containerName = process.env.BLOB_CONTAINER_NAME!;

  const service = BlobServiceClient.fromConnectionString(conn);
  const container = service.getContainerClient(containerName);

  const blobName = `uploads/${Date.now()}-${crypto.randomUUID()}-${safe(String(filename))}`;
  const blob = container.getBlockBlobClient(blobName);

  const uploadUrl = await blob.generateSasUrl({
    permissions: BlobSASPermissions.parse("cw"), // ✅ här är fixen
    expiresOn: new Date(Date.now() + 10 * 60 * 1000),
    contentType: typeof contentType === "string" ? contentType : undefined,
  });

  return NextResponse.json({ uploadUrl, publicUrl: blob.url });
}
