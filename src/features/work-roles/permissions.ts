import type { UserRole } from "@/lib/api";

export function canViewWorkRoles(role: UserRole | null | undefined): boolean {
  return role === "SuperAdmin";
}
