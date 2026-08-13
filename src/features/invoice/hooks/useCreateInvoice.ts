"use client";

import { useState } from "react";
import { createInvoice } from "../services/invoiceService";
import { adaptOperationFormToInvoiceRequest } from "../utils";
import type { OperationFormState } from "@/features/operations/types";
import type { Invoice } from "../types";

export function useCreateInvoice() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  const create = async (formData: OperationFormState) => {
    setIsLoading(true);
    setError(null);

    try {
      const request = adaptOperationFormToInvoiceRequest(formData);
      const createdInvoice = await createInvoice(request);
      setInvoice(createdInvoice);
      return createdInvoice;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear factura";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setInvoice(null);
    setError(null);
  };

  return {
    create,
    isLoading,
    error,
    invoice,
    reset,
  };
}
