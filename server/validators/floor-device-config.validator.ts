import { Prisma } from "@/generated/prisma";
import { z } from "zod";

export type FloorDeviceConfigType = Prisma.FloorDeviceConfigGetPayload<{
  include: {
    device: true;
    floor: true;
  };
}>;

export const FloorDeviceConfigSearchSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  search: z.string().min(1).max(50).optional(),
});

export const FloorDeviceConfigBaseSchema = z.object({
  floorSlug: z.string().min(1),
  deviceSlug: z.string().min(1),
  title: z.string(), // ← allow empty
  description: z.string(), // ← allow empty
});
export const CreateFloorDeviceConfigSchema = FloorDeviceConfigBaseSchema;

export const UpdateFloorDeviceConfigSchema =
  FloorDeviceConfigBaseSchema.partial();

export type CreateFloorDeviceConfigDTO = z.infer<
  typeof CreateFloorDeviceConfigSchema
>;
export type UpdateFloorDeviceConfigDTO = z.infer<
  typeof UpdateFloorDeviceConfigSchema
>;
