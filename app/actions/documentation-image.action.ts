"use server";

import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

export async function uploadDocumentationImage(formData: FormData) {
  const file = formData.get("file") as File;
  const floorSlug = formData.get("floorSlug") as string;
  const deviceSlug = formData.get("deviceSlug") as string;
  const periodSlug = formData.get("periodSlug") as string;

  if (!file || !floorSlug || !deviceSlug || !periodSlug) {
    throw new Error("Missing required fields");
  }

  // ── Save file locally ───────────────────────────────────────────────────
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${randomUUID()}.${ext}`;
  const uploadDir = join(process.cwd(), "uploads", "documentation");

  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, fileName), buffer);

  const fileUrl = `/api/uploads/documentation/${fileName}`;

  // ── Find or create MonthlyDocumentation ────────────────────────────────
  let documentation = await prisma.monthlyDocumentation.findFirst({
    where: {
      floorSlug,
      deviceSlug,
      periodSlug,
    },
  });

  if (!documentation) {
    documentation = await prisma.monthlyDocumentation.create({
      data: {
        floorSlug,
        deviceSlug,
        periodSlug,
      },
    });
  }

  // ── Create DocumentationImage ──────────────────────────────────────────
  await prisma.documentationImage.create({
    data: {
      fileUrl,
      fileName: file.name,
      documentationId: documentation.id,
    },
  });

  revalidatePath(`/documentation`);
}

export async function deleteImage(imageId: string | number) {
  await prisma.documentationImage.delete({
    where: {
      id: imageId,
    },
  });

  revalidatePath(`/documentation`);
}
