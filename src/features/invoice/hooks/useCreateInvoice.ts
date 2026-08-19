"use client";

import { useState } from "react";
import { createInvoice } from "../services/invoiceService";
import type { OperationFormState } from "@/features/operations/types";
import type { Invoice } from "../types";

export function useCreateInvoice() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [invoice, setInvoice] = useState<OperationFormState | null>(null);

    const create = async (formData: OperationFormState) => {
        setIsLoading(true);
        setError(null);

        try {
            if(!formData) throw new Error("El formulario no esta correcto")
            const createdInvoice = await createInvoice(formData);
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