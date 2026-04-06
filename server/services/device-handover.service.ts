import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import type {
  CreateDeviceHandoverDTO,
  UpdateDeviceHandoverDTO,
} from "../validators/device-handover.validator";
import { HandoverPayload } from "@/app/actions/handover.action";

export type DeviceHandoverListOptions = {
  page?: number;
  pageSize?: number;
  handoverId?: number;
  deviceSlug?: string;
  search?: string;
  orderBy?: Prisma.DeviceHandoverOrderByWithRelationInput;
};

function handoverWhere(
  opts: DeviceHandoverListOptions,
): Prisma.DeviceHandoverWhereInput {
  const and: Prisma.DeviceHandoverWhereInput[] = [];

  if (opts.handoverId) and.push({ handoverId: opts.handoverId });
  if (opts.deviceSlug) and.push({ deviceSlug: opts.deviceSlug });

  return and.length ? { AND: and } : {};
}

export const DeviceHandoverService = {
  async list(opts: DeviceHandoverListOptions = {}) {
    const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);
    const page = Math.max(opts.page ?? 1, 1);

    const where = handoverWhere(opts);
    const orderBy = opts.orderBy ?? { createdAt: "desc" };

    const [items, total] = await Promise.all([
      prisma.deviceHandover.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          _count: {
            select: { floorInspections: true },
          },
        },
      }),
      prisma.deviceHandover.count({ where }),
    ]);

    return {
      items,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  },

  async getAll() {
    return await prisma.deviceHandover.findMany({
      include: {
        floorInspections: {
          include: { floor: true },
        },
      },
    });
  },

  async getById(id: number) {
    const handover = await prisma.deviceHandover.findUnique({
      where: { id },
      include: {
        floorInspections: true,
      },
    });

    return handover;
  },

  async create(data: CreateDeviceHandoverDTO) {
    return await prisma.deviceHandover.create({
      data: {
        handoverId: data.handoverId,
        deviceSlug: data.deviceSlug,
        floorInspections: {
          create: data.floorInspections.map((fi) => ({
            date: new Date(fi.date),
            timeStart: fi.timeStart,
            timeEnd: fi.timeEnd,
            floorId: fi.floorId,
            supervisorId: Number(fi.supervisorId),
          })),
        },
      },
    });
  },

  async getByDeviceHandoverAndDevice(handoverId: number, deviceSlug: string) {
    return await prisma.deviceHandover.findFirst({
      where: {
        handoverId,
        deviceSlug,
      },
      include: {
        floorInspections: {
          include: { floor: true },
        },
        handover: true,
        device: true,
      },
    });
  },

  async update(id: number, data: UpdateDeviceHandoverDTO) {
    return prisma.deviceHandover.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.deviceHandover.delete({ where: { id } });
  },

  async createWithFloors(data: HandoverPayload) {
    return prisma.deviceHandover.create({
      data: {
        handoverId: data.handoverId,
        deviceSlug: data.deviceSlug,
        floorInspections: {
          create: data.floorInspections.map((fi) => ({
            floorId: fi.floorId,
            date: new Date(fi.date),
            timeStart: fi.timeStart,
            timeEnd: fi.timeEnd,
            supervisorId: Number(fi.supervisorId),
          })),
        },
      },
    });
  },

  async upsertWithFloors(id: number, data: HandoverPayload) {
    // Split into existing rows (id > 0) and brand-new rows (id === 0)
    const toUpdate = data.floorInspections.filter((fi) => fi.id > 0);
    const toCreate = data.floorInspections.filter((fi) => fi.id === 0);

    return prisma.deviceHandover.update({
      where: { id },
      data: {
        floorInspections: {
          // Update each existing floor inspection individually
          updateMany: toUpdate.map((fi) => ({
            where: { id: fi.id },
            data: {
              date: new Date(fi.date),
              timeStart: fi.timeStart,
              timeEnd: fi.timeEnd,
              supervisorId: Number(fi.supervisorId),
            },
          })),
          // Create any floor inspections that didn't exist yet
          create: toCreate.map((fi) => ({
            floorId: fi.floorId,
            date: new Date(fi.date),
            timeStart: fi.timeStart,
            timeEnd: fi.timeEnd,
            supervisorId: Number(fi.supervisorId),
          })),
        },
      },
    });
  },
};
