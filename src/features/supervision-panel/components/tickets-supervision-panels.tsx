'use client'
import { TicketsModal, useCreateTicketModal } from "@/features/tickets"
import { useTicketsByCategory } from "@/features/tickets/hooks/useTicketsByCategory"
import { UserRole } from "@/lib/api"
import { useAuth } from "@/stores/auth/auth-provider"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { canCreateSupervisionTicket } from "../permissions"
import { TicketColumns } from "./ticket-columns"

export function TicketsSupervisionPanel({category}: {category: UserRole}) {
    const { user, isLoading: isAuthLoading } = useAuth();
    const createTicketModal = useCreateTicketModal();
    const { tickets, isLoading, errorMessage, refetch } = useTicketsByCategory(category)
    const canCreateTicket = canCreateSupervisionTicket(user?.role);

    const handleTicketCreated = async () => {
      await refetch();
    };
    
    if(errorMessage) return (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMessage}
        </div>
    )

    if(isLoading || isAuthLoading) return (
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-border/70 bg-slate-50/70 px-3 py-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Preparando Tickets...
        </div>
    )

    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          {canCreateTicket ? (
            <Button onClick={createTicketModal.openModal}>
              <Plus data-icon="inline-start" />
              Crear ticket
            </Button>
          ) : null}
        </div>
        <TicketColumns tickets={tickets}/>
        <TicketsModal
          {...createTicketModal.modalProps}
          onSubmit={async (values) => {
            await createTicketModal.submitTicket(values);
            await handleTicketCreated();
          }}
        />
      </div>
    )
}