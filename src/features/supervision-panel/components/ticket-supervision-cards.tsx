import { TicketStatus } from "@/features/recurrent-tickets/types";
import { Ticket } from "@/lib/api";
import { InfoCard } from "@/shared/components/InfoCard/info-card";

export function TicketSupervisionCards({ tickets }:{tickets: Ticket[]}) {

    const values = {
        assigned: tickets.filter(ticket => ticket.status === TicketStatus.OPEN).length,
        resolved: tickets.filter(ticket => ticket.status === TicketStatus.CLOSED).length,
        delayed: tickets.filter(
            ticket => 
                (ticket.status === TicketStatus.CLOSED) && 
            (ticket.dueDate ? ticket.dueDate < new Date() : false )
        ).length
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <InfoCard title="Tickets Asignados" value={String(values.assigned)} color="text-yellow-400"/>
            <InfoCard title="Tickets Cumplidos" value={String(values.resolved)}/>
            <InfoCard title="Tickets Vencidos" value={String(values.delayed)} color="text-red-500"/>
        </div>
    
    )
}