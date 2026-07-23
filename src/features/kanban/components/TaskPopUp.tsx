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
import { withPopup } from "@/components/popup/popup";
import type { TicketCategory, TicketPriority, TicketStatus } from "@/lib/api/types";
import { useCreateTicket } from "@/UseCases/TicketsUseCases";
import { useUsers } from "@/features/users/hooks/useUsers";

const ticketStatuses: TicketStatus[] = ["open", "in_progress", "resolved", "closed"];
const ticketPriorities: TicketPriority[] = ["low", "medium", "high", "critical"];
const ticketCategories: TicketCategory[] = ["bug", "feature", "support", "incident"];


export type TaskPopUpFormValues = {
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  assignedTo: string;
  dueDate: string;
};

export const INITIAL_VALUES_FORM: TaskPopUpFormValues = {
  title: "",
  description: "",
  status: "open",
  priority: "medium",
  category: "support",
  assignedTo: "",
  dueDate: "",
};

type TaskFormProps = {
  formValues: TaskPopUpFormValues;
  onFormChange: (values: TaskPopUpFormValues) => void;
  onSubmit: () => void;
};

type TaskPopUpProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: TaskPopUpFormValues) => void;
};

function formatOptionLabel(value: string) {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function TaskForm({ formValues, onFormChange, onSubmit }: TaskFormProps) {
  function updateForm<Key extends keyof TaskPopUpFormValues>(key: Key, value: TaskPopUpFormValues[Key]) {
    onFormChange({
      ...formValues,
      [key]: value,
    });
  }

  const { users } = useUsers();

  return (
    <form
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="grid gap-1.5">
        <Label htmlFor="task-title">Título</Label>
        <Input
          id="task-title"
          value={formValues.title}
          onChange={(event) => updateForm("title", event.target.value)}
          placeholder="Escribe un título para la tarea"
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="task-description">Descripción</Label>
        <Textarea
          id="task-description"
          value={formValues.description}
          onChange={(event) => updateForm("description", event.target.value)}
          placeholder="Describe la tarea"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label>Estado</Label>
          <Select value={formValues.status} onValueChange={(value) => updateForm("status", value as TicketStatus)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ticketStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {formatOptionLabel(status)}
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
              {ticketPriorities.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {formatOptionLabel(priority)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label>Categoría</Label>
          <Select
            value={formValues.category}
            onValueChange={(value) => updateForm("category", value as TicketCategory)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ticketCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {formatOptionLabel(category)}
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
                  {user.fullName || user.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="task-due-date">Fecha de vencimiento</Label>
        <Input
          id="task-due-date"
          type="date"
          value={formValues.dueDate}
          onChange={(event) => updateForm("dueDate", event.target.value)}
        />
      </div>
    </form>
  );
}

const TaskFormPopUp = withPopup(TaskForm, {
  title: "Agregar Tarea",
  description: "Crear una nueva tarea para el tablero.",
  primaryLabel: "Crear tarea",
  secondaryLabel: "Cancelar",
});

export function TaskPopUp({ isOpen, onClose, onSubmit }: TaskPopUpProps) {
  const [formValues, setFormValues] = React.useState<TaskPopUpFormValues>(INITIAL_VALUES_FORM);
  const createTicket = useCreateTicket()

  function handleSubmit() {
    if (!formValues.title.trim() || !formValues.description.trim()) return;

    // createTicket.mutate(formValues)
    onSubmit(formValues);
    setFormValues(INITIAL_VALUES_FORM);
    onClose();
  }

  function handleClose() {
    setFormValues(INITIAL_VALUES_FORM);
    onClose();
  }

  return (
    <TaskFormPopUp
      isOpen={isOpen}
      formValues={formValues}
      onFormChange={setFormValues}
      onSubmit={handleSubmit}
      primaryButton={handleSubmit}
      secondaryButton={handleClose}
    />
  );
}

