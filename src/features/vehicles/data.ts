import type { VehicleRecord } from "./types";

export const vehicleSeedData: VehicleRecord[] = [
  {
    id: "veh-001",
    brand: "Toyota",
    model: "Corolla Hybrid",
    year: 2023,
    domain: "ABC-123",
    vin: "JT2BG22K2P0000001",
    price: 28900000,
  },
  {
    id: "veh-002",
    brand: "Ford",
    model: "Ranger XLT",
    year: 2022,
    domain: "XYZ-789",
    vin: "1FTNR2EL8NPA000002",
    price: 35990000,
  },
  {
    id: "veh-003",
    brand: "Chevrolet",
    model: "Onix Premier",
    year: 2021,
    domain: "LMN-456",
    vin: "8A1AA08A0MN000003",
    price: 18950000,
  },
];
