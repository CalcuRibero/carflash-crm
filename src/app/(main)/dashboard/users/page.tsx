"use client";

import { useUsers } from "@/features/users/hooks/useUsers";
import { Users } from "../../../../features/users/components/users";

export default function Page() {
  const { users } = useUsers();

  return <Users users={users} />;
}
