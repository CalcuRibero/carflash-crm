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
  vehicle: string;
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
