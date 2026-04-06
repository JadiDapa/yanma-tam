import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import type {
  CreateDeviceDTO,
  UpdateDeviceDTO,
} from "../validators/device.validator";

export type DeviceListOptions = {
  page?: number;
  pageSize?: number;
  slug?: string;
  name?: string;
  isActive?: boolean;
  order?: number;
  search?: string;
  orderBy?: Prisma.DeviceOrderByWithRelationInput;
};

function deviceWhere(opts: DeviceListOptions): Prisma.DeviceWhereInput {
  const and: Prisma.DeviceWhereInput[] = [];

  if (opts.slug) and.push({ slug: opts.slug });
  if (opts.name) and.push({ name: opts.name });
  if (opts.isActive) and.push({ isActive: opts.isActive });
  if (opts.order) and.push({ order: opts.order });

  return and.length ? { AND: and } : {};
}

export const DeviceService = {
  async list(opts: DeviceListOptions = {}) {
    const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);
    const page = Math.max(opts.page ?? 1, 1);

    const where = deviceWhere(opts);
    const orderBy = opts.orderBy ?? { order: "asc" };

    const [items, total] = await Promise.all([
      prisma.device.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.device.count({ where }),
    ]);

    return {
      items,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  },

  async getById(id: number) {
    const device = await prisma.device.findUnique({
      where: { id },
    });

    return device;
  },

  async getBySlug(slug: string) {
    return prisma.device.findUnique({ where: { slug } });
  },

  async create(data: CreateDeviceDTO) {
    return await prisma.device.create({
      data: {
        name: data.name,
        slug: data.slug,
        order: data.order,
        isActive: data.isActive,
      },
    });
  },

  async update(slug: string, data: UpdateDeviceDTO) {
    return prisma.device.update({ where: { slug }, data });
  },

  async delete(id: number) {
    return prisma.device.delete({ where: { id } });
  },
};
