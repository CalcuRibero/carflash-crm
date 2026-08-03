import { useEffect, useState } from "react";

import { CarsService } from "../services/carsService";
import type { Car } from "../types";

export function useCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carsService = new CarsService();

  const loadCars = async () => {
    try {
      setIsLoading(true);
      const data = await carsService.getCars();
      setCars(data);
      setError(null);
    } catch (err) {
      setError("No se pudieron cargar los autos disponibles.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  return { cars, isLoading, error, refetch: loadCars };
}
