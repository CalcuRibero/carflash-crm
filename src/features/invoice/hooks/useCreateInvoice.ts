import { useState } from "react";

import type { Invoice } from "../types";
import { createInvoiceService } from "../services/invoiceService";
import { OperationFormState } from "@/features/operations/types";

export function useCreateInvoices() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const createInvoice = async (
    data: OperationFormState
  ): Promise<OperationFormState | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await createInvoiceService(data);
      return result;
    } catch (err) {
      setError("Fallo la creacion de Facturas");
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createInvoice, isLoading, error };
}
