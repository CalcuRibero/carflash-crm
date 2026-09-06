"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness, PencilLine, Plus, Search, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/stores/auth/auth-provider";

import { canViewWorkRoles } from "../permissions";
import { useWorkRoles } from "../hooks/useWorkRoles";
import type { WorkRole } from "../types";

export function WorkRolesPage() {
  const router = useRouter();
  const user = useAuth().user;
  const { workRoles, isLoading, errorMessage } = useWorkRoles();
  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    if (!canViewWorkRoles(user?.role ?? null)) {
      router.replace("/unauthorized");
    }
  }, [router, user?.role]);

  if (!canViewWorkRoles(user?.role ?? null)) {
    return null;
  }

  const filteredRoles = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return workRoles;
    }

    return workRoles.filter((role) => {
      const haystack = `${role.code} ${role.name}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [searchTerm, workRoles]);

  const activeRoles = workRoles.filter((role) => role.isActive).length;

  return (
    <div className="space-y-6" data-hide-header="true">
      <PageHeader
        icon={BriefcaseBusiness}
        category="CarFlash"
        title="Gestión de Roles"
        action={{
          label: "Nuevo rol",
          onClick: () => undefined,
          icon: Plus,
          href: undefined,
        }}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de roles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{workRoles.length}</p>
            <p className="text-sm text-muted-foreground">Registros cargados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Roles activos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{activeRoles}</p>
            <p className="text-sm text-muted-foreground">Disponibles en el sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inactivos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{workRoles.length - activeRoles}</p>
            <p className="text-sm text-muted-foreground">No activos</p>
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
            <CardTitle>Roles</CardTitle>
            <CardDescription>Listado de roles disponibles en el sistema.</CardDescription>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar por código o nombre"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead>Actualizado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    Cargando roles...
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoles.map((role: WorkRole) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.code}</TableCell>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>
                      <span
                        className={
                          role.isActive
                            ? "rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                        }
                      >
                        {role.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(role.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(role.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" disabled aria-label="Editar rol">
                          <PencilLine className="size-4" />
                        </Button>
                        <Button variant="outline" size="icon" disabled aria-label="Eliminar rol">
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
    </div>
  );
}
