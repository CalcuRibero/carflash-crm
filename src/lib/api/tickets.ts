import { apiRequest } from "./http-client";
import type { CreateTicketRequest, Ticket, UpdateTicketRequest } from "./types";

export function getTickets() {
  return apiRequest<Ticket[]>("/tickets");
}

export function getTicket(id: string | number) {
  return apiRequest<Ticket>(`/tickets/${id}`);
}

export function createTicket(payload: CreateTicketRequest) {
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
