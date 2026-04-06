import AttendanceCreateForm from "@/components/root/attendance/AttendanceCreateForm";
import { UserService } from "@/server/services/user.service";

export default async function AttendanceCreatePage() {
  const [eosList, supervisorList] = await Promise.all([
    UserService.getByRole("EOS"),
    UserService.getByRole("SUPERVISOR"),
  ]);

  return (
    <main className="bg-card w-full md:rounded-2xl lg:p-6 p-4 min-h-screen border space-y-8">
      <AttendanceCreateForm eosList={eosList} supervisorList={supervisorList} />
    </main>
  );
}
