import { TaskCard } from "@/features/kanban/components/task-card";
import { Ticket } from "@/lib/api/types";
import { TicketColumn } from "./ticket-column";
import { Kanban, Repeat } from "lucide-react";
import { TicketSupervisionCards } from "./ticket-supervision-cards";


export function TicketColumns(props: { tickets: Record<string, Ticket[]> }) {
    const { tickets = {
        variable: [],
        recurrent: []
    } } = props

    // if (!tickets.length) return <p>Tickets not found</p>

    const { variable, recurrent } = tickets
    const roleTickets = [ ...variable, ...recurrent ]

    return (
        <div className="flex flex-col gap-4">
            <div>
                <TicketSupervisionCards tickets={roleTickets}/>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TicketColumn tickets={variable} title="Tickets Variables"/>
                <TicketColumn tickets={recurrent} title="Tickets Fijos" />
            </div>
        </div>
    )
}