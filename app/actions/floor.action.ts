"use server";

import { revalidatePath } from "next/cache";
import z from "zod";
import {
  CreateFloorSchema,
  UpdateFloorSchema,
} from "@/server/validators/floor.validator";
import { FloorService } from "@/server/services/floor.service";

export async function createFloor(input: z.input<typeof CreateFloorSchema>) {
  const data = CreateFloorSchema.parse({
    name: input.name,
    slug: input.slug,
    order: input.order,
  });

  await FloorService.create(data);

  revalidatePath("/documentation");
}

export async function updateFloor(
  userId: number,
  input: z.input<typeof UpdateFloorSchema>,
) {
  const data = UpdateFloorSchema.parse(input);

  await FloorService.update(userId, {
    ...data,
  });

  revalidatePath("/documentation/" + input.slug);
  revalidatePath("/documentation");
}
