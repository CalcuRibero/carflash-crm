import { apiRequest } from "./http-client";
import type { CreateTicketRequest, Ticket, UpdateTicketRequest } from "./types";

export async function getTickets(options: { signal?: AbortSignal } = {}) {
  const token = await cookieStore.get('accessToken')
  return apiRequest<Ticket[]>("/tickets", {
    signal: options.signal,
    token: `${token?.value}`
  });
}

export function getTicket(id: string | number) {
  return apiRequest<Ticket>(`/tickets/${id}`);
}

export async function createTicket(payload: CreateTicketRequest) {
  const token = await cookieStore.get('accessToken')
  return apiRequest<Ticket>("/tickets", {
    body: payload,
    method: "POST",
    token: `${token?.value}`
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
