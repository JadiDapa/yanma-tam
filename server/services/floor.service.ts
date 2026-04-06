import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import type {
  CreateFloorDTO,
  UpdateFloorDTO,
} from "../validators/floor.validator";

export type FloorListOptions = {
  page?: number;
  pageSize?: number;
  slug?: string;
  name?: string;
  order?: number;
  search?: string;
  orderBy?: Prisma.FloorOrderByWithRelationInput;
};

function floorWhere(opts: FloorListOptions): Prisma.FloorWhereInput {
  const and: Prisma.FloorWhereInput[] = [];

  if (opts.slug) and.push({ slug: opts.slug });
  if (opts.name) and.push({ name: opts.name });
  if (opts.order) and.push({ order: opts.order });

  return and.length ? { AND: and } : {};
}

export const FloorService = {
  async list(opts: FloorListOptions = {}) {
    const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);
    const page = Math.max(opts.page ?? 1, 1);

    const where = floorWhere(opts);
    const orderBy = opts.orderBy ?? { order: "asc" };

    const [items, total] = await Promise.all([
      prisma.floor.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.floor.count({ where }),
    ]);

    return {
      items,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  },

  async getFloorDocumentation(deviceSlug: string, periodSlug: string) {
    const floors = await prisma.floor.findMany({
      orderBy: { order: "asc" },
      include: {
        documentation: {
          where: {
            deviceSlug: deviceSlug,
            periodSlug: periodSlug,
          },
          include: {
            images: {
              orderBy: { createdAt: "asc" },
            },
          },
        },
      },
    });

    return floors;
  },

  async getById(id: number) {
    const floor = await prisma.floor.findUnique({
      where: { id },
    });

    return floor;
  },

  async getBySlug(slug: string) {
    const floor = await prisma.floor.findUnique({
      where: { slug },
    });

    return floor;
  },

  async create(data: CreateFloorDTO) {
    return await prisma.floor.create({
      data: {
        name: data.name,
        slug: data.slug,
        order: data.order,
      },
    });
  },

  async update(id: number, data: UpdateFloorDTO) {
    return prisma.floor.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.floor.delete({ where: { id } });
  },
};
