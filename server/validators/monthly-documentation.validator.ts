import { Prisma } from "@/generated/prisma";
import { z } from "zod";

export type MonthlyDocumentationType = Prisma.MonthlyDocumentationGetPayload<{
  include: {
    device: true;
    floor: true;
    images: true;
    period: true;
  };
}>;

export const MonthlyDocumentationSearchSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  search: z.string().min(1).max(50).optional(),
});

const MonthlyDocumentationBaseSchema = z.object({
  deviceSlug: z.string(),
  floorSlug: z.string().min(1),
  periodSlug: z.string(),
  createdBy: z.string(),
});

export const CreateMonthlyDocumentationSchema = MonthlyDocumentationBaseSchema;

export const UpdateMonthlyDocumentationSchema =
  MonthlyDocumentationBaseSchema.partial();

export type CreateMonthlyDocumentationDTO = z.infer<
  typeof CreateMonthlyDocumentationSchema
>;
export type UpdateMonthlyDocumentationDTO = z.infer<
  typeof UpdateMonthlyDocumentationSchema
>;
