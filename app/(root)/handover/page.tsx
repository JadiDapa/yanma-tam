import CreateHandoverDialog from "@/components/root/handover/CreateHandoverDialog";
import HandoverCard from "@/components/root/handover/HandoverCard";
import PageHeader from "@/components/root/PageHeader";
import { HandoverService } from "@/server/services/handover.service";

type PageProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
};

export default async function HandoverPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const search = params.search;
  const year = new Date().getFullYear();

  const handovers = await HandoverService.list({
    page,
    search,
    year,
  });

  return (
    <main className="bg-card w-full md:rounded-2xl lg:p-6 p-4 min-h-screen border space-y-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-center">
        <PageHeader
          title={`Rekapan Absensi Engineer On Site`}
          subtitle="Pelayanan Markas — semua laporan dikelompokkan per bulan"
        />
        {/* <Link
          href="/handover/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg  text-sm font-semibold hover:bg-primary active:scale-95 transition-all shadow-sm"
        >
          <Plus />
          Buat Laporan
        </Link> */}
        <CreateHandoverDialog />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {handovers.items.map((handover) => (
          <HandoverCard key={handover.id} handover={handover} />
        ))}
      </div>
    </main>
  );
}
