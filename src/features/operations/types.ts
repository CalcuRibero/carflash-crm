import { User } from "@/lib/api/types";

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

export type PaymentStatus = "PENDING" | "PAID" | "PARTIALLY_PAID" | "CANCELLED" | "REFUNDED" | string;

export type PaymentMethod = 'cash' | 'bank_transfer' | 'financing' | 'car_swap' | 'seña' | 'card' | 'payment_note';

export interface Customer {
  id?: string;
  fullName: string;
  document: string;
  address: string;
  phone: string;
  email: string;
}

export interface PaymentMethodEntry {
  method: PaymentMethod;
  amount: number;
  observations: string;
  financingMedium: string;
  quotas: number;
  system: "UVA" | "Fija";
  promissoryCount: number;
  promissoryAmount: number;
}

export interface OperationFormState {
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: PaymentStatus;
  customer: Customer;
  carId: string;
  carSwapped?: Car;
  sellerId: string;
  salePrice: number;
  transferCost: number;
  folderCost: number;
  observations: string;
  swapModel: string;
  swapYear: number;
  swapDomain: string;
  swapObservations: string;
  payments: PaymentMethodEntry[];
  administrationNotes?: string;
  paidAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OperationToPrint {
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: PaymentStatus;
  customer: Customer;
  car: Car;
  carSwapped?: Car;
  seller: User;
  salePrice: number;
  transferCost: number;
  folderCost: number;
  observations: string;
  swapModel: string;
  swapYear: number;
  swapDomain: string;
  swapObservations: string;
  payments: PaymentMethodEntry[];
  administrationNotes?: string;
  paidAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
