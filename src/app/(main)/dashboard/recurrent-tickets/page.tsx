"use client";

import { useState } from "react";

import { CreateRecurrentTicketModal, type CreateRecurrentTicketData } from "@/features/recurrent-tickets/components/CreateRecurrentTicketModal";
import { InfoCards } from "@/features/recurrent-tickets/components/InfoCards";
import { RecurrentTicketsTable } from "@/features/recurrent-tickets/components/RecurrentTicketsTable";
import { SearchBar } from "@/features/recurrent-tickets/components/SearchBar";
import { useRecurrentTickets } from "@/features/recurrent-tickets/hooks/useRecurrentTickets";
import { useCreateRecurrentTickets } from "@/features/recurrent-tickets/hooks/useCreateRecurrentTickets";
import { useDeleteRecurrentTicket } from "@/features/recurrent-tickets/hooks/useDeleteRecurrentTicket";
import type { RecurrentTicket } from "@/features/recurrent-tickets/types";
import { TicketPriority, TicketStatus } from "@/features/recurrent-tickets/types";

export default function RecurrentTicketsPage() {
  const { tickets, isLoading, error, refetch } = useRecurrentTickets();
  const { createRecurrentTicket } = useCreateRecurrentTickets();
  const { deleteRecurrentTicket } = useDeleteRecurrentTicket();
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const filteredTickets = tickets.filter((ticket) =>
    ticket.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleEdit = (ticket: RecurrentTicket) => {
    console.log("Edit ticket:", ticket);
    // TODO: Implement edit functionality
  };

  const handleDelete = async (ticketId: string) => {
    const shouldDelete = window.confirm("¿Estás seguro de que deseas eliminar este ticket recurrente?");

    if (!shouldDelete) {
      return;
    }

    const deleted = await deleteRecurrentTicket(ticketId);

    if (deleted) {
      await refetch();
    }
  };

  const handleAddTicket = () => {
    setIsModalOpen(true);
  };

  const handleCreateTicket = async (data: CreateRecurrentTicketData) => {
    const result = await createRecurrentTicket({
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      category: data.category,
      assignedTo: data.assignedTo ?? null,
      dueDate: data.dueDate,
      interval: data.interval,
      first_run_at: data.first_run_at,
    });
    
    if (result) {
      await refetch();
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Cargando Tickets Fijos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Administración de Tickets Fijos
        </h1>
        <p className="text-muted-foreground">
          Gestiona y monitorea tus Tickets Fijos
        </p>
      </div>

      <InfoCards
        totalActive={tickets.length.toString()}
        next24h="0"
        highPriority={tickets.filter((t) => t.priority === TicketPriority.HIGH).length.toString()}
        complianceRate={tickets.length > 0 ? ((tickets.filter((t) => t.status === TicketStatus.RESOLVED).length / tickets.length) * 100).toFixed(2) : "0"}
      />

      <SearchBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onAddTicket={handleAddTicket}
      />

      <RecurrentTicketsTable
        tickets={filteredTickets}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CreateRecurrentTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTicket}
      />
    </div>
  );
}
