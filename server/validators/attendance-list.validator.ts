import { Prisma } from "@/generated/prisma";
import { z } from "zod";

export type AttendanceListType = Prisma.AttendanceListGetPayload<{
  include: {
    entries: true;
    eos: true;
    supervisor: true;
  };
}>;

export const AttendanceListSearchSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  search: z.string().min(1).max(50).optional(),
});

const AttendanceListBaseSchema = z.object({
  eosId: z.number(),
  supervisorId: z.number(),
  month: z.number(),
  year: z.number(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  status: z.enum(["DRAFT", "FINALIZED"]),
});

export const CreateAttendanceListSchema = AttendanceListBaseSchema;
export const UpdateAttendanceListSchema = AttendanceListBaseSchema.partial();

export type CreateAttendanceListDTO = z.infer<
  typeof CreateAttendanceListSchema
>;
export type UpdateAttendanceListDTO = z.infer<
  typeof UpdateAttendanceListSchema
>;
