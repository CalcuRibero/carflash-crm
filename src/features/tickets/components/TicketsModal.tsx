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
import { useEffect, useState } from "react";
// import { useNotificationsTickets } from "@/shared/hooks/useNotifications";


export const INITIAL_TICKETS_MODAL_FORM: TicketsModalFormValues = {
  assignedTo: "",
  category: "support",
  description: "",
  dueDate: "",
  priority: "medium",
  status: "open",
  title: "",
};

function getDateValue(date: Date | string): string {
  const dateValue = typeof date === "string" ? new Date(date) : date;
  return dateValue.toISOString().split("T")[0];
}

function getTimeValue(date: Date | string | null): string {
  if (!date) return "";

  const dateValue = typeof date === "string" ? new Date(date) : date;

  const hours = String(dateValue.getHours()).padStart(2, "0");
  const minutes = String(dateValue.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function withTime(dateValue: string, timeValue: string): string | null {
  if (!dateValue) return null;

  const [hours = "00", minutes = "00"] = timeValue.split(":");
  return `${dateValue}T${hours}:${minutes}`;
}

export function TicketsModal({ currentTicket, errorMessage, isOpen, isSubmitting = false, onClose, onSubmit }: TicketsModalProps) {
  const [formValues, setFormValues] = useState<TicketsModalFormValues>(INITIAL_TICKETS_MODAL_FORM);
  const [dueTime, setDueTime] = useState("00:00");

  const {users} = useUsers();
  // const triggerNotification = useNotificationsTickets

  const isEditMode = !!currentTicket;

  console.log(currentTicket)
  
  useEffect(() => {
    if (currentTicket) {
      setFormValues({
        assignedTo: currentTicket.assignedTo?.id.toString() || "",
        category: currentTicket.category || "support",
        description: currentTicket.description,
        dueDate: currentTicket.dueDate ? getDateValue(currentTicket.dueDate) : "",
        priority: currentTicket.priority,
        status: currentTicket.status,
        title: currentTicket.title,
      });
      setDueTime(getTimeValue(currentTicket.dueDate));
    } else {
      setFormValues(INITIAL_TICKETS_MODAL_FORM);
      setDueTime("00:00");
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
    setDueTime("00:00");
    onClose();
  }

  async function handleSubmit() {
    if (!canSubmit) return;

    try {
      await onSubmit({
        assignedTo: formValues.assignedTo || null,
        category: formValues.category,
        description: formValues.description.trim(),
        dueDate: withTime(formValues.dueDate, dueTime),
        priority: formValues.priority,
        status: formValues.status,
        title: formValues.title.trim(),
      });
      // triggerNotification(
      //   {
      //     assignedTo: formValues.assignedTo, 
      //     type: 'ticket', 
      //     title: formValues.title 
      //   }
      // )
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
        label: isSubmitting ? (isEditMode ? "Actualizando..." : "Creando...") : (isEditMode ? "Actualizar ticket" : "Crear ticket"),
        onClick: handleSubmit,
      }}
      secondaryAction={{
        disabled: isSubmitting,
        label: "Cancelar",
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
                <SelectValue placeholder="Sin asignar" />
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

        <div className="grid gap-1.5">
          <Label htmlFor="ticket-due-time">Horario de vencimiento</Label>
          <Input
            id="ticket-due-time"
            onChange={(event) => setDueTime(event.target.value)}
            type="time"
            value={dueTime}
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
