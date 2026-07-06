"use client";

import * as React from "react";

import type { CreateTicketRequest, Ticket, UpdateTicketRequest } from "@/lib/api/types";

import { updateTicketService } from "../services/ticketsService";
import type { UpdateTicketController } from "../types";

export function useUpdateTicket(): UpdateTicketController {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [updatedTicket, setUpdatedTicket] = React.useState<Ticket | null>(null);

  const updateTicket = React.useCallback(async (id: string | number, payload: CreateTicketRequest) => {
    setIsUpdating(true);
    setErrorMessage(null);

    try {
      const ticket = await updateTicketService(id, payload);
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
    updateTicket,
    updatedTicket,
  };
}
