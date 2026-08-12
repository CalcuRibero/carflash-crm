import { UserRole } from "@/lib/api";
import {
  CarFront,
  FilePlus2,
  Kanban,
  type LucideIcon,
  Repeat,
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
    label: "Panel de control",
    items: [
      {
        title: "Tickets Fijos",
        url: "/dashboard/recurrent-tickets",
        icon: Repeat,
        roles: ["SuperAdmin", "AdministrationAccountant", "ComercialCordinator", "CarExpert", "Gestor", "CarSeller"],
      },

      {
        title: "Tickets Variables",
        url: "/dashboard/kanban",
        icon: Kanban,
        roles: ["SuperAdmin", "AdministrationAccountant", "ComercialCordinator", "CarExpert", "Gestor", "CarSeller"],
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
