// import { initialBoard } from "../../../../features/kanban/components/data";
import { KanbanIcon } from "lucide-react";
import { Kanban } from "../../../../features/kanban/components/kanban";
import { PageHeader } from "@/components/ui/page-header";

export default function Page() {
  return (
    <main className="p-6">
      <PageHeader 
        icon={KanbanIcon}
        category="Tickets Variables"
        title="Gestión de Tickets"
      />
      <Kanban />
    </main>
  );
}
