"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RecurrenceInterval, TicketStatus, TicketPriority, TicketCategory, TicketCategoryLabel } from "../types";

interface CreateRecurrentTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRecurrentTicketData) => void;
}

export interface CreateRecurrentTicketData {
  title: string;
  description: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  dueDate?: Date;
  interval: RecurrenceInterval;
  first_run_at: Date;
}

export function CreateRecurrentTicketModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateRecurrentTicketModalProps) {
  const [formData, setFormData] = useState<CreateRecurrentTicketData>({
    title: "",
    description: "",
    status: undefined,
    priority: undefined,
    category: undefined,
    dueDate: undefined,
    interval: RecurrenceInterval.MONTHLY,
    first_run_at: new Date(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      status: undefined,
      priority: undefined,
      category: undefined,
      dueDate: undefined,
      interval: RecurrenceInterval.MONTHLY,
      first_run_at: new Date(),
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Ticket Recurrente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Ej: Mantenimiento Preventivo V042"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Detalles del ticket..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value as TicketStatus })
              }
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TicketStatus.OPEN}>Abierto</SelectItem>
                <SelectItem value={TicketStatus.IN_PROGRESS}>En Progreso</SelectItem>
                <SelectItem value={TicketStatus.COMPLETED}>Completado</SelectItem>
                <SelectItem value={TicketStatus.CANCELLED}>Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Prioridad</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) =>
                setFormData({ ...formData, priority: value as TicketPriority })
              }
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="Seleccionar prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TicketPriority.LOW}>Baja</SelectItem>
                <SelectItem value={TicketPriority.MEDIUM}>Media</SelectItem>
                <SelectItem value={TicketPriority.HIGH}>Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value as TicketCategory })
              }
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TicketCategoryLabel).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interval">Intervalo</Label>
            <Select
              value={formData.interval}
              onValueChange={(value) =>
                setFormData({ ...formData, interval: value as RecurrenceInterval })
              }
              required
            >
              <SelectTrigger id="interval">
                <SelectValue placeholder="Seleccionar intervalo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={RecurrenceInterval.DAILY}>Diario</SelectItem>
                <SelectItem value={RecurrenceInterval.WEEKLY}>Semanal</SelectItem>
                <SelectItem value={RecurrenceInterval.MONTHLY}>Mensual</SelectItem>
                <SelectItem value={RecurrenceInterval.YEARLY}>Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Fecha de Vencimiento</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate ? formData.dueDate.toISOString().split('T')[0] : ''}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value ? new Date(e.target.value) : undefined })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Fecha de Inicio</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.first_run_at instanceof Date ? formData.first_run_at.toISOString().split('T')[0] : ''}
              onChange={(e) =>
                setFormData({ ...formData, first_run_at: new Date(e.target.value) })
              }
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              CANCELAR
            </Button>
            <Button type="submit">CREAR TICKET</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
