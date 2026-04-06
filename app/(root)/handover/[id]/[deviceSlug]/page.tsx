import GenerateHandover from "@/components/root/handover/device/GenerateHandover";
import UploadHandoverTemplate from "@/components/root/handover/device/UploadHandoverTemplate";
import HandoverDetailForm from "@/components/root/handover/HandoverDetailForm";
import PageHeader from "@/components/root/PageHeader";
import { DeviceHandoverService } from "@/server/services/device-handover.service";
import { DeviceService } from "@/server/services/device.service";
import { FloorService } from "@/server/services/floor.service";
import { UserService } from "@/server/services/user.service";

export default async function HandoverDetailPage({
  params,
}: {
  params: Promise<{ id: string; deviceSlug: string }>;
}) {
  const id = Number((await params).id);
  const deviceSlug = (await params).deviceSlug;

  const [deviceHandover, device, floors, supervisors] = await Promise.all([
    DeviceHandoverService.getByDeviceHandoverAndDevice(id, deviceSlug),
    DeviceService.getBySlug(deviceSlug),
    FloorService.list({}),
    UserService.getByRole("SUPERVISOR"),
  ]);

  const title = deviceHandover
    ? `Berita Acara ${deviceHandover.handover.year} - ${deviceHandover.handover.month} | ${deviceHandover.device.name}`
    : "Buat Berita Acara Baru";

  console.log(deviceHandover);

  return (
    <main className="bg-card w-full md:rounded-2xl lg:p-6 p-4 min-h-screen border space-y-8">
      <div className=" flex justify-between items-center gap-24">
        <PageHeader title={title} subtitle="Device Handover " />
        <div className="flex items-center gap-2">
          <UploadHandoverTemplate
            deviceSlug={deviceSlug}
            currentTemplate={device?.handoverTemplate}
          />
          {device?.handoverTemplate && (
            <GenerateHandover
              deviceSlug={deviceSlug}
              handoverId={id}
              templatePath={device.handoverTemplate} // ← this prop is used for the guard only
            />
          )}
        </div>
      </div>
      <HandoverDetailForm
        deviceHandover={deviceHandover ?? undefined}
        handoverId={id}
        deviceSlug={deviceSlug}
        floors={floors.items}
        supervisors={supervisors}
      />
    </main>
  );
}
