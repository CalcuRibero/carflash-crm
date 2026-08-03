"use client";

import * as React from "react";

import { createVehicleService, type CreateVehicleRequest } from "../services/vehiclesService";
import type { VehicleRecord } from "../types";

export function useCreateVehicle() {
  const [isCreating, setIsCreating] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const createVehicle = React.useCallback(async (payload: CreateVehicleRequest): Promise<VehicleRecord | null> => {
    setIsCreating(true);
    setErrorMessage(null);

    try {
      return await createVehicleService(payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No pudimos crear el vehículo.";
      setErrorMessage(message);
      console.error(error);
      return null;
    } finally {
      setIsCreating(false);
    }
  }, []);

  return {
    createVehicle,
    isCreating,
    errorMessage,
  };
}
