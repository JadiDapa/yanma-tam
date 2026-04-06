import { Prisma, ServiceStatus } from "@/generated/prisma";
import { z } from "zod";

export type ServiceType = Prisma.ServiceGetPayload<{
  include: {
    serviceDevices: true;
  };
}>;

export const ServiceSearchSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().min(1).max(50).optional(),
});

const ServiceBaseSchema = z.object({
  month: z.coerce.number(),
  year: z.coerce.number(),
  date: z.coerce.date(),
  status: z.enum(ServiceStatus),
});

export const CreateServiceSchema = ServiceBaseSchema;

export const UpdateServiceSchema = ServiceBaseSchema.partial();

export type CreateServiceDTO = z.infer<typeof CreateServiceSchema>;
export type UpdateServiceDTO = z.infer<typeof UpdateServiceSchema>;
