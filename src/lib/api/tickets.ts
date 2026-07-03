import { apiRequest } from "./http-client";
import type { CreateTicketRequest, Ticket, UpdateTicketRequest } from "./types";

export async function getTickets(options: { signal?: AbortSignal, token?: string }): Promise<Ticket[]> {
  return apiRequest<Ticket[]>("/tickets", {
    signal: options.signal,
    token: options.token,
  });
}

export function getTicket(id: string | number) {
  return apiRequest<Ticket>(`/tickets/${id}`);
}

export async function createTicket(payload: CreateTicketRequest) {
  return apiRequest<Ticket>("/tickets", {
    body: payload,
    method: "POST",
  });
}

export function updateTicket(id: string | number, payload: UpdateTicketRequest) {
  return apiRequest<Ticket>(`/tickets/${id}`, {
    body: payload,
    method: "PATCH",
  });
}

export function deleteTicket(id: string | number) {
  return apiRequest<unknown>(`/tickets/${id}`, {
    method: "DELETE",
  });
}
