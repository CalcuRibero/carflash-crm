import { TaskCard } from "@/features/kanban/components/task-card";
import { Ticket } from "@/lib/api/types";
import { CalendarCard } from "./calendar-card";

export function CalendarColumn({ day, tickets }: { day: string; tickets: Ticket[] }) {
    return (
        <div key={day} className="flex min-h-0 flex-col rounded-t-xl border bg-muted/50 transition-colors p-2">
            <div className="flex items-center justify-center gap-3 px-4 pt-4 pb-3">
                <h3 className="font-bold mb-2 text-primary">{day}</h3>
            </div>
            <div className="flex flex-col gap-2">
                {tickets.map((ticket) => (
                    <CalendarCard ticket={ticket} />
                ))}
            </div>
        </div>
    )
}