import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import type {
  CreateAttendanceEntryDTO,
  UpdateAttendanceEntryDTO,
} from "../validators/attendance-entry.validator";

export type AttendanceEntryListOptions = {
  page?: number;
  pageSize?: number;
  attendanceListId?: number;
  date?: Date;
  checkIn?: string;
  checkOut?: string;
  orderBy?: Prisma.AttendanceEntryOrderByWithRelationInput;
};

function attendanceEntryWhere(
  opts: AttendanceEntryListOptions,
): Prisma.AttendanceEntryWhereInput {
  const and: Prisma.AttendanceEntryWhereInput[] = [];

  if (opts.attendanceListId)
    and.push({ attendanceListId: opts.attendanceListId });
  if (opts.date) and.push({ date: opts.date });
  if (opts.checkIn) and.push({ checkIn: opts.checkIn });
  if (opts.checkOut) and.push({ checkOut: opts.checkOut });

  return and.length ? { AND: and } : {};
}

export const AttendanceEntryService = {
  async list(opts: AttendanceEntryListOptions = {}) {
    const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);
    const page = Math.max(opts.page ?? 1, 1);

    const where = attendanceEntryWhere(opts);
    const orderBy = opts.orderBy ?? { createdAt: "desc" };

    const [items, total] = await Promise.all([
      prisma.attendanceEntry.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.attendanceEntry.count({ where }),
    ]);

    return {
      items,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  },

  async getByAttendanceListId(attendanceListId: number) {
    const attendanceEntry = await prisma.attendanceEntry.findMany({
      where: { attendanceListId },
    });

    return attendanceEntry;
  },

  async getById(id: number) {
    const attendanceEntry = await prisma.attendanceEntry.findUnique({
      where: { id },
    });

    return attendanceEntry;
  },

  async create(data: CreateAttendanceEntryDTO) {
    return await prisma.attendanceEntry.create({
      data: {
        attendanceListId: data.attendanceListId,
        date: data.date,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
      },
    });
  },

  async update(id: number, data: UpdateAttendanceEntryDTO) {
    return prisma.attendanceEntry.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.attendanceEntry.delete({ where: { id } });
  },
};
