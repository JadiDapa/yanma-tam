import PageHeader from "@/components/root/PageHeader";
import CreateUserDialog from "@/components/root/user/CreateUserDialog";
import { UserCard } from "@/components/root/user/UserCard";
import { UserService } from "@/server/services/user.service";
import React from "react";

export default async function UsersPage() {
  const users = await UserService.list();
  return (
    <main className="bg-card w-full md:rounded-2xl lg:p-6 p-4 min-h-screen border space-y-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-center">
        <PageHeader title={`Semua User`} subtitle="Semua user yang terdaftar" />

        <CreateUserDialog />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3  gap-4">
        {users.items.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </main>
  );
}
