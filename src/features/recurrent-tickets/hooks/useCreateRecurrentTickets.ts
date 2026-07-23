import { useState } from "react";

import type { RecurrentTicket } from "../types";
import { RecurrentTicketsService } from "../services/recurrentTicketsService";

export function useCreateRecurrentTickets() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recurrentTicketsService = new RecurrentTicketsService();

  const createRecurrentTicket = async (
    data: Omit<RecurrentTicket, "id">
  ): Promise<RecurrentTicket | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await recurrentTicketsService.createRecurrentTicket(data);
      return result;
    } catch (err) {
      setError("Fallo la creacion de tickets recurrentes");
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createRecurrentTicket, isLoading, error };
}
