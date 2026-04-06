"use server";

import { revalidatePath } from "next/cache";
import z from "zod";
import {
  CreateHandoverSchema,
  UpdateHandoverSchema,
} from "@/server/validators/handover.validator";
import { HandoverService } from "@/server/services/handover.service";
import { DeviceHandoverService } from "@/server/services/device-handover.service";

export interface HandoverPayload {
  handoverId: number;
  deviceSlug: string;
  floorInspections: {
    id: number; // 0 = new
    floorId: number;
    date: string;
    timeStart: string;
    timeEnd: string;
    supervisorId: string;
  }[];
}

export async function saveHandover(
  existingId: number | null,
  payload: HandoverPayload,
) {
  if (existingId) {
    await DeviceHandoverService.upsertWithFloors(existingId, payload);
  } else {
    await DeviceHandoverService.createWithFloors(payload);
  }
  revalidatePath("/deviceHandover");
}

export async function createHandover(
  input: z.input<typeof CreateHandoverSchema>,
) {
  const data = CreateHandoverSchema.parse(input);

  await HandoverService.create(data);

  revalidatePath("/documentation");
}

export async function updateHandover(
  userId: number,
  input: z.input<typeof UpdateHandoverSchema>,
) {
  const data = UpdateHandoverSchema.parse(input);

  await HandoverService.update(userId, { ...data });

  revalidatePath("/documentation");
}
