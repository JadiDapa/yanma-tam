import CreatePeriodDialog from "@/components/root/documentation/CreatePeriodDialog";
import DocumentationCard from "@/components/root/documentation/DocumentationCard";
import PageHeader from "@/components/root/PageHeader";
import { DocumentationPeriodService } from "@/server/services/documentation-period.service";

type PageProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
};

export default async function DocumentationPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const search = params.search;
  const year = new Date().getFullYear();

  const documentations = await DocumentationPeriodService.list({
    page,
    search,
    year,
  });

  return (
    <main className="bg-card w-full md:rounded-2xl lg:p-6 p-4 min-h-screen border space-y-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-center">
        <PageHeader
          title={`Dokumentasi YANMA Periode ${year}`}
          subtitle="Semua laporan dikelompokkan per bulan"
        />
        {/* <Link
          href="/documentation/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg  text-sm font-semibold hover:bg-primary active:scale-95 transition-all shadow-sm"
        >
          <Plus />
          Buat Laporan
        </Link> */}
        <CreatePeriodDialog />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {documentations.items.map((documentation) => (
          <DocumentationCard key={documentation.id} period={documentation} />
        ))}
      </div>
    </main>
  );
}
