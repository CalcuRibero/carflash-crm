export type InvoiceStatus = "PENDING" | "PAID" | "PARTIALLY_PAID" | "CANCELLED" | "REFUNDED" | string;

export type PaymentMethod = "sena" | "permuta" | "contado" | "tarjeta" | "financiacion" | "pagares";

export interface InvoiceCustomer {
  id?: string;
  fullName: string;
  document: string;
  address: string;
  phone: string;
  email: string;
}

export interface InvoiceCar {
  id?: string;
  domain: string;
  brand?: string;
  model?: string;
  year?: number;
  vin?: string;
  price?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: InvoiceCustomer;
  car: InvoiceCar;
  totalAmount: number;
  status: InvoiceStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  paidAt?: string;
  seller: string;
}

export interface InvoiceFilters {
  search?: string;
  status?: InvoiceStatus;
  paymentMethod?: PaymentMethod;
  dateFrom?: string;
  dateTo?: string;
}

export type PaymentStatus = "PENDING" | "PAID" | "PARTIALLY_PAID" | "CANCELLED" | "REFUNDED" | string;

export class CreateOperationRegistrationDto {
  invoiceNumber!: string;
  subtotal!: number;
  taxAmount!: number;
  totalAmount!: number;
  status!: PaymentStatus;
  paymentMethod!: string;
  customer!: string;
  car!: string;
  carSwapped?: string;
  administrationNotes!: string;
  paidAt!: Date;
}
