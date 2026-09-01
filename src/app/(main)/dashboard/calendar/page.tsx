import { PageHeader } from "@/components/ui/page-header";
import { Calendar } from "@/features/calendar/components/calendar";
import { CalendarIcon } from "lucide-react";

export default function Page() {
    return (
        <main className="p-6 flex flex-col gap-4">
            <PageHeader 
                icon={CalendarIcon}
                category="Tickets Variables"
                title="Gestión de Tickets"
            />
            <Calendar/>
        </main>
    )
}