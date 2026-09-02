import type { UserRole } from "@/lib/api";

export const SUPERVISION_TICKET_CREATION_ROLES = ["SuperAdmin"] as const satisfies readonly UserRole[];

export function canCreateSupervisionTicket(role: UserRole | null | undefined): boolean {
  return role !== undefined && role !== null && SUPERVISION_TICKET_CREATION_ROLES.includes(role as "SuperAdmin");
}