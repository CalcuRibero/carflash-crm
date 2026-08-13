import { Car } from "../operations/types";

export type InvoiceStatus = "PENDING" | "PAID" | "PARTIALLY_PAID" | "CANCELLED" | "REFUNDED" | string;

export enum PaymentMethod {
  SENA = 'sena',
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  FINANCING = 'financing',
  CAR_SWAP = 'car_swap',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PROMISSORY_NOTE = 'promissory_note', 
}


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

export interface InvoiceCreateRequest {
  invoiceNumber: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  paymentMethod: PaymentMethod;
  customer: InvoiceCustomer;
  car: string;
  carSwapped?: Omit<Car, "id" | "createdAt" | "updatedAt"> ;
  administrationNotes: string;
  paidAt?: Date;
}

export interface InvoiceFilters {
  search?: string;
  status?: InvoiceStatus;
  paymentMethod?: PaymentMethod;
  dateFrom?: string;
  dateTo?: string;
}
