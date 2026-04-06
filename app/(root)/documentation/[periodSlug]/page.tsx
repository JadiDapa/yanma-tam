import DeviceCard from "@/components/root/documentation/device/DeviceCard";
import PageHeader from "@/components/root/PageHeader";
import { DeviceService } from "@/server/services/device.service";
import { DocumentationPeriodService } from "@/server/services/documentation-period.service";

export default async function DocumentationPeriodPage({
  params,
}: {
  params: Promise<{ periodSlug: string }>;
}) {
  const { periodSlug } = await params;
  const period = await DocumentationPeriodService.getBySlug(periodSlug);
  const devices = await DeviceService.list();
  return (
    <main className="bg-card w-full md:rounded-2xl lg:p-6 p-4 min-h-screen border space-y-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-center">
        <PageHeader
          title={`Rekapan Dokumentasi YANMA ${period?.year} - ${period?.month}`}
          subtitle=""
        />
      </div>

      <div className="grid grid-cols-3 w-full gap-6">
        {devices.items.map((device) => (
          <DeviceCard key={device.id} device={device} period={periodSlug} />
        ))}
      </div>
    </main>
  );
}
