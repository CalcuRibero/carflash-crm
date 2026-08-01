export type CarStatus = "AVAILABLE" | "SOLD" | "IN_REPAIR" | "PENDING" | string;

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  domain: string;
  vin: string;
  price: number;
  status: CarStatus;
  documentationValidated: boolean;
  peritajeInformUrl: string;
  location: string;
  kilometers: number;
  dateOfEntry: string;
  lastUpdated: string;
}

export type PaymentMethod = "sena" | "permuta" | "contado" | "tarjeta" | "financiacion" | "pagares";

export interface PaymentMethodEntry {
  id: string;
  method: PaymentMethod;
  amount: string;
  observations: string;
  financingMedium: string;
  quotas: string;
  system: "UVA" | "Fija";
  promissoryCount: string;
  promissoryAmount: string;
}

export interface OperationFormState {
  vehicleId: string;
  domain: string;
  seller: string;
  salePrice: string;
  transferCost: string;
  folderCost: string;
  customerName: string;
  document: string;
  address: string;
  phone: string;
  email: string;
  observations: string;
  swapModel: string;
  swapYear: string;
  swapDomain: string;
  swapObservations: string;
  payments: PaymentMethodEntry[];
}
