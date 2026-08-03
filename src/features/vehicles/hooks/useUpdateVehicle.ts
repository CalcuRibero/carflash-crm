"use client";

import * as React from "react";

import { updateVehicleService, type UpdateVehicleRequest } from "../services/vehiclesService";
import type { VehicleRecord } from "../types";

export function useUpdateVehicle() {
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const updateVehicle = React.useCallback(async (id: string, payload: UpdateVehicleRequest): Promise<VehicleRecord | null> => {
    setIsUpdating(true);
    setErrorMessage(null);

    try {
      return await updateVehicleService(id, payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No pudimos actualizar el vehículo.";
      setErrorMessage(message);
      console.error(error);
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return {
    updateVehicle,
    isUpdating,
    errorMessage,
  };
}
