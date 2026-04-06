"use server";

import { revalidatePath } from "next/cache";

import z from "zod";
import {
  CreateDocumentationPeriodSchema,
  UpdateDocumentationPeriodSchema,
} from "@/server/validators/documentation-period.validator";
import { DocumentationPeriodService } from "@/server/services/documentation-period.service";

export async function createDocumentationPeriod(
  input: z.input<typeof CreateDocumentationPeriodSchema>,
) {
  const data = CreateDocumentationPeriodSchema.parse({
    year: input.year,
    month: input.month,
    slug: input.slug,
    status: input.status,
  });

  await DocumentationPeriodService.create(data);

  revalidatePath("/documentation");
}

export async function updateDocumentationPeriod(
  userId: number,
  input: z.input<typeof UpdateDocumentationPeriodSchema>,
) {
  const data = UpdateDocumentationPeriodSchema.parse(input);

  await DocumentationPeriodService.update(userId, {
    ...data,
  });

  revalidatePath("/documentation/" + input.month);
  revalidatePath("/documentation");
}
