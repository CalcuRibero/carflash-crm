import { UserRole } from "@/lib/api";
import {
  BriefcaseBusiness,
  CarFront,
  ClipboardCheck,
  FilePlus2,
  FileText,
  Folders,
  Kanban,
  type LucideIcon,
  PencilRuler,
  Repeat,
  Target,
  Users,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
  roles: UserRole[];
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Puestos de Trabajo",
    items: [
      {
        title: "Supervisión de ventas",
        url: "/supervision-panel/car-seller",
        icon: BriefcaseBusiness,
        roles: ["SuperAdmin"]
      },
      {
        title: "Gestión de Gestoría",
        url: "/supervision-panel/gestor",
        icon: Folders,
        roles: ["SuperAdmin"]
      },
      {
        title: "Gestión de Peritajes",
        url: "/supervision-panel/car-expert",
        icon: ClipboardCheck ,
        roles: ["SuperAdmin"]
      },
      {
        title: "Coordinación Comercial",
        url: "/supervision-panel/comercial-cordinator",
        icon: Target,
        roles: ["SuperAdmin"]
      },
      {
        title: "Administración",
        url: "/supervision-panel/administration-accountant",
        icon: FileText,
        roles: ["SuperAdmin"]
      },
      {
        title: "Marketing",
        url: "/supervision-panel/marketing",
        icon: PencilRuler,
        roles: ["SuperAdmin"]
      },
    ]
  },
  {
    id: 2,
    label: "Panel de control",
    items: [
      {
        title: "Tickets Fijos",
        url: "/dashboard/recurrent-tickets",
        icon: Repeat,
        roles: ["SuperAdmin", "AdministrationAccountant", "ComercialCordinator", "CarExpert", "Gestor", "CarSeller", "Marketing"],
      },

      {
        title: "Tickets Variables",
        url: "/dashboard/kanban",
        icon: Kanban,
        roles: ["SuperAdmin", "AdministrationAccountant", "ComercialCordinator", "CarExpert", "Gestor", "CarSeller", "Marketing"],
      },
      {
        title: "Facturación",
        url: "/dashboard/invoice",
        icon: FilePlus2,
        roles: ["SuperAdmin", "AdministrationAccountant"],
      },
      {
        title: "Vehículos",
        url: "/dashboard/vehiculos",
        icon: CarFront,
        roles: ["SuperAdmin", "AdministrationAccountant", "CarExpert", "Gestor", "CarSeller"],
      },
      {
        title: "Usuarios",
        url: "/dashboard/users",
        icon: Users,
        roles: ["SuperAdmin"],
      },
      // {
      //   title: "Roles",
      //   url: "/dashboard/roles",
      //   icon: Lock,
      // },
    ],
  },
];
