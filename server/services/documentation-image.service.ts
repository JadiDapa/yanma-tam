import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import type {
  CreateDocumentationImageDTO,
  UpdateDocumentationImageDTO,
} from "../validators/documentation-image.validator";

export type DocumentationImageListOptions = {
  page?: number;
  pageSize?: number;
  fileUrl?: string;
  fileName?: string;
  order?: number;
  search?: string;
  orderBy?: Prisma.DocumentationImageOrderByWithRelationInput;
};

export const DocumentationImageService = {
  async getById(id: number) {
    const documentationImage = await prisma.documentationImage.findUnique({
      where: { id },
    });

    return documentationImage;
  },

  async create(data: CreateDocumentationImageDTO) {
    return await prisma.documentationImage.create({
      data: {
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        caption: data.caption,
        description: data.description,
      },
    });
  },

  async update(id: number, data: UpdateDocumentationImageDTO) {
    return prisma.documentationImage.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.documentationImage.delete({ where: { id } });
  },
};
