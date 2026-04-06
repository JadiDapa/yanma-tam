import { Prisma } from "@/generated/prisma";
import { z } from "zod";

export type DocumentationImageType = Prisma.DocumentationImageGetPayload<{
  include: {
    documentation: true;
  };
}>;

export const DocumentationImageSearchSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  search: z.string().min(1).max(50).optional(),
});

const DocumentationImageBaseSchema = z.object({
  fileUrl: z.string(),
  fileName: z.string().optional(),
  caption: z.string().optional(),
  description: z.string().optional(),
});

export const CreateDocumentationImageSchema =
  DocumentationImageBaseSchema.extend({});

export const UpdateDocumentationImageSchema =
  DocumentationImageBaseSchema.partial();

export type CreateDocumentationImageDTO = z.infer<
  typeof CreateDocumentationImageSchema
>;
export type UpdateDocumentationImageDTO = z.infer<
  typeof UpdateDocumentationImageSchema
>;
