import { Prisma } from "@/generated/prisma";
import { z } from "zod";

export type DeviceType = Prisma.DeviceGetPayload<{
  include: {
    monthlyDocumentations: { include: { images: true } };
  };
}>;

export const DeviceSearchSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  search: z.string().min(1).max(50).optional(),
});

const DeviceBaseSchema = z.object({
  slug: z.string(),
  name: z.string().min(1),
  order: z.number(),
  isActive: z.boolean(),
});

export const CreateDeviceSchema = DeviceBaseSchema;

export const UpdateDeviceSchema = DeviceBaseSchema.partial();

export type CreateDeviceDTO = z.infer<typeof CreateDeviceSchema>;
export type UpdateDeviceDTO = z.infer<typeof UpdateDeviceSchema>;
