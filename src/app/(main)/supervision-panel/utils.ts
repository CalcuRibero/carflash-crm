import { BriefcaseBusiness, ClipboardCheck, FileText, Folders, LucideIcon, Target } from "lucide-react";

export const TicketCategoryIcons: Record<string, LucideIcon> = {
  'AdministrationAccountant': FileText,
  'ComercialCordinator': Target,
  'CarExpert': ClipboardCheck,
  'Gestor': Folders,
  'CarSeller': BriefcaseBusiness,
  'Marketing': Target,
}

export function parseCategorySlug(slug: string) {
    const slugParts = slug
        .toLowerCase()
        .replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());
    
    const finalSlug = slugParts[0].toLocaleUpperCase() + slugParts.slice(0)

    return finalSlug

}