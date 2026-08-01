import { ApiError } from "@/lib/api/errors";
import { createTicket, deleteTicket, getTicket, getTickets, getTicketsByUserId, updateTicket, updateTicketStatus } from "@/lib/api/tickets";
import type { CreateTicketRequest, Ticket, TicketStatus, UpdateTicketRequest } from "@/lib/api/types";

function normalizeTicketsPayload(payload: Ticket[]): Ticket[] {

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

export async function updateTicketService(id: string | number, payload: CreateTicketRequest): Promise<Ticket> {
  try {
    return await updateTicket(id, payload);
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message || "We could not update the ticket.");
    }

    throw new Error("We could not update the ticket.");
  }
}

export async function updateTicketStatusService(id: string | number, status: TicketStatus): Promise<Ticket> {
  try {
    return await updateTicketStatus(id, status );
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message || "We could not update the ticket.");
    }

    throw new Error("We could not update the ticket.");
  }
}

export async function getTicketsByUserIdService(userId: number, options: { signal?: AbortSignal } = {}): Promise<Ticket[]> {
  try {
    const tickets = await getTicketsByUserId(userId, { signal: options.signal });
    return tickets;
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

export async function getTicketsByTicketIdService(ticketId: string, options: { signal?: AbortSignal } = {}): Promise<Ticket> {
  try {
    const ticket = await getTicket(ticketId, { signal: options.signal });
    return ticket;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    if (error instanceof ApiError) {
      throw new Error(error.message || "We could not load the ticket.");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("We could not load the ticket.");
  }
}

export async function deleteTicketService(id: string | number, options: { signal?: AbortSignal } = {}): Promise<void> {
  try {
    await deleteTicket(id, { signal: options.signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    if (error instanceof ApiError) {
      throw new Error(error.message || "We could not delete the ticket.");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("We could not delete the ticket.");
  }
}