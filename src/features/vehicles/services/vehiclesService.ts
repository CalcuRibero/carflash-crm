import { apiRequest, getApiToken } from "@/shared/utils/apiClient";

import type { VehicleFormValues, VehicleRecord } from "../types";

export type CreateVehicleRequest = VehicleFormValues;
export type UpdateVehicleRequest = Partial<VehicleFormValues>;

function normalizeVehiclePayload(payload: CreateVehicleRequest | UpdateVehicleRequest): VehicleFormValues | UpdateVehicleRequest {
  return {
    ...payload,
    year: Number(payload.year),
    price: Number(payload.price),
  };
}

export async function getVehiclesService(options: { signal?: AbortSignal } = {}): Promise<VehicleRecord[]> {
  const token = getApiToken();

  return apiRequest<VehicleRecord[]>("/cars", {
    signal: options.signal,
    token,
  });
}

export async function createVehicleService(payload: CreateVehicleRequest): Promise<VehicleRecord> {
  const token = getApiToken();

  return apiRequest<VehicleRecord>("/cars", {
    method: "POST",
    body: normalizeVehiclePayload(payload),
    token,
  });
}

export async function updateVehicleService(id: string, payload: UpdateVehicleRequest): Promise<VehicleRecord> {
  const token = getApiToken();

  return apiRequest<VehicleRecord>(`/cars/${id}`, {
    method: "PATCH",
    body: normalizeVehiclePayload(payload),
    token,
  });
}

export async function deleteVehicleService(id: string): Promise<void> {
  const token = getApiToken();

  await apiRequest<void>(`/cars/${id}`, {
    method: "DELETE",
    token,
  });
}
