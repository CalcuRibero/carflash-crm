"use client";

import { useUsers } from "@/features/users/hooks/useUsers";
import { Users } from "../../../../features/users/components/users";
import { PageHeader } from "@/components/ui/page-header";
import { Users as UsersIcon, Plus } from "lucide-react";

export default function Page() {
  const { users, refetch } = useUsers();

  return (
    <main className="p-6">
      <PageHeader 
        icon={UsersIcon}
        category="Usuarios"
        title="Gestión de Usuarios"
      />
      <Users users={users} refreshUsers={refetch} />
    </main>
  );
}
