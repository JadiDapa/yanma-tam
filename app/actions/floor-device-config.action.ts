"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { CreateFloorDeviceConfigSchema } from "@/server/validators/floor-device-config.validator";
import { FloorDeviceConfigService } from "@/server/services/floor-device-config.service";

export async function upsertFloorDeviceConfig(
  input: z.input<typeof CreateFloorDeviceConfigSchema>,
) {
  const data = CreateFloorDeviceConfigSchema.parse(input);
  await FloorDeviceConfigService.upsert(data);
  revalidatePath(`/documentation`);
}
