import { TaskCard } from "@/features/kanban/components/task-card";
import { Ticket } from "@/lib/api/types";
export function TicketColumn({tickets, title}:{tickets: Ticket[], title: string}) {
    return (
        <div className="bg-transparent flex flex-col gap-4">
            <div className="text-xl flex justify-center items-baseline">
                <h3 className="text-primary">{title}</h3>
            </div>
            <div className="flex flex-col gap-4">

                {tickets.map((ticket: Ticket, idx: number) =>
                    <TaskCard key={idx} task={ticket} />
                )
                }
            </div>
        </div>
    )
}