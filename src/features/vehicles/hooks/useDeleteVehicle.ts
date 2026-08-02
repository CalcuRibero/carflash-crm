"use client";

import * as React from "react";

import { deleteVehicleService } from "../services/vehiclesService";

export function useDeleteVehicle() {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const deleteVehicle = React.useCallback(async (id: string | number): Promise<boolean> => {
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await deleteVehicleService(String(id));
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "No pudimos eliminar el vehículo.";
      setErrorMessage(message);
      console.error(error);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return {
    deleteVehicle,
    isDeleting,
    errorMessage,
  };
}
