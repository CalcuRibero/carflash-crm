'use client'
import { useTicketsByCategory } from "@/features/tickets/hooks/useTicketsByCategory"
import { UserRole } from "@/lib/api"
import { Loader2 } from "lucide-react"
import { TicketColumns } from "./ticket-columns"

export function TicketsSupervisionPanel({category}: {category: UserRole}) {

    const { tickets, isLoading, errorMessage } = useTicketsByCategory(category)
    
    if(errorMessage) return (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMessage}
        </div>
    )

    if(isLoading) return (
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-border/70 bg-slate-50/70 px-3 py-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Preparando Tickets...
        </div>
    )

    return(
     <TicketColumns tickets={tickets}/>   
    )
}