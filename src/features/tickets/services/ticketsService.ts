import { ApiError } from "@/lib/api/errors";
import { createTicket, getTickets } from "@/lib/api/tickets";
import type { CreateTicketRequest, Ticket } from "@/lib/api/types";

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

    if (!Array.isArray(tickets)) {
      throw new Error("The tickets response is not valid yet.");
    }

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
