import type { UserRole } from "@/lib/api";
import { BriefcaseBusiness, ClipboardCheck, Eye, FileText, Folders, LucideIcon, Target } from "lucide-react";

export const TicketCategoryIcons: Record<UserRole, LucideIcon> = {
    'SuperAdmin': Eye,
    'AdministrationAccountant': FileText,
    'ComercialCordinator': Target,
    'CarExpert': ClipboardCheck,
    'Gestor': Folders,
    'CarSeller': BriefcaseBusiness,
    'Marketing': Target,
}

export function parseCategorySlug(slug: string): UserRole {
    const slugParts = slug
        .toLowerCase()
        .replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());

    const finalSlug = slugParts[0].toLocaleUpperCase() + slugParts.slice(1)

    return finalSlug as UserRole

}