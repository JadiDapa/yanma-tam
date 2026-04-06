"use server";

import { revalidatePath } from "next/cache";
import z from "zod";
import {
  CreateServiceSchema,
  UpdateServiceSchema,
} from "@/server/validators/service.validator";
import { ServiceService } from "@/server/services/service.service";

export async function createService(
  input: z.input<typeof CreateServiceSchema>,
) {
  const data = CreateServiceSchema.parse(input);

  await ServiceService.create(data);

  revalidatePath("/documentation");
}

export async function updateService(
  userId: number,
  input: z.input<typeof UpdateServiceSchema>,
) {
  const data = UpdateServiceSchema.parse(input);

  await ServiceService.update(userId, { ...data });

  revalidatePath("/documentation");
}
