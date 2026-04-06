import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import type {
  CreateFloorDeviceConfigDTO,
  UpdateFloorDeviceConfigDTO,
} from "../validators/floor-device-config.validator";

export type FloorDeviceConfigListOptions = {
  page?: number;
  pageSize?: number;
  floorSlug?: string;
  deviceSlug?: string;
  title?: string;
  description?: string;
  orderBy?: Prisma.FloorDeviceConfigOrderByWithRelationInput;
};

function floorDeviceConfigWhere(
  opts: FloorDeviceConfigListOptions,
): Prisma.FloorDeviceConfigWhereInput {
  const and: Prisma.FloorDeviceConfigWhereInput[] = [];

  if (opts.floorSlug) and.push({ floorSlug: opts.floorSlug });
  if (opts.deviceSlug) and.push({ deviceSlug: opts.deviceSlug });
  if (opts.title) and.push({ title: opts.title });
  if (opts.description) and.push({ description: opts.description });

  return and.length ? { AND: and } : {};
}

export const FloorDeviceConfigService = {
  async list(opts: FloorDeviceConfigListOptions = {}) {
    const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);
    const page = Math.max(opts.page ?? 1, 1);

    const where = floorDeviceConfigWhere(opts);
    const orderBy = opts.orderBy ?? { order: "asc" };

    const [items, total] = await Promise.all([
      prisma.floorDeviceConfig.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.floorDeviceConfig.count({ where }),
    ]);

    return {
      items,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  },

  async getByDevice(deviceSlug: string) {
    return prisma.floorDeviceConfig.findMany({
      where: { deviceSlug },
    });
  },

  async upsert(data: CreateFloorDeviceConfigDTO) {
    return prisma.floorDeviceConfig.upsert({
      where: {
        floorSlug_deviceSlug: {
          floorSlug: data.floorSlug,
          deviceSlug: data.deviceSlug,
        },
      },
      update: { description: data.description },
      create: { ...data },
    });
  },

  async getById(id: number) {
    const device = await prisma.floorDeviceConfig.findUnique({
      where: { id },
    });

    return device;
  },

  async create(data: CreateFloorDeviceConfigDTO) {
    return await prisma.floorDeviceConfig.create({
      data: {
        floorSlug: data.floorSlug,
        deviceSlug: data.deviceSlug,
        title: data.title,
        description: data.description,
      },
    });
  },

  async update(id: number, data: UpdateFloorDeviceConfigDTO) {
    return prisma.floorDeviceConfig.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.floorDeviceConfig.delete({ where: { id } });
  },
};
