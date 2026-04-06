import { FloorInspectionStatus, Prisma } from "@/generated/prisma";
import { z } from "zod";

export type FloorInspectionType = Prisma.FloorInspectionGetPayload<{
  include: {
    floor: true;
    handover: true;
    inspectionItems: true;
    supervisor: true;
  };
}>;

export const FloorInspectionSearchSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  search: z.string().min(1).max(50).optional(),
});

const FloorInspectionSchema = z.object({
  floorId: z.number(),
  date: z.string().min(1),
  timeStart: z.string().min(1),
  timeEnd: z.string().min(1),
  supervisorId: z.coerce.number(), // ← was z.number()
});

export const CreateFloorInspectionSchema = FloorInspectionSchema;

export const UpdateFloorInspectionSchema = FloorInspectionSchema.partial();

export type CreateFloorInspectionDTO = z.infer<
  typeof CreateFloorInspectionSchema
>;
export type UpdateFloorInspectionDTO = z.infer<
  typeof UpdateFloorInspectionSchema
>;
