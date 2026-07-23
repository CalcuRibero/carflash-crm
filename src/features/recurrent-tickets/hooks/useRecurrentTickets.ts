import { useEffect, useState } from "react";

import type { RecurrentTicket } from "../types";
import { RecurrentTicketsService } from "../services/recurrentTicketsService";

export function useRecurrentTickets() {
  const [tickets, setTickets] = useState<RecurrentTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recurrentTicketsService = new RecurrentTicketsService();

  const loadTickets = async () => {
    try {
      setIsLoading(true);
      const data = await recurrentTicketsService.getRecurrentTickets();
      setTickets(data);
      setError(null);
    } catch (err) {
      setError("Fallo la carga de tickets recurrentes.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  return { tickets, isLoading, error, refetch: loadTickets };
}
