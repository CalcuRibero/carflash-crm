"use client";

import { Plus, Users as UsersIcon } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { useUsers } from "@/features/users/hooks/useUsers";

import { Users } from "../../../../features/users/components/users";

export default function Page() {
  const { users, refetch } = useUsers();

  return (
    <main className="p-6">
      <PageHeader icon={UsersIcon} category="Usuarios" title="Gestión de Usuarios" />
      <Users users={users} refreshUsers={refetch} />
    </main>
  );
}
