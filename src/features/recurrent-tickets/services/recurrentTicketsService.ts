import { apiRequest } from "@/shared/utils/apiClient";
import type { RecurrentTicket } from "../types";

function getClientToken(): string | null {
  if (typeof window === "undefined") return null;
  const name = "accessToken=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
}

export class RecurrentTicketsService {
  
  uri = "/admin/recurring-tickets";

  async getRecurrentTickets(): Promise<RecurrentTicket[]> {
    const token = getClientToken()
    return apiRequest<RecurrentTicket[]>(this.uri, {
      token,
    });
  }
  
  async createRecurrentTicket(
    data: Omit<RecurrentTicket, "id">
  ): Promise<RecurrentTicket> {
    const token = getClientToken();
    return apiRequest<RecurrentTicket>(this.uri, {
      method: "POST",
      token,
      body: data,
    });
  }
  
  async deleteRecurrentTicket(id: string): Promise<void> {
    const token = getClientToken();
    return apiRequest<void>(`${this.uri}/${id}`, {
      method: "DELETE",
      token,
    });
  }  
}

