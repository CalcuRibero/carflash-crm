import type { InvoiceCreateRequest } from "./types";
import type { OperationFormState } from "@/features/operations/types";

/**
 * Adapter function that converts OperationFormState to InvoiceCreateRequest
 * Transform the form data used in the UI to the API request format
 */
export function adaptOperationFormToInvoiceRequest(formData: OperationFormState): InvoiceCreateRequest {
  const salePrice = Number.parseFloat(String(formData.salePrice)) || 0;
  const transferCost = Number.parseFloat(String(formData.transferCost)) || 0;
  const folderCost = Number.parseFloat(String(formData.folderCost)) || 0;
  
  const subtotal = Number.parseFloat(String(formData.subtotal)) || salePrice + transferCost + folderCost;
  const taxAmount = Number.parseFloat(String(formData.taxAmount)) || 0;
  const totalAmount = Number.parseFloat(String(formData.totalAmount)) || subtotal + taxAmount;

  return {
    invoiceNumber: formData.invoiceNumber || "",
    subtotal,
    taxAmount,
    totalAmount,
    status: formData.status as any,
    paymentMethod: formData.paymentMethod,
    customer: {
      fullName: formData.customer.fullName,
      document: formData.customer.document,
      address: formData.customer.address,
      phone: formData.customer.phone,
      email: formData.customer.email,
    },
    car:formData.car.id,
    carSwapped: formData.carSwapped
      ? {
          domain: formData.carSwapped.domain,
          brand: formData.carSwapped.brand,
          model: formData.carSwapped.model,
          year: formData.carSwapped.year,
          vin: formData.carSwapped.vin,
          price: formData.carSwapped.price,
        }
      : undefined,
    administrationNotes: formData.administrationNotes || "",
    paidAt: formData.paidAt ? new Date(formData.paidAt) : undefined,
  };
}


export const PAYMENT_METHOD_LABEL = {
  credit_card: "Tarjeta de Crédito",
  debit_card: "Tarjeta de Débito",
  bank_transfer: "Transferencia Bancaria",
  cash: "Contado"
}