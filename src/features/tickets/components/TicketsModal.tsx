"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/shared/components/Modal";

import type { TicketCategory, TicketPriority, TicketStatus } from "@/lib/api/types";

import { PRIORITY_OPTIONS, STATUS_OPTIONS, type SelectOption, type TicketsModalFormValues, type TicketsModalProps } from "../types";
import { useUsers } from "@/features/users/hooks/useUsers";
import { TicketCategoryLabel } from "@/features/recurrent-tickets/types";
import { useNotificationsTickets } from "@/shared/hooks/useNotifications";


export const INITIAL_TICKETS_MODAL_FORM: TicketsModalFormValues = {
  assignedTo: "",
  category: "support",
  description: "",
  dueDate: "",
  priority: "medium",
  status: "open",
  title: "",
};

export function TicketsModal({ currentTicket, errorMessage, isOpen, isSubmitting = false, onClose, onSubmit }: TicketsModalProps) {
  const [formValues, setFormValues] = React.useState<TicketsModalFormValues>(INITIAL_TICKETS_MODAL_FORM);

  const {users} = useUsers();
  const triggerNotification = useNotificationsTickets

  const isEditMode = !!currentTicket;

  React.useEffect(() => {
    if (currentTicket) {
      setFormValues({
        assignedTo: currentTicket.assignedTo?.toString() || "",
        category: currentTicket.category || "support",
        description: currentTicket.description,
        dueDate: currentTicket.dueDate || "",
        priority: currentTicket.priority,
        status: currentTicket.status,
        title: currentTicket.title,
      });
    } else {
      setFormValues(INITIAL_TICKETS_MODAL_FORM);
    }
  }, [currentTicket]);

  const canSubmit = formValues.title.trim().length > 0 && formValues.description.trim().length > 0;

  function updateForm<Key extends keyof TicketsModalFormValues>(key: Key, value: TicketsModalFormValues[Key]) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }));
  }

  function resetAndClose() {
    setFormValues(INITIAL_TICKETS_MODAL_FORM);
    onClose();
  }

  async function handleSubmit() {
    if (!canSubmit) return;

    try {
      await onSubmit({
        assignedTo: formValues.assignedTo || null,
        category: formValues.category,
        description: formValues.description.trim(),
        dueDate: formValues.dueDate || null,
        priority: formValues.priority,
        status: formValues.status,
        title: formValues.title.trim(),
      });
      triggerNotification(
        {
          assignedTo: formValues.assignedTo, 
          type: 'ticket', 
          title: formValues.title 
        }
      )
    } catch {
      return;
    }

    setFormValues(INITIAL_TICKETS_MODAL_FORM);
  }

  return (
    <Modal
      description={isEditMode ? "Editar un ticket existente." : "Crear un ticket y dejarlo en la lista."}
      isOpen={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) resetAndClose();
      }}
      primaryAction={{
        disabled: !canSubmit || isSubmitting,
        label: isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update ticket" : "Create ticket"),
        onClick: handleSubmit,
      }}
      secondaryAction={{
        disabled: isSubmitting,
        label: "Cancel",
        onClick: resetAndClose,
      }}
      title={isEditMode ? "Editar Ticket" : "Crear Nuevo Ticket"}
    >
      <form
        className="grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
      >
        <div className="grid gap-1.5">
          <Label htmlFor="ticket-title">Titulo</Label>
          <Input
            id="ticket-title"
            onChange={(event) => updateForm("title", event.target.value)}
            placeholder="Un titulo corto para el ticket..."
            value={formValues.title}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="ticket-description">Descripcion</Label>
          <Textarea
            id="ticket-description"
            onChange={(event) => updateForm("description", event.target.value)}
            placeholder="Describe tu tarea..."
            value={formValues.description}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label>Estado</Label>
            <Select
              value={formValues.status}
              onValueChange={(value) => updateForm("status", value as TicketStatus)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label>Prioridad</Label>
            <Select
              value={formValues.priority}
              onValueChange={(value) => updateForm("priority", value as TicketPriority)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label>Categoria</Label>
            <Select
              value={formValues.category}
              onValueChange={(value) => updateForm("category", value as TicketCategory)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TicketCategoryLabel).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label>Asignado a</Label>
            <Select value={formValues.assignedTo} onValueChange={(value) => updateForm("assignedTo", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.fullName ||user.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="ticket-due-date">Vecha de vencimiento</Label>
          <Input
            id="ticket-due-date"
            onChange={(event) => updateForm("dueDate", event.target.value)}
            type="date"
            value={formValues.dueDate}
          />
        </div>

        {errorMessage ? (
          <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-destructive text-sm">
            {errorMessage}
          </p>
        ) : null}
      </form>
    </Modal>
  );
}
