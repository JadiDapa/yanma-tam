import ServiceCard from "@/components/root/service/ServiceCard";
import PageHeader from "@/components/root/PageHeader";
import { ServiceService } from "@/server/services/service.service";
import { Plus } from "lucide-react";
import Link from "next/link";

type PageProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
};

export default async function ServicePage({ searchParams }: PageProps) {
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const search = params.search;
  const year = new Date().getFullYear();

  const services = await ServiceService.list({
    page,
    search,
    year,
  });

  return (
    <main className="bg-card w-full md:rounded-2xl lg:p-6 p-4 min-h-screen border space-y-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-center">
        <PageHeader
          title={`Detail Layanan YANMA`}
          subtitle="Rekapitulasi Layanan YANMA"
        />
        <Link
          href="/service/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg  text-sm font-semibold hover:bg-primary active:scale-95 transition-all shadow-sm"
        >
          <Plus />
          Buat Laporan
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {services.items.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </main>
  );
}
