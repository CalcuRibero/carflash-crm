"use client";

import * as React from "react";

import type { Ticket } from "@/lib/api/types";

import { getTicketsByTicketIdService } from "../services/ticketsService";
import { useCallback, useEffect, useState } from "react";
import { INITIAL_TICKET } from "../types";

export function useTicketsByTicketId(ticketId: string | null) {
  const [ticket, setTicket] = useState<Ticket>(INITIAL_TICKET);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadTickets = useCallback(async (signal?: AbortSignal) => {
    if (!ticketId) {
      setTicket(INITIAL_TICKET);
      setIsLoading(false);
      return [];
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getTicketsByTicketIdService(ticketId, { signal });
      setTicket(response);
      return response;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return [];
      }

      const message = error instanceof Error ? error.message : "We could not load the tickets.";
      setErrorMessage(message);
      throw error;
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, [ticketId]);

  useEffect(() => {
    const controller = new AbortController();

    void loadTickets(controller.signal).catch(() => {
      // Error state is surfaced through errorMessage.
    });

    return () => {
      controller.abort();
    };
  }, [loadTickets]);

  const refetch = React.useCallback(() => loadTickets(), [loadTickets]);

  return {
    errorMessage,
    isLoading,
    refetch,
    ticket,
  };
}
