"use client";

import * as React from "react";

import type { Ticket } from "@/lib/api/types";

import { getTicketsByUserIdService } from "../services/ticketsService";

export function useTicketsByUserId(userId: number | null) {
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadTickets = React.useCallback(async (signal?: AbortSignal) => {
    if (!userId) {
      setTickets([]);
      setIsLoading(false);
      return [];
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getTicketsByUserIdService(userId, { signal });
      setTickets(response);
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
  }, [userId]);

  React.useEffect(() => {
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
    tickets,
  };
}
