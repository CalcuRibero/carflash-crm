"use client";

import { useEffect, useState } from "react";

import { getInvoices } from "../services/invoiceService";
import type { Invoice, InvoiceFilters } from "../types";

export function useInvoices(initialFilters?: InvoiceFilters) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<InvoiceFilters>(initialFilters || {});

  const fetchInvoices = async (currentFilters?: InvoiceFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching invoices with filters:", currentFilters || filters);
      const data = await getInvoices(currentFilters || filters);
      console.log("Received invoices:", data);
      console.log("Number of invoices:", data.length);
      setInvoices(data);
    } catch (err) {
      console.error("Error in fetchInvoices:", err);
      setError(err instanceof Error ? err.message : "Error al cargar facturas");
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const updateFilters = (newFilters: Partial<InvoiceFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchInvoices(updatedFilters);
  };

  const refetch = () => fetchInvoices(filters);

  return {
    invoices,
    isLoading,
    error,
    filters,
    updateFilters,
    refetch,
  };
}
