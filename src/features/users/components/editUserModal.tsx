"use client";

import * as React from "react";
import { Lock, Mail, User as UserIcon } from "lucide-react";
import { z } from "zod";

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
import { Switch } from "@/components/ui/switch";
import { UserRole } from "@/lib/api/types";
import type { UserRow } from "./data";

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateUser: (userData: UpdateUserData) => void;
  user: UserRow;
}

export interface UpdateUserData {
  fullName?: string;
  username?: string;
  role?: UserRole;
  email?: string;
  password?: string;
  isActive?: boolean;
}

const userRoles = [
  "SuperAdmin",
  "AdministrationAccountant",
  "ComercialCordinator",
  "CarExpert",
  "Gestor",
  "CarSeller",
] as const;

const updateUserSchema = z.object({
  fullName: z.string().min(1, { message: "Nombre completo es requerido." }).optional(),
  username: z.string().min(1, { message: "Nombre de usuario es requerido." }).optional(),
  role: z.string().min(1, { message: "Seleccione un rol válido." }).optional(),
  email: z.email({ message: "Ingrese un correo electrónico válido." }).optional().or(z.literal("")),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }).optional().or(z.literal("")),
  isActive: z.boolean().optional(),
});

export function EditUserModal({
  open,
  onOpenChange,
  onUpdateUser,
  user,
}: EditUserModalProps) {
  const [fullName, setFullName] = React.useState(user.fullName ?? "");
  const [username, setUsername] = React.useState(user.username);
  const [role, setRole] = React.useState<UserRole | undefined>(user.role);
  const [email, setEmail] = React.useState(user.email ?? "");
  const [password, setPassword] = React.useState("");
  const [isActive, setIsActive] = React.useState(user.isActive);
  const [formErrors, setFormErrors] = React.useState<Partial<Record<keyof UpdateUserData, string>>>({});

  React.useEffect(() => {
    if (open) {
      setFullName(user.fullName ?? "");
      setUsername(user.username);
      setRole(user.role);
      setEmail(user.email ?? "");
      setPassword("");
      setIsActive(user.isActive);
      setFormErrors({});
    }
  }, [open, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Record<string, string | boolean | undefined> = {
      fullName: fullName || undefined,
      username: username || undefined,
      role: role || undefined,
      email: email || undefined,
      password: password || undefined,
      isActive,
    };

    const result = updateUserSchema.safeParse(payload);

    if (!result.success) {
      const nextErrors: Partial<Record<keyof UpdateUserData, string>> = {};
      result.error.issues.forEach((error) => {
        const field = error.path[0] as keyof UpdateUserData | undefined;
        if (field) {
          nextErrors[field] ||= error.message;
        }
      });
      setFormErrors(nextErrors);
      return;
    }

    setFormErrors({});
    onUpdateUser(result.data as UpdateUserData);

    onOpenChange(false);
  };

  const handleCancel = () => {
    setFullName(user.fullName ?? "");
    setUsername(user.username);
    setRole(user.role);
    setEmail(user.email ?? "");
    setPassword("");
    setIsActive(user.isActive);
    setFormErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>
            Actualice los detalles del usuario {user.fullName ?? user.username}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="fullName">Nombre Completo</Label>
            <Input
              id="fullName"
              placeholder="Ej. Juan Pérez"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {formErrors.fullName && <p className="text-sm text-destructive">{formErrors.fullName}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="username">Nombre de Usuario</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="username"
                placeholder="jperez_fleet"
                className="pl-9"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            {formErrors.username && <p className="text-sm text-destructive">{formErrors.username}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="role">Rol del Sistema</Label>
            <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Seleccione un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {userRoles.map((userRole) => (
                    <SelectItem key={userRole} value={userRole}>
                      {userRole}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {formErrors.role && <p className="text-sm text-destructive">{formErrors.role}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="usuario@dominio.com"
                className="pl-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {formErrors.email && <p className="text-sm text-destructive">{formErrors.email}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Contraseña (opcional)</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Dejar vacío para mantener actual"
                className="pl-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {formErrors.password && <p className="text-sm text-destructive">{formErrors.password}</p>}
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="isActive" className="font-medium">
                Estado de Usuario Activo
              </Label>
              <p className="text-xs text-muted-foreground">
                Permite el acceso al sistema.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              CANCELAR
            </Button>
            <Button type="submit">ACTUALIZAR USUARIO</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
