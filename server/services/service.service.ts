import { prisma } from "@/lib/prisma";
import { Prisma, ServiceStatus } from "@/generated/prisma";
import type {
  CreateServiceDTO,
  UpdateServiceDTO,
} from "../validators/service.validator";

export type ServiceListOptions = {
  page?: number;
  pageSize?: number;
  month?: number;
  year?: number;
  date?: Date;
  status?: ServiceStatus;
  search?: string;
  orderBy?: Prisma.ServiceOrderByWithRelationInput;
};

function serviceWhere(opts: ServiceListOptions): Prisma.ServiceWhereInput {
  const and: Prisma.ServiceWhereInput[] = [];

  if (opts.month) and.push({ month: opts.month });
  if (opts.year) and.push({ year: opts.year });
  if (opts.date) and.push({ date: opts.date });
  if (opts.status) and.push({ status: opts.status });

  return and.length ? { AND: and } : {};
}

export const ServiceService = {
  async list(opts: ServiceListOptions = {}) {
    const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);
    const page = Math.max(opts.page ?? 1, 1);

    const where = serviceWhere(opts);
    const orderBy = opts.orderBy ?? { createdAt: "desc" };

    const [items, total] = await Promise.all([
      prisma.service.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.service.count({ where }),
    ]);

    return {
      items,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  },

  async getById(id: number) {
    const service = await prisma.service.findUnique({
      where: { id },
    });

    return service;
  },

  async create(data: CreateServiceDTO) {
    return await prisma.service.create({
      data: {
        month: data.month,
        year: data.year,
        date: data.date,
        status: data.status,
      },
    });
  },

  async update(id: number, data: UpdateServiceDTO) {
    return prisma.service.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.service.delete({ where: { id } });
  },
};
