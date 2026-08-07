import { useEffect, useState } from "react";

import { SellersService } from "../services/sellersService";
import type { Seller } from "../types";

export function useSellers() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sellersService = new SellersService();

  const loadSellers = async () => {
    try {
      setIsLoading(true);
      const data = await sellersService.getSellers();
      setSellers(data);
      setError(null);
    } catch (err) {
      setError("No se pudieron cargar los vendedores disponibles.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSellers();
  }, []);

  return { sellers, isLoading, error, refetch: loadSellers };
}
