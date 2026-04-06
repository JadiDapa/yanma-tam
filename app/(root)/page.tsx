import PageHeader from "@/components/root/PageHeader";
import { getCurrentUser } from "../actions/user.actions";
import Link from "next/link";
import {
  Home,
  Image,
  CheckCircle,
  ListX,
  CircuitBoard,
  Users,
  ArrowRight,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    description: "Ringkasan aktivitas dan statistik terkini.",
    url: "/",
    icon: Home,
    color: "bg-blue-500/10 text-blue-500",
    border: "hover:border-blue-500/40",
  },
  {
    title: "Rekapan Dokumentasi",
    description: "Kelola dan lihat seluruh dokumentasi yang tersimpan.",
    url: "/documentation",
    icon: Image,
    color: "bg-purple-500/10 text-purple-500",
    border: "hover:border-purple-500/40",
  },
  {
    title: "Rekapan Absensi",
    description: "Pantau data kehadiran dan rekap absensi harian.",
    url: "/attendance",
    icon: CheckCircle,
    color: "bg-green-500/10 text-green-500",
    border: "hover:border-green-500/40",
  },
  {
    title: "Berita Acara",
    description: "Catat dan kelola berita acara serah terima.",
    url: "/handover",
    icon: ListX,
    color: "bg-orange-500/10 text-orange-500",
    border: "hover:border-orange-500/40",
  },
  {
    title: "Lembar Layanan",
    description: "Lihat dan kelola lembar layanan yang berjalan.",
    url: "/service",
    icon: CircuitBoard,
    color: "bg-cyan-500/10 text-cyan-500",
    border: "hover:border-cyan-500/40",
  },
  {
    title: "Daftar Pengguna",
    description: "Kelola akun dan hak akses seluruh pengguna.",
    url: "/users",
    icon: Users,
    color: "bg-rose-500/10 text-rose-500",
    border: "hover:border-rose-500/40",
  },
];

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <main className="bg-card w-full md:rounded-2xl lg:p-6 p-4 min-h-screen border space-y-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-center">
        <PageHeader
          title={`Welcome Back, ${user.name}!`}
          subtitle="Here are your recent services and reports."
        />
      </div>

      {/* MENU GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.url}
              href={item.url}
              className={`group flex flex-col gap-4 p-5 rounded-xl border bg-background transition-all duration-200 hover:shadow-md ${item.border}`}
            >
              {/* Icon + Arrow */}
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-lg ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              </div>

              {/* Text */}
              <div className="space-y-1">
                <h3 className="font-semibold text-sm text-foreground">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
