import { Prisma } from "@/generated/prisma";
import { z } from "zod";

export type AttendanceEntryType = Prisma.AttendanceEntryGetPayload<{
  include: {
    attendanceList: true;
  };
}>;

export const AttendanceEntrySearchSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  search: z.string().min(1).max(50).optional(),
});

const AttendanceEntryBaseSchema = z.object({
  attendanceListId: z.number(),
  date: z.string(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
});

export const CreateAttendanceEntrySchema = AttendanceEntryBaseSchema;

export const UpdateAttendanceEntrySchema = AttendanceEntryBaseSchema.partial();

export type CreateAttendanceEntryDTO = z.infer<
  typeof CreateAttendanceEntrySchema
>;
export type UpdateAttendanceEntryDTO = z.infer<
  typeof UpdateAttendanceEntrySchema
>;
