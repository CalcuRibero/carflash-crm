import type { Ticket, TicketStatus } from "@/lib/api/types";

export type { TicketStatus } from "@/lib/api/types";

export type ColumnId = TicketStatus;

export type Column = {
  id: ColumnId;
  title: string;
};

export type TicketOwnerProfile = {
  name: string;
  tone: string;
};

export type BoardState = Record<ColumnId, Ticket[]>;

export const STATUS_LABELS: Record<string, string> = {
  "open": "Abierto",
  "in_progress": "En Progreso",
  "resolved": "Resuelto",
  "closed": "Cerrado"
};

