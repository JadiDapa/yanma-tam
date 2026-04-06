import { Prisma, UserRole } from "@/generated/prisma";
import { z } from "zod";

export type UserType = Prisma.UserGetPayload<{
  include: {
    attendanceLists: true;
  };
}>;

export const UserSearchSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  search: z.string().min(1).max(50).optional(),
});

const UserBaseSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  role: z.enum(UserRole),
  nip: z.string(),
  email: z.string(),
});

export const CreateUserSchema = UserBaseSchema;

export const UpdateUserSchema = UserBaseSchema.partial();

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
