import { Prisma } from "@/generated/prisma";
import { z } from "zod";

export type FloorType = Prisma.FloorGetPayload<{
  include: {
    documentation: {
      include: {
        images: true;
      };
    };
    officialReports: true;
  };
}>;

export const FloorSearchSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  search: z.string().min(1).max(50).optional(),
});

const FloorBaseSchema = z.object({
  slug: z.string(),
  name: z.string(),
  order: z.number(),
});

export const CreateFloorSchema = FloorBaseSchema;

export const UpdateFloorSchema = FloorBaseSchema.partial();

export type CreateFloorDTO = z.infer<typeof CreateFloorSchema>;
export type UpdateFloorDTO = z.infer<typeof UpdateFloorSchema>;
