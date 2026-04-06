import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import type {
  CreateMonthlyDocumentationDTO,
  UpdateMonthlyDocumentationDTO,
} from "../validators/monthly-documentation.validator";

export type MonthlyDocumentationListOptions = {
  page?: number;
  pageSize?: number;
  deviceSlug?: string;
  floorSlug?: string;
  periodSlug?: string;
  createdBy?: string;
  search?: string;
  orderBy?: Prisma.MonthlyDocumentationOrderByWithRelationInput;
};

function monthlyDocumentationWhere(
  opts: MonthlyDocumentationListOptions,
): Prisma.MonthlyDocumentationWhereInput {
  const and: Prisma.MonthlyDocumentationWhereInput[] = [];

  if (opts.deviceSlug) and.push({ deviceSlug: opts.deviceSlug });
  if (opts.floorSlug) and.push({ floorSlug: opts.floorSlug });
  if (opts.periodSlug) and.push({ periodSlug: opts.periodSlug });
  if (opts.createdBy) and.push({ createdBy: opts.createdBy });

  return and.length ? { AND: and } : {};
}

export const MonthlyDocumentationService = {
  async list(opts: MonthlyDocumentationListOptions = {}) {
    const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);
    const page = Math.max(opts.page ?? 1, 1);

    const where = monthlyDocumentationWhere(opts);
    const orderBy = opts.orderBy ?? { createdAt: "desc" };

    const [items, total] = await Promise.all([
      prisma.monthlyDocumentation.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.monthlyDocumentation.count({ where }),
    ]);

    return {
      items,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  },

  async getById(id: number) {
    const monthlyDocumentation = await prisma.monthlyDocumentation.findUnique({
      where: { id },
    });

    return monthlyDocumentation;
  },

  async create(data: CreateMonthlyDocumentationDTO) {
    return await prisma.monthlyDocumentation.create({
      data: {
        deviceSlug: data.deviceSlug,
        floorSlug: data.floorSlug,
        periodSlug: data.periodSlug,
        createdBy: data.createdBy,
      },
    });
  },

  async update(id: number, data: UpdateMonthlyDocumentationDTO) {
    return prisma.monthlyDocumentation.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.monthlyDocumentation.delete({ where: { id } });
  },
};
