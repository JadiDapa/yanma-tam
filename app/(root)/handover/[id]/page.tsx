import DeviceCard from "@/components/root/handover/device/DeviceCard";
import PageHeader from "@/components/root/PageHeader";
import { DeviceService } from "@/server/services/device.service";
import { HandoverService } from "@/server/services/handover.service";

export default async function DocumentationHandoverPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const handover = await HandoverService.getById(Number(id));
  const devices = await DeviceService.list({});
  return (
    <main className="bg-card w-full md:rounded-2xl lg:p-6 p-4 min-h-screen border space-y-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-center">
        <PageHeader
          title={`Berita Acara Serah Terima YANMA ${handover?.year} - ${handover?.month}`}
          subtitle=""
        />
      </div>
      <div className="grid grid-cols-3 w-full gap-6">
        {devices.items.map((device) => (
          <DeviceCard key={device.id} device={device} handoverId={id} />
        ))}
      </div>
    </main>
  );
}
