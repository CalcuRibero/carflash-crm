import { ApiError } from "@/lib/api/errors";
import { createTicket, getTickets, updateTicket } from "@/lib/api/tickets";
import type { CreateTicketRequest, Ticket, UpdateTicketRequest } from "@/lib/api/types";

function normalizeTicketsPayload(payload: unknown): Ticket[] {
  if (Array.isArray(payload)) {
    return payload as Ticket[];
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const candidates = [record.data, record.tickets, record.items, record.results];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        return candidate as Ticket[];
      }
    }
  }

  throw new Error("The tickets response is not valid yet.");
}

export async function createTicketService(payload: CreateTicketRequest): Promise<Ticket> {
  try {
    return await createTicket(payload);
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message || "We could not create the ticket.");
    }

    throw new Error("We could not create the ticket.");
  }
}

export async function getTicketsService(options: { signal?: AbortSignal } = {}): Promise<Ticket[]> {
  try {
    const tickets = await getTickets({ signal: options.signal });
    return normalizeTicketsPayload(tickets);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    if (error instanceof ApiError) {
      throw new Error(error.message || "We could not load the tickets.");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("We could not load the tickets.");
  }
}

export async function updateTicketService(id: string | number, payload: UpdateTicketRequest): Promise<Ticket> {
  try {
    return await updateTicket(id, payload);
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message || "We could not update the ticket.");
    }

    throw new Error("We could not update the ticket.");
  }
}
