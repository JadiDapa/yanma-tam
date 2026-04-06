import AttendanceDetailForm from "@/components/root/attendance/AttendanceDetailForm";
import ExportExcelButton from "@/components/root/attendance/ExportExcelButton";
import PageHeader from "@/components/root/PageHeader";
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

  console.log(attendance);

  return (
    <main className="bg-card w-full md:rounded-2xl lg:p-6 p-4 min-h-screen border space-y-8">
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <PageHeader
            title="Detail Absensi Engineer On Site"
            subtitle={`Periode ${attendance.month}/${attendance.year} — ${attendance.status}`}
          />
          <ExportExcelButton
            attendanceId={attendance.id}
            fileName={`absen_eos_${attendance.month}_${attendance.year}`}
          />
        </div>
        <AttendanceDetailForm
          attendance={attendance}
          eosList={eosList}
          supervisorList={supervisorList}
        />
      </div>
    </main>
  );
}
