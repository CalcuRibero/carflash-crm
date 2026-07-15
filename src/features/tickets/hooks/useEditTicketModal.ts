"use client";

import * as React from "react";

import type { CreateTicketRequest, Ticket } from "@/lib/api/types";

import { updateTicketService } from "../services/ticketsService";
import type { EditTicketModalController } from "../types";

export function useEditTicketModal(): EditTicketModalController {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [editedTicket, setEditedTicket] = React.useState<Ticket | null>(null);
  const [currentTicket, setCurrentTicket] = React.useState<Ticket | null>(null);

  const openModal = React.useCallback((ticket: Ticket) => {
    setErrorMessage(null);
    setCurrentTicket(ticket);
    setIsOpen(true);
  }, []);

  const closeModal = React.useCallback(() => {
    if (isSubmitting) return;

    setErrorMessage(null);
    setCurrentTicket(null);
    setIsOpen(false);
  }, [isSubmitting]);

  const submitTicket = React.useCallback(async (values: CreateTicketRequest) => {
    if (!currentTicket) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const ticket = await updateTicketService(currentTicket.id, values);
      setEditedTicket(ticket);
      setIsOpen(false);
      setCurrentTicket(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "We could not update the ticket.";
      setErrorMessage(message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [currentTicket]);

  const modalProps = React.useMemo(
    () => ({
      isOpen,
      isSubmitting,
      errorMessage,
      onClose: closeModal,
      onSubmit: submitTicket,
      currentTicket,
    }),
    [closeModal, currentTicket, errorMessage, isOpen, isSubmitting, submitTicket],
  );

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
