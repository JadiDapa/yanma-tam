import { Prisma } from "@/generated/prisma";
import { z } from "zod";

export type DeviceHandoverType = Prisma.DeviceHandoverGetPayload<{
  include: {
    floorInspections: true;
    device: true;
    handover: true;
  };
}>;

export const DeviceHandoverSearchSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  search: z.string().min(1).max(50).optional(),
});

const DeviceHandoverBaseSchema = z.object({
  handoverId: z.number(),
  deviceSlug: z.string(),
});

export const CreateDeviceHandoverSchema = DeviceHandoverBaseSchema;

export const UpdateDeviceHandoverSchema = DeviceHandoverBaseSchema.partial();

export type CreateDeviceHandoverDTO = z.infer<
  typeof CreateDeviceHandoverSchema
>;
export type UpdateDeviceHandoverDTO = z.infer<
  typeof UpdateDeviceHandoverSchema
>;
