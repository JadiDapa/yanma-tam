import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params; // ← await here
  const filePath = join(process.cwd(), "uploads", ...path);

  if (!existsSync(filePath)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const file = await readFile(filePath);
  const ext = filePath.split(".").pop()?.toLowerCase() ?? "jpg";

  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
  };

  return new NextResponse(file, {
    headers: {
      "Content-Type": mimeTypes[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
