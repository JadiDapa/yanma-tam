import { prisma } from "@/lib/prisma";
import { AttendanceStatus, Prisma } from "@/generated/prisma";
import type {
  CreateAttendanceListDTO,
  UpdateAttendanceListDTO,
} from "../validators/attendance-list.validator";
import { CreateAttendanceEntryDTO } from "../validators/attendance-entry.validator";

export type AttendanceListListOptions = {
  page?: number;
  pageSize?: number;
  eosId?: number;
  supervisorId?: number;
  month?: number;
  year?: number;
  status?: AttendanceStatus;
  orderBy?: Prisma.AttendanceListOrderByWithRelationInput;
};

function AttendanceListWhere(
  opts: AttendanceListListOptions,
): Prisma.AttendanceListWhereInput {
  const and: Prisma.AttendanceListWhereInput[] = [];

  if (opts.eosId) and.push({ eosId: opts.eosId });
  if (opts.supervisorId) and.push({ supervisorId: opts.supervisorId });
  if (opts.month) and.push({ month: opts.month });
  if (opts.year) and.push({ year: opts.year });
  if (opts.status) and.push({ status: opts.status });

  return and.length ? { AND: and } : {};
}

export const AttendanceListService = {
  async list(opts: AttendanceListListOptions = {}) {
    const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);
    const page = Math.max(opts.page ?? 1, 1);

    const where = AttendanceListWhere(opts);
    const orderBy = opts.orderBy ?? { createdAt: "desc" };

    const [items, total] = await Promise.all([
      prisma.attendanceList.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.attendanceList.count({ where }),
    ]);

    return {
      items,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  },

  async getGroupedByMonthYear() {
    return await prisma.attendanceList.findMany({
      include: {
        eos: true,
        supervisor: true,
        entries: { orderBy: { date: "asc" } },
      },
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });
  },

  async getById(id: number) {
    return await prisma.attendanceList.findUnique({
      where: { id },
      include: {
        entries: { orderBy: { date: "asc" } },
        eos: true,
        supervisor: true,
      },
    });
  },

  async create(
    data: CreateAttendanceListDTO & {
      entries: Omit<CreateAttendanceEntryDTO, "attendanceListId">[];
    },
  ) {
    return await prisma.attendanceList.create({
      data: {
        eosId: data.eosId,
        supervisorId: data.supervisorId,
        month: data.month,
        year: data.year,
        startDate: data.startDate, // was missing
        endDate: data.endDate, // was missing
        status: data.status,
        entries: {
          create: data.entries.map((row) => ({
            date: new Date(row.date),
            checkIn: row.checkIn,
            checkOut: row.checkOut,
          })),
        },
      },
    });
  },

  async updateFull(
    id: number,
    data: UpdateAttendanceListDTO & {
      entries: Omit<CreateAttendanceEntryDTO, "attendanceListId">[];
    },
  ) {
    return await prisma.$transaction([
      prisma.attendanceEntry.deleteMany({ where: { attendanceListId: id } }),
      prisma.attendanceList.update({
        where: { id },
        data: {
          eosId: data.eosId,
          supervisorId: data.supervisorId,
          month: data.month,
          year: data.year,
          startDate: data.startDate,
          endDate: data.endDate,
          entries: {
            create: data.entries.map((row) => ({
              date: new Date(row.date),
              checkIn: row.checkIn,
              checkOut: row.checkOut,
            })),
          },
        },
      }),
    ]);
  },
  async delete(id: number) {
    return prisma.attendanceList.delete({ where: { id } });
  },
};
