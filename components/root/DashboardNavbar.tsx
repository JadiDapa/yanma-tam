import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mail, Bell, Search } from "lucide-react";
import Image from "next/image";
import { User } from "@/generated/prisma";
import { ToggleTheme } from "./ToggleTheme";
import Link from "next/link";

export default async function Navbar({ user }: { user: User }) {
  return (
    <header className="border-border hidden w-full items-center justify-between rounded-2xl border bg-card px-6 py-3 md:flex">
      {/* Search */}
      <div className="bg-card flex w-87 items-center gap-3 rounded-full border px-4 py-2">
        <Search />

        <Input
          type="text"
          placeholder="Search task"
          className="border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
        />

        <Badge className="rounded-md bg-gray-200 px-2 py-1 text-gray-600">
          ⌘ F
        </Badge>
      </div>

      {/* Icons + User */}
      <div className="flex items-center gap-3">
        <div className="bg-card rounded-full border p-2">
          <Mail className="size-5 text-foreground" />
        </div>
        <div className="bg-card rounded-full border p-2">
          <Bell className="size-5 text-foreground" />
        </div>
        <ToggleTheme />

        {/* Profile */}
        <div className="flex items-center gap-2">
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4YreOWfDX3kK-QLAbAL4ufCPc84ol2MA8Xg&s" // replace with actual avatar
            width={38}
            height={38}
            alt="avatar"
            className="rounded-full border"
          />

          <Link
            href={`/users/${user.nip}`}
            className="flex flex-col cursor-pointer leading-tight min-w-24"
          >
            <span className="font-medium">{user?.fullName || "User"}</span>
            <span className="text-sm text-gray-500">{user?.role}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
