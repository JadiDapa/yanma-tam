import {
  Home,
  Settings,
  ListX,
  CheckCircle,
  Image,
  CircuitBoard,
  Users,
} from "lucide-react";

export const overviewItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Rekapan Dokumentasi",
    url: "/documentation",
    icon: Image,
  },
  {
    title: "Rekapan Absensi",
    url: "/attendance",
    icon: CheckCircle,
  },
  {
    title: "Berita Acara",
    url: "/handover",
    icon: ListX,
  },
  {
    title: "Lembar Layanan",
    url: "/service",
    icon: CircuitBoard,
  },
  {
    title: "Daftar Pengguna",
    url: "/users",
    icon: Users,
  },
];

export const settingsItems = [
  {
    title: "Pengaturan",
    url: "/settings",
    icon: Settings,
  },
];
