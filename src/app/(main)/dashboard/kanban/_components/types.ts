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
