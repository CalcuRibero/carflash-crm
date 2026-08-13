import type { User } from "@/lib/api/types";

export type CarStatus = "AVAILABLE" | "SOLD" | "IN_REPAIR" | "PENDING" | string;

export interface Car {
  id: string;
  brand?: string;
  model?: string;
  year?: number;
  domain: string;
  vin?: string;
  price?: number;
  status?: CarStatus;
  documentationValidated?: boolean;
  peritajeInformUrl?: string;
  location?: string;
  kilometers?: number;
  dateOfEntry?: string;
  lastUpdated?: string;
}

export enum PaymentStatus {
    PENDING = 'pending',
    PARTIAL = 'partial_payment',
    PAID = 'paid',
    CANCELLED = 'cancelled',
}

export interface Customer {
  id?: string;
  fullName: string;
  document: string;
  address: string;
  phone: string;
  email: string;
}

export interface PaymentMethodEntry {
  id: string;
  method: PaymentMethod;
  amount: string | number;
  observations: string;
  financingMedium: string;
  quotas: string | number;
  system: "UVA" | "Fija";
  promissoryCount: string | number;
  promissoryAmount: string | number;
}

export interface OperationFormState {
  id?: string;
  invoiceNumber?: string;
  subtotal: string | number;
  taxAmount: string | number;
  totalAmount: string | number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  customer: Customer;
  car: Car;
  carSwapped?: Car;
  seller: User;
  salePrice: string | number;
  transferCost: string | number;
  folderCost: string | number;
  observations: string;
  swapModel: string;
  swapYear: string | number;
  swapDomain: string;
  swapObservations: string;
  payments: PaymentMethodEntry[];
  administrationNotes?: string;
  paidAt?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
