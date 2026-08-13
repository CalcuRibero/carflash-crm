"use client";

import { useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCars } from "@/features/operations/hooks/useCars";
import type { Car } from "@/features/operations/types";

interface VehicleSelectorProps {
  value: string;
  onValueChange: (vehicle: Car) => void;
}

function formatCarLabel(car: Car) {
  return `${car.brand} ${car.model} ${car.year} · ${car.domain}`;
}

export function VehicleSelector({ value, onValueChange }: VehicleSelectorProps) {
  const { cars, isLoading, error } = useCars();
  const [search, setSearch] = useState("");

  const filteredCars = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return cars;

    if(!cars || cars.length === 0) return [];

    return cars.filter((car) => {
      const haystack = `${car.brand} ${car.model} ${car.year} ${car.domain} ${car.vin}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [cars, search]);

  return (
    <div className="space-y-2">
      {isLoading ? (
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-border/70 bg-slate-50/70 px-3 py-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Cargando vehículos...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <Select value={value} onValueChange={(vehicleId) => {
          const selectedCar = filteredCars.find((car) => car.id === vehicleId);
          if (selectedCar) {
            onValueChange(selectedCar);
          }
        }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona un vehículo" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {filteredCars.length > 0 ? (
                filteredCars.map((car) => (
                  <SelectItem key={car.id} value={car.id ?? ""}>
                    {formatCarLabel(car)}
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-2 text-sm text-muted-foreground">No se encontraron autos.</div>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
