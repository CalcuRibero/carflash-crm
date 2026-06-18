export { API_BASE_PATH, API_TOKEN_STORAGE_KEY } from "./config";
export { ApiError } from "./errors";
export { apiRequest, clearApiToken, getApiToken, saveApiToken } from "./http-client";
export { getProfile, login } from "./auth";
export {
  createTicket,
  deleteTicket,
  getTicket,
  getTickets,
  updateTicket,
} from "./tickets";
export type {
  AuthProfile,
  CreateTicketRequest,
  LoginRequest,
  LoginResponse,
  Ticket,
  TicketCategory,
  TicketPriority,
  TicketStatus,
  UpdateTicketRequest,
  User,
  UserRole,
} from "./types";
