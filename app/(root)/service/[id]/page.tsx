import PageHeader from "@/components/root/PageHeader";
import { ServiceService } from "@/server/services/service.service";

export default async function ServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const service = await ServiceService.getById(Number(id));

  return (
    <main className="bg-card w-full md:rounded-2xl lg:p-6 p-4 min-h-screen border space-y-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-center">
        <PageHeader
          title={`Checklist Daftar Layanan YANMA ${service?.year} - ${service?.month}`}
          subtitle="Checklist Daftar Layanan YANMA"
        />
      </div>

      <div className="grid text-3xl font-semibold place-items-center">
        Work On Progress...
      </div>
    </main>
  );
}
