"use client";

import { useUsers } from "@/features/users/hooks/useUsers";
import { Users } from "../../../../features/users/components/users";

export default function Page() {
  const { users, refetch } = useUsers();

  return <Users users={users} refreshUsers={refetch} />;
}
