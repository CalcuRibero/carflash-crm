"use client";

import * as React from "react";
import { CarFront, PencilLine, Plus, Search, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/ui/page-header";

import { CreateVehicleModal } from "./create-vehicle-modal";
import { EditVehicleModal } from "./edit-vehicle-modal";
import { useCreateVehicle } from "../hooks/useCreateVehicle";
import { useDeleteVehicle } from "../hooks/useDeleteVehicle";
import { useUpdateVehicle } from "../hooks/useUpdateVehicle";
import { useVehicles } from "../hooks/useVehicles";
import type { VehicleFormValues, VehicleRecord } from "../types";

export function VehiclesPage() {
  const { vehicles, isLoading, errorMessage, refetch, setVehicles } = useVehicles();
  const { createVehicle, isCreating } = useCreateVehicle();
  const { updateVehicle, isUpdating } = useUpdateVehicle();
  const { deleteVehicle, isDeleting } = useDeleteVehicle();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [selectedVehicle, setSelectedVehicle] = React.useState<VehicleRecord | null>(null);

  const filteredVehicles = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return vehicles;
    }

    return vehicles.filter((vehicle) => {
      const haystack = `${vehicle.brand} ${vehicle.model} ${vehicle.domain} ${vehicle.vin}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [searchTerm, vehicles]);

  const handleCreateVehicle = async (values: VehicleFormValues) => {
    const createdVehicle = await createVehicle(values);

    if (createdVehicle) {
      setVehicles((current) => [createdVehicle, ...current]);
      await refetch();
    }
  };

  const handleUpdateVehicle = async (values: VehicleFormValues) => {
    if (!selectedVehicle) {
      return;
    }

    const updatedVehicle = await updateVehicle(selectedVehicle.id, values);

    if (updatedVehicle) {
      setVehicles((current) => current.map((vehicle) => (vehicle.id === selectedVehicle.id ? updatedVehicle : vehicle)));
      await refetch();
    }
  };

  const handleRemoveVehicle = async (vehicleId: string) => {
    const removed = await deleteVehicle(vehicleId);

    if (removed) {
      setVehicles((current) => current.filter((vehicle) => vehicle.id !== vehicleId));
      await refetch();
    }
  };

  return (
    <div className="space-y-6" data-hide-header="true">
      <PageHeader 
        icon={CarFront}
        category="CarFlash"
        title="Administración de Vehículos"
        action={{
          label: "Nuevo vehículo",
          onClick: () => setIsCreateOpen(true),
          icon: Plus
        }}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de vehículos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <CarFront className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{vehicles.length}</p>
                <p className="text-sm text-muted-foreground">Vehículos cargados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Precio promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {vehicles.length > 0 ? `$${Math.round(vehicles.reduce((sum, vehicle) => sum + vehicle.price, 0) / vehicles.length).toLocaleString()}` : "$0"}
            </p>
            <p className="text-sm text-muted-foreground">Promedio del catálogo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Años representados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{new Set(vehicles.map((vehicle) => vehicle.year)).size}</p>
            <p className="text-sm text-muted-foreground">Modelos distintos</p>
          </CardContent>
        </Card>
      </div>

      {errorMessage ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Catálogo actual</CardTitle>
            <CardDescription>Revisa y administra los vehículos disponibles en el sistema.</CardDescription>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar por marca, dominio o VIN"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehículo</TableHead>
                <TableHead>Dominio</TableHead>
                <TableHead>VIN</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                    Cargando vehículos...
                  </TableCell>
                </TableRow>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{vehicle.brand} {vehicle.model}</span>
                        <span className="text-sm text-muted-foreground">{vehicle.year}</span>
                      </div>
                    </TableCell>
                    <TableCell>{vehicle.domain}</TableCell>
                    <TableCell>{vehicle.vin}</TableCell>
                    <TableCell>${vehicle.price.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedVehicle(vehicle);
                            setIsEditOpen(true);
                          }}
                        >
                          <PencilLine className="size-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleRemoveVehicle(vehicle.id)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateVehicleModal open={isCreateOpen} onOpenChange={setIsCreateOpen} onCreateVehicle={handleCreateVehicle} />
      <EditVehicleModal open={isEditOpen} vehicle={selectedVehicle} onOpenChange={setIsEditOpen} onUpdateVehicle={handleUpdateVehicle} />
    </div>
  );
}
