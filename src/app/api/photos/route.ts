import { NextResponse } from "next/server";
import { BlobServiceClient } from "@azure/storage-blob";

const isImage = (n: string) => /\.(jpg|jpeg|png|webp|gif)$/i.test(n);

export async function GET() {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = process.env.BLOB_CONTAINER_NAME;
  if (!conn || !containerName) {
    return NextResponse.json({ error: "Missing server config" }, { status: 500 });
  }

  const service = BlobServiceClient.fromConnectionString(conn);
  const container = service.getContainerClient(containerName);

  const photos: { src: string; alt: string }[] = [];

  for await (const b of container.listBlobsFlat({ prefix: "uploads/" })) {
    if (!isImage(b.name)) continue;
    photos.push({
      src: `${container.url}/${b.name}`,
      alt: b.name.split("/").pop()!.replace(/\.[^.]+$/, ""),
    });
  }


  photos.sort((a, b) => (a.src < b.src ? 1 : -1));
  return NextResponse.json({ photos });
}
