import { apiRequest } from "@/shared/utils/apiClient";
import type { RecurrentTicket } from "../types";

export class RecurrentTicketsService {
  
  uri = "/admin/recurring-tickets";

  async getRecurrentTickets(): Promise<RecurrentTicket[]> {
    return apiRequest<RecurrentTicket[]>(this.uri);
  }
  
  async createRecurrentTicket(
    data: Omit<RecurrentTicket, "id">
  ): Promise<RecurrentTicket> {
    return apiRequest<RecurrentTicket>(this.uri, {
      method: "POST",
      body: data,
    });
  }
  
  async deleteRecurrentTicket(id: string): Promise<void> {
    return apiRequest<void>(`${this.uri}/${id}`, {
      method: "DELETE",
    });
  }  
}

