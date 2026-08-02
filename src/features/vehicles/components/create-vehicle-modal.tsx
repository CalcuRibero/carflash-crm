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

import type { VehicleFormValues } from "../types";

interface CreateVehicleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateVehicle: (values: VehicleFormValues) => void;
}

const initialValues: VehicleFormValues = {
  brand: "",
  model: "",
  year: 0,
  domain: "",
  vin: "",
  price: 0,
};

export function CreateVehicleModal({ open, onOpenChange, onCreateVehicle }: CreateVehicleModalProps) {
  const [formValues, setFormValues] = React.useState<VehicleFormValues>(initialValues);

  React.useEffect(() => {
    if (!open) {
      setFormValues(initialValues);
    }
  }, [open]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onCreateVehicle({
      ...formValues,
      year: Number(formValues.year),
      price: Number(formValues.price),
    });
    onOpenChange(false);
    setFormValues(initialValues);
  };

  const updateField = <K extends keyof VehicleFormValues>(field: K, value: VehicleFormValues[K]) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crear nuevo vehículo</DialogTitle>
          <DialogDescription>
            Registra la información base del vehículo para comenzar a operar con CarFlash.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="brand">Marca</Label>
            <Input
              id="brand"
              placeholder="Toyota"
              value={formValues.brand}
              onChange={(event) => updateField("brand", event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Modelo</Label>
            <Input
              id="model"
              placeholder="Corolla"
              value={formValues.model}
              onChange={(event) => updateField("model", event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Año</Label>
            <Input
              id="year"
              type="number"
              min="1900"
              max="2100"
              placeholder="2024"
              value={formValues.year || ""}
              onChange={(event) => updateField("year", Number(event.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Dominio</Label>
            <Input
              id="domain"
              placeholder="ABC-123"
              value={formValues.domain}
              onChange={(event) => updateField("domain", event.target.value.toUpperCase())}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vin">VIN</Label>
            <Input
              id="vin"
              placeholder="1HGCM82633A123456"
              value={formValues.vin}
              onChange={(event) => updateField("vin", event.target.value.toUpperCase())}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Precio</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="1000"
              placeholder="28900000"
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
              Crear vehículo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
