import ServiceCreateForm from "@/components/root/service/ServiceCreateForm";

export default async function ServiceCreatePage() {
  return (
    <main className="bg-card w-full md:rounded-2xl lg:p-6 p-4 min-h-screen border space-y-8">
      <ServiceCreateForm />
    </main>
  );
}
