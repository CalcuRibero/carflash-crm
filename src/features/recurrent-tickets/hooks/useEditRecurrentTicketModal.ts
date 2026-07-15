import { useState, useCallback } from "react";

import type { RecurrentTicket } from "../types";
import { RecurrentTicketsService } from "../services/recurrentTicketsService";

export function useEditRecurrentTicketModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editedTicket, setEditedTicket] = useState<RecurrentTicket | null>(null);
  const [currentTicket, setCurrentTicket] = useState<RecurrentTicket | null>(null);

  const recurrentTicketsService = new RecurrentTicketsService();

  const openModal = useCallback((ticket: RecurrentTicket) => {
    setErrorMessage(null);
    setCurrentTicket(ticket);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    if (isSubmitting) return;

    setErrorMessage(null);
    setCurrentTicket(null);
    setIsOpen(false);
  }, [isSubmitting]);

  const submitTicket = useCallback(async (data: Partial<Omit<RecurrentTicket, "id">>) => {
    if (!currentTicket) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const ticket = await recurrentTicketsService.updateRecurrentTicket(currentTicket.id, data);
      setEditedTicket(ticket);
      setIsOpen(false);
      setCurrentTicket(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "We could not update the recurrent ticket.";
      setErrorMessage(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [currentTicket, recurrentTicketsService]);

  const modalProps = {
    isOpen,
    isSubmitting,
    errorMessage,
    onClose: closeModal,
    onSubmit: submitTicket,
    currentTicket,
  };

  return {
    closeModal,
    currentTicket,
    editedTicket,
    errorMessage,
    isOpen,
    isSubmitting,
    modalProps,
    openModal,
    submitTicket,
  };
}
