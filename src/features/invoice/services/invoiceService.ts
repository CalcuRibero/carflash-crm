import { apiRequest } from "@/shared/utils/apiClient";
import type { Invoice, InvoiceFilters } from "../types";

export interface InvoiceListResponse {
  data: Invoice[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getInvoices(filters?: InvoiceFilters): Promise<Invoice[]> {
  const params = new URLSearchParams();
  
  if (filters?.search) params.append("search", filters.search);
  if (filters?.status) params.append("status", filters.status);
  if (filters?.paymentMethod) params.append("paymentMethod", filters.paymentMethod);
  if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom);
  if (filters?.dateTo) params.append("dateTo", filters.dateTo);

  const queryString = params.toString();
  const endpoint = queryString ? `/invoices?${queryString}` : "/invoices";

  try {
    const response = await apiRequest<InvoiceListResponse>(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
}


export async function getInvoiceById(id: string): Promise<Invoice> {
  return apiRequest<Invoice>(`/invoices/${id}`);
}

export async function deleteInvoice(id: string): Promise<void> {
  return apiRequest<void>(`/invoices/${id}`, { method: "DELETE" });
}
