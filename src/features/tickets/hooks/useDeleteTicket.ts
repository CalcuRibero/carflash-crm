"use client";

import * as React from "react";

import { deleteTicketService } from "../services/ticketsService";
import { useCallback, useState } from "react";

export function useDeleteTicket() {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const deleteTicket = useCallback(async (id: string | number, signal?: AbortSignal) => {
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await deleteTicketService(id, { signal });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      const message = error instanceof Error ? error.message : "We could not delete the ticket.";
      setErrorMessage(message);
      throw error;
    } finally {
      if (!signal?.aborted) {
        setIsDeleting(false);
      }
    }
  }, []);

  return {
    deleteTicket,
    errorMessage,
    isDeleting,
  };
}
