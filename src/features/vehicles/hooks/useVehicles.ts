"use client";

import * as React from "react";

import { getVehiclesService } from "../services/vehiclesService";
import type { VehicleRecord } from "../types";

export function useVehicles() {
  const [vehicles, setVehicles] = React.useState<VehicleRecord[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const fetchVehicles = React.useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const data = await getVehiclesService({ signal });
      setVehicles(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No pudimos cargar los vehículos.";
      setErrorMessage(message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const controller = new AbortController();
    void fetchVehicles(controller.signal);

    return () => controller.abort();
  }, [fetchVehicles]);

  return {
    vehicles,
    isLoading,
    errorMessage,
    refetch: fetchVehicles,
    setVehicles,
  };
}
