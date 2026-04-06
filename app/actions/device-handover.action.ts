"use server";

import { revalidatePath } from "next/cache";
import z from "zod";
import {
  CreateDeviceHandoverSchema,
  UpdateDeviceHandoverSchema,
} from "@/server/validators/device-handover.validator";
import { CreateFloorInspectionSchema } from "@/server/validators/floor-inspection.validator";
import { DeviceHandoverService } from "@/server/services/device-handover.service";

import { UserService } from "@/server/services/user.service";
import { renderHandoverDocx } from "@/lib/generate-handover";

const CreateDeviceHandoverWithFloorsSchema = CreateDeviceHandoverSchema.extend({
  floorInspections: z.array(CreateFloorInspectionSchema),
});

export async function createDeviceHandover(
  input: z.input<typeof CreateDeviceHandoverWithFloorsSchema>,
) {
  const data = CreateDeviceHandoverWithFloorsSchema.parse(input);

  await DeviceHandoverService.create(data);

  revalidatePath("/documentation");
}

export async function updateDeviceHandover(
  userId: number,
  input: z.input<typeof UpdateDeviceHandoverSchema>,
) {
  const data = UpdateDeviceHandoverSchema.parse(input);

  await DeviceHandoverService.update(userId, { ...data });

  revalidatePath("/documentation/" + input.slug);
  revalidatePath("/documentation");
}

export async function generateHandoverDocx(
  handoverId: number,
  deviceSlug: string,
): Promise<{ data: number[]; filename: string } | { error: string }> {
  try {
    // 1. Fetch the handover with all floor inspections
    const deviceHandover =
      await DeviceHandoverService.getByDeviceHandoverAndDevice(
        handoverId,
        deviceSlug,
      );

    if (!deviceHandover) {
      return { error: "Handover tidak ditemukan" };
    }

    if (!deviceHandover.device.handoverTemplate) {
      return { error: "Template belum diupload untuk perangkat ini" };
    }

    // 2. Fetch all supervisors to resolve names from IDs
    const supervisors = await UserService.getByRole("SUPERVISOR");
    const supervisorMap = new Map(supervisors.map((s) => [s.id, s.name]));

    // 3. Build inspections with supervisor names resolved
    const floorInspections = deviceHandover.floorInspections.map(
      (inspection) => ({
        date: inspection.date,
        timeStart: inspection.timeStart,
        timeEnd: inspection.timeEnd,
        supervisorName: supervisorMap.get(inspection.supervisorId) ?? "",
        floor: inspection.floor,
      }),
    );

    // 4. Render the docx
    const buffer = renderHandoverDocx({
      templatePath: deviceHandover.device.handoverTemplate,
      floorInspections,
      month: deviceHandover.handover.month,
      year: deviceHandover.handover.year,
    });

    // 5. Return as a plain number array (Buffer isn't serializable across the
    //    server action boundary — convert to Array and back on the client)
    const filename = `Berita_Acara_${deviceHandover.device.name.replace(/\s+/g, "_")}_${deviceHandover.handover.month}-${deviceHandover.handover.year}.docx`;

    return {
      data: Array.from(buffer),
      filename,
    };
  } catch (err) {
    console.error("[generateHandoverDocx]", err);
    return { error: "Gagal generate dokumen. Cek template dan data." };
  }
}
