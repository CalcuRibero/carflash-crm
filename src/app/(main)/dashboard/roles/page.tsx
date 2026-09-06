import { PageHeader } from "@/components/ui/page-header";
import { WorkRolesPage } from "@/features/work-roles/components/work-roles-page";
import { UserCheck } from "lucide-react";

export default function Page() {
  return (
    <main className="p-6">
      <PageHeader 
        icon={ UserCheck }
        category="Roles"
        title="Gestión de Roles"
      />
    <WorkRolesPage />
    </main>
  );
}
