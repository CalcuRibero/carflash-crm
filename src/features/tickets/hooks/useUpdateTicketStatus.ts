"use client";

import * as React from "react";

import type { CreateTicketRequest, Ticket, TicketStatus, UpdateTicketRequest } from "@/lib/api/types";

import { updateTicketService, updateTicketStatusService } from "../services/ticketsService";
import type {  UpdateTicketStatusController } from "../types";
import { updateTicket } from "@/lib/api/tickets";

export function useUpdateTicketStatus(): UpdateTicketStatusController {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [updatedTicket, setUpdatedTicket] = React.useState<Ticket | null>(null);

  const updateTicketStatus = React.useCallback(async (id: string | number, status: TicketStatus) => {
    setIsUpdating(true);
    setErrorMessage(null);

    try {
      const ticket = await updateTicketStatusService(id, status );
      setUpdatedTicket(ticket);
      return ticket;
    } catch (error) {
      const message = error instanceof Error ? error.message : "We could not update the ticket.";
      setErrorMessage(message);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return {
    errorMessage,
    isUpdating,
    updateTicketStatus,
    updatedTicket,
  };
}
