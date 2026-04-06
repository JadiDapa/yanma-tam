import { prisma } from "@/lib/prisma";
import { DocumentationStatus, Prisma } from "@/generated/prisma";
import type {
  CreateDocumentationPeriodDTO,
  UpdateDocumentationPeriodDTO,
} from "../validators/documentation-period.validator";

export type DocumentationPeriodListOptions = {
  page?: number;
  pageSize?: number;
  year?: number;
  month?: number;
  status?: DocumentationStatus;
  search?: string;
  orderBy?: Prisma.DocumentationPeriodOrderByWithRelationInput;
};

function documentationPeriodWhere(
  opts: DocumentationPeriodListOptions,
): Prisma.DocumentationPeriodWhereInput {
  const and: Prisma.DocumentationPeriodWhereInput[] = [];

  if (opts.year) and.push({ year: opts.year });
  if (opts.month) and.push({ month: opts.month });
  if (opts.status) and.push({ status: opts.status });

  return and.length ? { AND: and } : {};
}

export const DocumentationPeriodService = {
  async list(opts: DocumentationPeriodListOptions = {}) {
    const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);
    const page = Math.max(opts.page ?? 1, 1);

    const where = documentationPeriodWhere(opts);
    const orderBy = opts.orderBy ?? { createdAt: "desc" };

    const [items, total] = await Promise.all([
      prisma.documentationPeriod.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          _count: {
            select: {
              documentations: true,
            },
          },
        },
      }),
      prisma.documentationPeriod.count({ where }),
    ]);

    return {
      items,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  },

  async getById(id: number) {
    const documentationPeriod = await prisma.documentationPeriod.findUnique({
      where: { id },
    });

    return documentationPeriod;
  },

  async getBySlug(slug: string) {
    const documentationPeriod = await prisma.documentationPeriod.findUnique({
      where: { slug },
    });

    return documentationPeriod;
  },

  async create(data: CreateDocumentationPeriodDTO) {
    return await prisma.documentationPeriod.create({
      data: {
        month: data.month,
        year: data.year,
        slug: data.slug,
        status: data.status,
      },
    });
  },

  async update(id: number, data: UpdateDocumentationPeriodDTO) {
    return prisma.documentationPeriod.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.documentationPeriod.delete({ where: { id } });
  },
};
