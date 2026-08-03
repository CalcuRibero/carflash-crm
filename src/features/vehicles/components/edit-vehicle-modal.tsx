"use client";

import * as React from "react";
import { CarFront, Fuel, Gauge, Palette, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { VehicleFormValues, VehicleRecord } from "../types";

interface EditVehicleModalProps {
  open: boolean;
  vehicle: VehicleRecord | null;
  onOpenChange: (open: boolean) => void;
  onUpdateVehicle: (values: VehicleFormValues) => void;
}

export function EditVehicleModal({ open, vehicle, onOpenChange, onUpdateVehicle }: EditVehicleModalProps) {
  const [formValues, setFormValues] = React.useState<VehicleFormValues | null>(null);

  React.useEffect(() => {
    if (vehicle) {
      setFormValues({
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        domain: vehicle.domain,
        vin: vehicle.vin,
        price: vehicle.price,
      });
    }
  }, [vehicle, open]);

  const updateField = <K extends keyof VehicleFormValues>(field: K, value: VehicleFormValues[K]) => {
    setFormValues((current) => (current ? { ...current, [field]: value } : current));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formValues) {
      return;
    }
    onUpdateVehicle({
      ...formValues,
      year: Number(formValues.year),
      price: Number(formValues.price),
    });
    onOpenChange(false);
  };

  if (!vehicle || !formValues) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar vehículo</DialogTitle>
          <DialogDescription>
            Actualiza la información operativa de {vehicle.domain}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="edit-brand">Marca</Label>
            <Input
              id="edit-brand"
              value={formValues.brand}
              onChange={(event) => updateField("brand", event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-model">Modelo</Label>
            <Input
              id="edit-model"
              value={formValues.model}
              onChange={(event) => updateField("model", event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-year">Año</Label>
            <Input
              id="edit-year"
              type="number"
              min="1900"
              max="2100"
              value={formValues.year || ""}
              onChange={(event) => updateField("year", Number(event.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-domain">Dominio</Label>
            <Input
              id="edit-domain"
              value={formValues.domain}
              onChange={(event) => updateField("domain", event.target.value.toUpperCase())}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-vin">VIN</Label>
            <Input
              id="edit-vin"
              value={formValues.vin}
              onChange={(event) => updateField("vin", event.target.value.toUpperCase())}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-price">Precio</Label>
            <Input
              id="edit-price"
              type="number"
              min="0"
              step="1000"
              value={formValues.price || ""}
              onChange={(event) => updateField("price", Number(event.target.value))}
              required
            />
          </div>

          <DialogFooter className="md:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="gap-2">
              <CarFront className="size-4" />
              Guardar cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
