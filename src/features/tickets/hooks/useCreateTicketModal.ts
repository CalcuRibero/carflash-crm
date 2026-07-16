"use client";

import * as React from "react";

import type { CreateTicketRequest, Ticket } from "@/lib/api/types";

import { createTicketService } from "../services/ticketsService";
import type { CreateTicketModalController } from "../types";
import { createNotification } from "@/lib/api/notifications";
import { Notification, NotificationType } from "@/lib/api/types";
import { useRouter } from "next/navigation";


export function useCreateTicketModal(): CreateTicketModalController {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [createdTicket, setCreatedTicket] = React.useState<Ticket | null>(null);

  const openModal = React.useCallback(() => {
    setErrorMessage(null);
    setIsOpen(true);
  }, []);

  const closeModal = React.useCallback(() => {
    if (isSubmitting) return;

    setErrorMessage(null);
    setIsOpen(false);
  }, [isSubmitting]);

  const submitTicket = React.useCallback(async (values: CreateTicketRequest) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const ticket = await createTicketService(values);
      setCreatedTicket(ticket);
      
      if(values.assignedTo) {
        const notificationData: Omit<Notification, 'id' | 'createdAt'> = {
          userId: values.assignedTo,
          type: NotificationType.NEW_TICKET,
          message: `Nuevo ticket creado: ${values.title}`,
          meta: {},
          read: false,
        }
        await createNotification(notificationData)
      }
      setIsOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "We could not create the ticket.";
      setErrorMessage(message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const modalProps = React.useMemo(
    () => ({
      isOpen,
      isSubmitting,
      errorMessage,
      onClose: closeModal,
      onSubmit: submitTicket,
    }),
    [closeModal, errorMessage, isOpen, isSubmitting, submitTicket],
  );

  return {
    closeModal,
    createdTicket,
    errorMessage,
    isOpen,
    isSubmitting,
    modalProps,
    openModal,
    submitTicket,
  };
}
