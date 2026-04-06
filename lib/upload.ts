import path from "path";
import crypto from "crypto";
import fs from "fs/promises";
import sharp from "sharp";

export const BASE_DIR = path.join(process.cwd(), "public", "media");

export async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

function isImage(mimeType: string) {
  return mimeType.startsWith("image/");
}

function guessExt(mimeType: string) {
  if (mimeType === "image/png") return ".png";
  if (mimeType === "image/jpeg") return ".jpg";
  if (mimeType === "application/pdf") return ".pdf";
  return "";
}

export async function saveFile({
  baseDir,
  file,
  filename: forcedName,
  mimeType: forcedMime,
}: {
  baseDir: string;
  file: File | Buffer;
  // required when file is Buffer
  filename?: string;
  mimeType?: string;
}) {
  await ensureDir(baseDir);

  const isBuf = Buffer.isBuffer(file);

  let originalName: string;
  let mimeType: string;
  let buffer: Buffer;

  if (isBuf) {
    if (!forcedName || !forcedMime) {
      throw new Error("saveFile(Buffer) requires filename and mimeType");
    }
    originalName = forcedName;
    mimeType = forcedMime;
    buffer = file;
  } else {
    originalName = file.name;
    mimeType = file.type || "application/octet-stream";
    buffer = Buffer.from(await file.arrayBuffer());
  }

  // NOTE: for Buffer uploads, ext must come from forcedName or mimeType
  const ext = path.extname(originalName) || guessExt(mimeType);
  const finalName = `${crypto.randomUUID()}${ext}`;
  const filepath = path.join(baseDir, finalName);

  let finalBuffer = buffer;
  let finalMime = mimeType;

  // 🔹 Compress only images (and only when source isn't PNG you must keep)
  // For QR codes: keep PNG (do NOT convert to jpeg, it can reduce scan reliability).
  const shouldCompress =
    isImage(mimeType) &&
    // keep QR png as-is
    mimeType !== "image/png";

  if (shouldCompress) {
    finalBuffer = await sharp(buffer)
      .rotate()
      .resize({ width: 1920, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();

    finalMime = "image/jpeg";
    // if you compress to jpeg, update extension too
    // (otherwise you'll store .png name but jpeg bytes)
    const jpegName = `${crypto.randomUUID()}.jpg`;
    const jpegPath = path.join(baseDir, jpegName);
    await fs.writeFile(jpegPath, finalBuffer);

    return {
      filename: jpegName,
      filepath: jpegPath,
      mimeType: finalMime,
      size: finalBuffer.length,
    };
  }

  await fs.writeFile(filepath, finalBuffer);

  return {
    filename: finalName,
    filepath,
    mimeType: finalMime,
    size: finalBuffer.length,
  };
}
