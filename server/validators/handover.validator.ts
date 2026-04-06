import { Prisma } from "@/generated/prisma";
import { z } from "zod";

export type HandoverType = Prisma.HandoverGetPayload<{
  include: {
    deviceHandover: true;
  };
}>;

export const HandoverSearchSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  search: z.string().min(1).max(50).optional(),
});

const HandoverBaseSchema = z.object({
  month: z.number(),
  year: z.number(),
});

export const CreateHandoverSchema = HandoverBaseSchema;

export const UpdateHandoverSchema = HandoverBaseSchema.partial();

export type CreateHandoverDTO = z.infer<typeof CreateHandoverSchema>;
export type UpdateHandoverDTO = z.infer<typeof UpdateHandoverSchema>;
