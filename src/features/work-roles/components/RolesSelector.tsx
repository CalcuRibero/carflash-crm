"use client";

import { useMemo, useState } from "react";

import { Loader2, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkRoles } from "@/features/work-roles/hooks/useWorkRoles";
import type { WorkRole } from "@/features/work-roles/types";

interface RolesSelectorProps {
  value: string;
  onValueChange: (workRoleId: string, workRole?: WorkRole) => void;
  allowInactiveValue?: boolean;
}

export function getSelectableWorkRoles(workRoles: WorkRole[], value?: string) {
  return workRoles.filter((workRole) => workRole.isActive || workRole.id === value);
}

function formatRoleLabel(workRole: WorkRole) {
  return workRole.code ? `${workRole.name} (${workRole.code})` : workRole.name;
}

export function RolesSelector({ value, onValueChange, allowInactiveValue = false }: RolesSelectorProps) {
  const { workRoles, isLoading, errorMessage } = useWorkRoles();
  const [search, setSearch] = useState("");

  const selectableRoles = useMemo(
    () => getSelectableWorkRoles(workRoles, allowInactiveValue ? value : undefined),
    [allowInactiveValue, value, workRoles],
  );

  const filteredRoles = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return selectableRoles;

    return selectableRoles.filter((workRole) => `${workRole.name} ${workRole.code}`.toLowerCase().includes(normalized));
  }, [search, selectableRoles]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-dashed border-border/70 bg-slate-50/70 px-3 py-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Cargando roles...
      </div>
    );
  }

  if (!workRoles.length && errorMessage) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Select
        value={value}
        onValueChange={(workRoleId) => {
          const workRole = workRoles.find((role) => role.id === workRoleId);
          onValueChange(workRoleId, workRole);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecciona un rol" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filteredRoles.length > 0 ? (
              filteredRoles.map((workRole) => (
                <SelectItem key={workRole.id} value={workRole.id}>
                  {formatRoleLabel(workRole)}
                </SelectItem>
              ))
            ) : (
              <div className="px-2 py-2 text-sm text-muted-foreground">No se encontraron roles.</div>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
