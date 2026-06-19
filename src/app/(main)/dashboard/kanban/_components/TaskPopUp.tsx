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
import { users } from "@/data/users";
import type { TicketCategory, TicketPriority, TicketStatus } from "@/lib/api/types";
import { useCreateTicket } from "@/UseCases/TicketsUseCases";

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



  return (
    <form
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="grid gap-1.5">
        <Label htmlFor="task-title">Title</Label>
        <Input
          id="task-title"
          value={formValues.title}
          onChange={(event) => updateForm("title", event.target.value)}
          placeholder="Write a task title"
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="task-description">Description</Label>
        <Textarea
          id="task-description"
          value={formValues.description}
          onChange={(event) => updateForm("description", event.target.value)}
          placeholder="Describe the task"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label>Status</Label>
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
          <Label>Priority</Label>
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
          <Label>Category</Label>
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
          <Label>Assigned to</Label>
          <Select value={formValues.assignedTo} onValueChange={(value) => updateForm("assignedTo", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Unassigned" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="task-due-date">Due date</Label>
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
  title: "Add task",
  description: "Create a new task for the board.",
  primaryLabel: "Create task",
  secondaryLabel: "Cancel",
});

export function TaskPopUp({ isOpen, onClose, onSubmit }: TaskPopUpProps) {
  const [formValues, setFormValues] = React.useState<TaskPopUpFormValues>(INITIAL_VALUES_FORM);
  const createTicket = useCreateTicket()

  function handleSubmit() {
    if (!formValues.title.trim() || !formValues.description.trim()) return;

    createTicket.mutate(formValues)
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

