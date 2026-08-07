"use client";

import * as React from "react";

import { createInvoice } from "../services/invoiceService";
import type { Invoice, CreateOperationRegistrationDto } from "../types";

export function useCreateInvoice() {
  const [isCreating, setIsCreating] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const createInvoiceMutation = React.useCallback(async (payload: CreateOperationRegistrationDto) => {
    setIsCreating(true);
    setErrorMessage(null);

    try {
      return await createInvoice(payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No pudimos crear la factura.";
      setErrorMessage(message);
      console.error(error);
      return null;
    } finally {
      setIsCreating(false);
    }
  }, []);

  return {
    createInvoice: createInvoiceMutation,
    isCreating,
    errorMessage,
  };
}
