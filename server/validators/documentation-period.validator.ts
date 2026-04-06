import { DocumentationStatus, Prisma } from "@/generated/prisma";
import { z } from "zod";

export type DocumentationPeriodType = Prisma.DocumentationPeriodGetPayload<{
  include: {
    documentations: true;
  };
}>;

export const DocumentationPeriodSearchSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  search: z.string().min(1).max(50).optional(),
});

const DocumentationPeriodBaseSchema = z.object({
  month: z.coerce.number().min(1),
  year: z.coerce.number().min(1),
  slug: z.coerce.string().min(1),
  status: z.enum(DocumentationStatus),
});

export const CreateDocumentationPeriodSchema = DocumentationPeriodBaseSchema;

export const UpdateDocumentationPeriodSchema =
  DocumentationPeriodBaseSchema.partial();

export type CreateDocumentationPeriodDTO = z.infer<
  typeof CreateDocumentationPeriodSchema
>;
export type UpdateDocumentationPeriodDTO = z.infer<
  typeof UpdateDocumentationPeriodSchema
>;
