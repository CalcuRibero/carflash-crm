import type { OperationFormState, OperationToPrint } from "@/features/operations/types";
import { apiRequest } from "@/shared/utils/apiClient";

import type { Invoice, InvoiceFilters } from "../types";

export interface InvoiceListResponse {
  data: Invoice[];
  total: number;
  page: number;
  pageSize: number;
}

export type InvoicePrintDetails = OperationToPrint & Pick<Invoice, "id" | "invoiceNumber">;

export async function getInvoices(filters?: InvoiceFilters): Promise<Invoice[]> {
  const params = new URLSearchParams();

  if (filters?.search) params.append("search", filters.search);
  if (filters?.status) params.append("status", filters.status);
  if (filters?.paymentMethod) params.append("paymentMethod", filters.paymentMethod);
  if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom);
  if (filters?.dateTo) params.append("dateTo", filters.dateTo);

  const queryString = params.toString();
  const endpoint = queryString ? `/invoices?${queryString}` : "/invoices";

  console.log("Fetching invoices from:", endpoint);

  try {
    const response = await apiRequest<InvoiceListResponse | Invoice[]>(endpoint);
    console.log("API Response:", response);
    const invoices = Array.isArray(response) ? response : response?.data;

    if (!Array.isArray(invoices)) {
      throw new Error("Formato de respuesta inválido al cargar facturas");
    }

    return invoices;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
}

export async function createInvoiceService(invoice: OperationFormState) {
  return apiRequest<OperationFormState>(`/invoices/`, { method: "POST", body: invoice });
}

export async function getInvoiceById(id: string): Promise<InvoicePrintDetails> {
  return apiRequest<InvoicePrintDetails>(`/invoices/${id}`);
}

export async function deleteInvoice(id: string): Promise<void> {
  return apiRequest<void>(`/invoices/${id}`, { method: "DELETE" });
}
