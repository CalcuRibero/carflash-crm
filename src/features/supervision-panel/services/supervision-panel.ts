
import { ApiError } from "@/lib/api";
import { getTicketsByRole } from "@/lib/api/tickets";
import { Ticket, UserRole } from "@/lib/api/types";

type TicketRoleResponse = Record<string, Ticket[]>

export async function getTicketsByRoleService(options: { signal?: AbortSignal} = {}, category?: UserRole): Promise<Ticket[]> {
  try {
    if(!category) throw new Error("The category was not found")
    const tickets = await getTicketsByRole({ signal: options.signal }, category);
    return tickets
    // return normalizeTicketsPayload(tickets);
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
