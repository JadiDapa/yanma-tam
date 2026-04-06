import AttendanceDetailForm from "@/components/root/attendance/AttendanceDetailForm";
import { AttendanceListService } from "@/server/services/attendance-list.service";
import { UserService } from "@/server/services/user.service";
import { notFound } from "next/navigation";

export default async function AttendanceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number((await params).id);

  const [attendance, eosList, supervisorList] = await Promise.all([
    AttendanceListService.getById(id),
    UserService.getByRole("EOS"),
    UserService.getByRole("SUPERVISOR"),
  ]);

  if (!attendance) notFound();

  return (
    <main className="bg-card w-full md:rounded-2xl lg:p-6 p-4 min-h-screen border space-y-8">
      <AttendanceDetailForm
        attendance={attendance}
        eosList={eosList}
        supervisorList={supervisorList}
      />
    </main>
  );
}
