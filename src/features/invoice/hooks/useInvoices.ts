"use client";

import { useState, useEffect } from "react";
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
      const data = await getInvoices(currentFilters || filters);
      setInvoices(data);
    } catch (err) {
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
