import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/root/DashboardSidebar";
import DashboardNavbar from "@/components/root/DashboardNavbar";
import { getCurrentUser } from "../actions/user.actions";

type Props = {
  children: ReactNode;
};
export default async function DashboardLayout({ children }: Props) {
  const user = await getCurrentUser();

  return (
    <SidebarProvider>
      <DashboardSidebar user={user} />
      <main className="bg-background flex min-h-screen w-full flex-col gap-2 overflow-hidden py-2 pe-2">
        <DashboardNavbar user={user} />
        {children}
      </main>
    </SidebarProvider>
  );
}
