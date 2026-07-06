import { useState } from "react";

import { RecurrentTicketsService } from "../services/recurrentTicketsService";

export function useDeleteRecurrentTicket() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recurrentTicketsService = new RecurrentTicketsService();

  const deleteRecurrentTicket = async (id: string): Promise<boolean> => {
    try {
      setIsDeleting(true);
      setError(null);
      await recurrentTicketsService.deleteRecurrentTicket(id);
      return true;
    } catch (err) {
      setError("Failed to delete recurrent ticket");
      console.error(err);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteRecurrentTicket, isDeleting, error };
}
