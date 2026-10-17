import { useState } from "react";

import type { OperationFormState } from "@/features/operations/types";

import { createInvoiceService } from "../services/invoiceService";

export function useCreateInvoices() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createInvoice = async (data: OperationFormState): Promise<OperationFormState> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await createInvoiceService(data);
      return result;
    } catch (err) {
      setError("Fallo la creacion de Facturas");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createInvoice, isLoading, error };
}
