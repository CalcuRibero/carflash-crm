"use client";

import * as React from "react";
import { Lock, Mail, User } from "lucide-react";
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

interface CreateUsersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateUser: (userData: CreateUserData) => void;
}

export interface CreateUserData {
  fullName: string;
  username: string;
  role: UserRole;
  email: string;
  password: string;
  isActive: boolean;
}

const userRoles = [
  "SuperAdmin",
  "AdministrationAccountant",
  "ComercialCordinator",
  "CarExpert",
  "Gestor",
  "CarSeller",
] as const;

const createUserSchema = z.object({
  fullName: z.string().min(1, { message: "Nombre completo es requerido." }),
  username: z.string().min(1, { message: "Nombre de usuario es requerido." }),
  role: z.string().min(1, { message: "Seleccione un rol válido." }),
  email: z.email({ message: "Ingrese un correo electrónico válido." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
  isActive: z.boolean(),
});

export function CreateUsersModal({
  open,
  onOpenChange,
  onCreateUser,
}: CreateUsersModalProps) {
  const [fullName, setFullName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [role, setRole] = React.useState<UserRole | undefined>(undefined);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isActive, setIsActive] = React.useState(true);
  const [formErrors, setFormErrors] = React.useState<Partial<Record<keyof CreateUserData, string>>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = createUserSchema.safeParse({
      fullName,
      username,
      role,
      email,
      password,
      isActive,
    });

    if (!result.success) {
      const nextErrors: Partial<Record<keyof CreateUserData, string>> = {};
      result.error.issues.forEach((error) => {
        const field = error.path[0] as keyof CreateUserData | undefined;
        if (field) {
          nextErrors[field] ||= error.message;
        }
      });
      setFormErrors(nextErrors);
      return;
    }

    setFormErrors({});
    onCreateUser(result.data as CreateUserData);

    // Reset form
    setFullName("");
    setUsername("");
    setRole(undefined);
    setEmail("");
    setPassword("");
    setIsActive(true);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFullName("");
    setUsername("");
    setRole(undefined);
    setEmail("");
    setPassword("");
    setIsActive(true);
    setFormErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          <DialogDescription>
            Ingrese los detalles para registrar un nuevo integrante en la plataforma.
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
              required
            />
            {formErrors.fullName && <p className="text-sm text-destructive">{formErrors.fullName}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="username">Nombre de Usuario</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="username"
                placeholder="jperez_fleet"
                className="pl-9"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            {formErrors.username && <p className="text-sm text-destructive">{formErrors.username}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="role">Rol del Sistema</Label>
            <Select value={role} onValueChange={(value) => setRole(value as UserRole)} required>
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
                required
              />
            </div>
            {formErrors.email && <p className="text-sm text-destructive">{formErrors.email}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                className="pl-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
                Permite el acceso inmediato tras la creación.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              CANCELAR
            </Button>
            <Button type="submit">CREAR USUARIO</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
