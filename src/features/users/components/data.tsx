import { format } from "date-fns";
import type { LucideIcon } from "lucide-react";
import { BriefcaseBusiness, ShieldCheck, SquareUserRound, UserCog, UserRound } from "lucide-react";

import type { User, UserRole } from "@/lib/api/types";

export type UserStatus = "Active" | "Pending invite" | "Deactivated" | "Locked" | "Suspended";

const teamValues = [
  "Platform",
  "Growth",
  "Revenue",
  "Customer Ops",
  "Internal Tools",
  "Compliance",
  "People Ops",
  "Finance",
] as const;

const roleValues = [
  "SuperAdmin",
  "AdministrationAccountant",
  "ComercialCordinator",
  "CarExpert",
  "Gestor",
  "CarSeller",
] as const satisfies readonly UserRole[];

export type UserTeam = (typeof teamValues)[number];

export type UserRow = User & {
  email: string;
  joinedDate: string;
  lastActive: number;
  name: string;
  role: UserRole;
  status: UserStatus;
};

export function mapUserToRow(user: User): UserRow {
  return {
    ...user,
    email: user.username,
    joinedDate: format(new Date(user.createdAt), "dd MMM yyyy, h:mm a"),
    lastActive: 0,
    name: user.fullName,
    role: user.role,
    status: user.isActive ? "Active" : "Deactivated",
  };
}

export const filters = {
  role: ["All", ...roleValues],
  status: ["All", "Active", "Pending invite", "Deactivated", "Locked", "Suspended"],
};

export const roleMeta: Record<UserRole, { className: string; icon: LucideIcon }> = {
  SuperAdmin: { className: "text-emerald-300", icon: SquareUserRound },
  AdministrationAccountant: { className: "text-amber-300", icon: UserCog },
  ComercialCordinator: { className: "text-violet-300", icon: BriefcaseBusiness },
  CarExpert: { className: "text-orange-300", icon: ShieldCheck },
  Gestor: { className: "text-fuchsia-300", icon: UserRound },
  CarSeller: { className: "text-rose-300", icon: UserRound },
};

export const statusMeta: Record<UserStatus, { badgeClass: string; dotClass: string }> = {
  Active: {
    badgeClass: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    dotClass: "bg-emerald-500",
  },
  "Pending invite": {
    badgeClass: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    dotClass: "bg-amber-500",
  },
  Deactivated: {
    badgeClass: "border-border bg-muted/50 text-muted-foreground",
    dotClass: "bg-muted-foreground",
  },
  Locked: {
    badgeClass: "border-destructive/20 bg-destructive/10 text-destructive",
    dotClass: "bg-destructive",
  },
  Suspended: {
    badgeClass: "border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400",
    dotClass: "bg-orange-500",
  },
};
