import { prisma } from "@/lib/prisma";
import { HandoverStatus, Prisma } from "@/generated/prisma";
import type {
  CreateHandoverDTO,
  UpdateHandoverDTO,
} from "../validators/handover.validator";

export type HandoverListOptions = {
  page?: number;
  pageSize?: number;
  month?: number;
  year?: number;
  status?: HandoverStatus;
  search?: string;
  orderBy?: Prisma.HandoverOrderByWithRelationInput;
};

function handoverWhere(opts: HandoverListOptions): Prisma.HandoverWhereInput {
  const and: Prisma.HandoverWhereInput[] = [];

  if (opts.month) and.push({ month: opts.month });
  if (opts.year) and.push({ year: opts.year });
  if (opts.status) and.push({ status: opts.status });

  return and.length ? { AND: and } : {};
}

export const HandoverService = {
  async list(opts: HandoverListOptions = {}) {
    const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);
    const page = Math.max(opts.page ?? 1, 1);

    const where = handoverWhere(opts);
    const orderBy = opts.orderBy ?? { createdAt: "desc" };

    const [items, total] = await Promise.all([
      prisma.handover.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.handover.count({ where }),
    ]);

    return {
      items,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  },

  async getAll() {
    return await prisma.handover.findMany({
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });
  },

  async getById(id: number) {
    const handover = await prisma.handover.findUnique({
      where: { id },
    });

    return handover;
  },

  async getByMonthAndYear(month: number, year: number) {
    return await prisma.handover.findUnique({
      where: { month_year: { month, year } },
    });
  },

  async create(data: CreateHandoverDTO) {
    return await prisma.handover.create({
      data: {
        month: data.month,
        year: data.year,
      },
    });
  },

  async update(id: number, data: UpdateHandoverDTO) {
    return prisma.handover.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.handover.delete({ where: { id } });
  },
};
