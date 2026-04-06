"use server";

import { revalidatePath } from "next/cache";
import z from "zod";
import {
  CreateDeviceSchema,
  UpdateDeviceSchema,
} from "@/server/validators/device.validator";
import { DeviceService } from "@/server/services/device.service";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { FloorService } from "@/server/services/floor.service";
import {
  buildDocumentationData,
  generateDocumentationDocument,
} from "@/lib/generate-documentation";
import { FloorDeviceConfigService } from "@/server/services/floor-device-config.service";

export async function createDevice(input: z.input<typeof CreateDeviceSchema>) {
  const data = CreateDeviceSchema.parse({
    name: input.name,
    slug: input.slug,
    isActive: input.isActive,
    order: input.order,
  });

  await DeviceService.create(data);

  revalidatePath("/documentation");
}

export async function updateDevice(
  userId: number,
  input: z.input<typeof UpdateDeviceSchema>,
) {
  const data = UpdateDeviceSchema.parse(input);

  await DeviceService.update(userId, {
    ...data,
  });

  revalidatePath("/documentation/" + input.slug);
  revalidatePath("/documentation");
}

export async function uploadDeviceTemplate(formData: FormData) {
  const file = formData.get("file") as File;
  const deviceSlug = formData.get("deviceSlug") as string;

  if (!file || !deviceSlug) {
    throw new Error("Missing required fields");
  }

  if (!file.name.endsWith(".docx")) {
    throw new Error("Only .docx files are allowed");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = `${deviceSlug}-template.docx`;
  const uploadDir = join(process.cwd(), "uploads", "templates"); // ← removed public

  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, fileName), buffer);

  const templatePath = `/api/uploads/templates/${fileName}`; // ← api prefix

  await DeviceService.update(deviceSlug, { template: templatePath });

  revalidatePath(`/documentation`);

  return { templatePath };
}

export async function uploadDeviceHandoverTemplate(formData: FormData) {
  const file = formData.get("file") as File;
  const deviceSlug = formData.get("deviceSlug") as string;

  if (!file || !deviceSlug) {
    throw new Error("Missing required fields");
  }

  if (!file.name.endsWith(".docx")) {
    throw new Error("Only .docx files are allowed");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = `${deviceSlug}-handover-template.docx`;
  const uploadDir = join(process.cwd(), "uploads", "templates"); // ← removed public

  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, fileName), buffer);

  const templatePath = `/api/uploads/templates/${fileName}`; // ← api prefix

  await DeviceService.update(deviceSlug, { handoverTemplate: templatePath });

  revalidatePath(`/handover`);

  return { templatePath };
}

export async function generateDocumentationDocx(
  deviceSlug: string,
  periodSlug: string,
  templatePath: string,
) {
  // templatePath is now "/api/uploads/templates/..." — strip the /api prefix
  const relativeTemplate = templatePath
    .replace(/^\/api\//, "") // → "uploads/templates/..."
    .replace(/^\//, "");

  const absoluteTemplatePath = join(process.cwd(), relativeTemplate); // ← no "public"

  const [floors, configs] = await Promise.all([
    FloorService.getFloorDocumentation(deviceSlug, periodSlug),
    FloorDeviceConfigService.getByDevice(deviceSlug),
  ]);

  const data = buildDocumentationData(floors, configs);

  const buffer = await generateDocumentationDocument(
    absoluteTemplatePath,
    data,
    join(process.cwd()), // ← base is now project root, not public
  );

  return {
    base64: buffer.toString("base64"),
    filename: `dokumentasi-${deviceSlug}-${periodSlug}.docx`,
  };
}
