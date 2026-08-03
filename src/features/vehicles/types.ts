export enum CarStatus {
  PERITAJE = "en_peritaje",
  ALISTAJE = "en_alistaje",
  GESTORIA = "pendiente_gestoria",
  DISPONIBLE = "disponible",
  RESERVADO = "reservado",
  VENDIDO = "vendido",
  ENTREGADO = "entregado",
}

export type VehicleStatus = CarStatus;

export interface VehicleRecord {
  id: string;
  brand: string;
  model: string;
  year: number;
  domain: string;
  vin: string;
  price: number;
  status?: VehicleStatus;
}

export interface VehicleFormValues {
  brand: string;
  model: string;
  year: number;
  domain: string;
  vin: string;
  price: number;
}
