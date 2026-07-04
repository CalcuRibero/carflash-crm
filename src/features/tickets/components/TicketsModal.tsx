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

import type { SelectOption, TicketsModalFormValues, TicketsModalProps } from "../types";
import { useUsers } from "@/features/users/hooks/useUsers";

const STATUS_OPTIONS: SelectOption<TicketsModalFormValues["status"]>[] = [
  { label: "Open", value: "open" },
  { label: "In progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
];

const PRIORITY_OPTIONS: SelectOption<TicketsModalFormValues["priority"]>[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
];

const CATEGORY_OPTIONS: SelectOption<TicketsModalFormValues["category"]>[] = [
  { label: "Bug", value: "bug" },
  { label: "Feature", value: "feature" },
  { label: "Support", value: "support" },
  { label: "Incident", value: "incident" },
];

export const INITIAL_TICKETS_MODAL_FORM: TicketsModalFormValues = {
  assignedTo: "",
  category: "support",
  description: "",
  dueDate: "",
  priority: "medium",
  status: "open",
  title: "",
};

export function TicketsModal({ errorMessage, isOpen, isSubmitting = false, onClose, onSubmit }: TicketsModalProps) {
  const [formValues, setFormValues] = React.useState<TicketsModalFormValues>(INITIAL_TICKETS_MODAL_FORM);

  const {users} = useUsers();

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
    } catch {
      return;
    }

    setFormValues(INITIAL_TICKETS_MODAL_FORM);
  }

  return (
    <Modal
      description="Create a ticket and send it to the right queue."
      isOpen={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) resetAndClose();
      }}
      primaryAction={{
        disabled: !canSubmit || isSubmitting,
        label: isSubmitting ? "Creating..." : "Create ticket",
        onClick: handleSubmit,
      }}
      secondaryAction={{
        disabled: isSubmitting,
        label: "Cancel",
        onClick: resetAndClose,
      }}
      title="New ticket"
    >
      <form
        className="grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
      >
        <div className="grid gap-1.5">
          <Label htmlFor="ticket-title">Title</Label>
          <Input
            id="ticket-title"
            onChange={(event) => updateForm("title", event.target.value)}
            placeholder="Short ticket title"
            value={formValues.title}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="ticket-description">Description</Label>
          <Textarea
            id="ticket-description"
            onChange={(event) => updateForm("description", event.target.value)}
            placeholder="What needs attention?"
            value={formValues.description}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label>Status</Label>
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
            <Label>Priority</Label>
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
            <Label>Category</Label>
            <Select
              value={formValues.category}
              onValueChange={(value) => updateForm("category", value as TicketCategory)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
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
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.fullName ||user.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="ticket-due-date">Due date</Label>
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
