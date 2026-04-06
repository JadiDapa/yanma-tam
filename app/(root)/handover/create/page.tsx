import { UserService } from "@/server/services/user.service";
import HandoverCreateForm from "@/components/root/handover/HandoverCreateForm";
import { FloorService } from "@/server/services/floor.service";

export default async function AttendanceCreatePage() {
  const [floors, supervisors] = await Promise.all([
    FloorService.list(),
    UserService.getByRole("SUPERVISOR"),
  ]);
  return (
    <main className="bg-card w-full md:rounded-2xl lg:p-6 p-4 min-h-screen border space-y-8">
      <HandoverCreateForm floors={floors.items} supervisors={supervisors} />
    </main>
  );
}
