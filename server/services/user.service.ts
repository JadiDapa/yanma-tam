import { prisma } from "@/lib/prisma";
import { Prisma, UserRole } from "@/generated/prisma";
import type {
  CreateUserDTO,
  UpdateUserDTO,
} from "../validators/user.validator";

export type UserListOptions = {
  page?: number;
  pageSize?: number;
  role?: UserRole;
  search?: string;
  orderBy?: Prisma.UserOrderByWithRelationInput;
};

function userWhere(opts: UserListOptions): Prisma.UserWhereInput {
  const where: Prisma.UserWhereInput = {};

  if (opts.role) where.role = opts.role;

  const q = opts.search?.trim();
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  return where;
}

export const UserService = {
  async list(opts: UserListOptions = {}) {
    const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);
    const page = Math.max(opts.page ?? 1, 1);

    const where = userWhere(opts);
    const orderBy = opts.orderBy ?? { createdAt: "desc" };

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      items,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  },

  async getById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  },

  async getByUsername(username: string) {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    return user;
  },

  async getByRole(role: UserRole) {
    const user = await prisma.user.findMany({
      where: { role },
    });

    return user;
  },

  async create(data: CreateUserDTO) {
    return await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        nip: data.nip,
        role: data.role,
        name: data.name,
      },
    });
  },

  async update(id: number, data: UpdateUserDTO) {
    return prisma.user.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.user.delete({ where: { id } });
  },
};
