import { apiRequest } from "./http-client";
import type { CreateTicketRequest, Ticket, TicketStatus, UpdateTicketRequest, UserRole } from "./types";

type TicketRequestOptions = {
  signal?: AbortSignal;
  token?: string | null;
};

export async function getTickets(options: TicketRequestOptions = {}): Promise<Ticket[]> {
  return apiRequest<Ticket[]>("/tickets", {
    signal: options.signal,
    token: options.token,
  });
}

export async function getTicketsByRole(options: TicketRequestOptions = {}, category: UserRole): Promise<Ticket[]> {
  return apiRequest<Ticket[]>(`/tickets/roles/${category}`, {
    signal: options.signal,
    token: options.token,
  });
}

export function getTicket(id: string | number, options: TicketRequestOptions = {}) {
  return apiRequest<Ticket>(`/tickets/${id}`, {
    signal: options.signal,
    token: options.token,
  });
}

export function getTicketsByUserId(userId: number, options: TicketRequestOptions = {}) {
  return apiRequest<Ticket[]>(`/tickets/users/${userId}`, {
    method: "GET",
    signal: options.signal,
    token: options.token,
  });
}

export async function createTicket(payload: CreateTicketRequest, options: TicketRequestOptions = {}) {
  return apiRequest<Ticket>("/tickets", {
    body: payload,
    method: "POST",
    signal: options.signal,
    token: options.token,
  });
}

export function updateTicket(id: string | number, payload: UpdateTicketRequest, options: TicketRequestOptions = {}) {
  return apiRequest<Ticket>(`/tickets/${id}`, {
    body: payload,
    method: "PATCH",
    signal: options.signal,
    token: options.token,
  });
}

export function updateTicketStatus(id: string | number, status: TicketStatus, options: TicketRequestOptions = {}) {
  return apiRequest<Ticket>(`/tickets/status/${id}`, {
    body: { status },
    method: "PATCH",
    signal: options.signal,
    token: options.token,
  });
}

export function deleteTicket(id: string | number, options: TicketRequestOptions = {}) {
  return apiRequest<unknown>(`/tickets/${id}`, {
    method: "DELETE",
    signal: options.signal,
    token: options.token,
  });
}
