import { LayoutDashboard } from "lucide-react";

import { TicketBoard, type TicketColumn } from "@/../components/ticket-board";
import { PageHeader } from "@/components/ui/page-header";

export default function Page() {
  return (
    <main className="p-6" data-hide-header="true">
      <PageHeader icon={LayoutDashboard} category="General" title="Dashboard" />
      <TicketBoard />
    </main>
  );
}
