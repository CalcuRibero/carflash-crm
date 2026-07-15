"use client";

import { useState, useEffect } from "react";

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
import { useUsers } from "@/features/users/hooks/useUsers";
import { RecurrenceInterval, TicketPriority, TicketStatus, type TicketCategory, TicketCategoryLabel, RecurrentTicket, INITIAL_UPDATE_RECURRENT_TICKET_DATA } from "../types";

interface UpdateRecurrentTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: UpdateRecurrentTicketData) => void;
    currentTicket: RecurrentTicket | null;
}

export interface UpdateRecurrentTicketData {
    title: string;
    description: string;
    status?: TicketStatus;
    priority?: TicketPriority;
    category?: TicketCategory;
    assignedTo?: string | null;
    dueDate?: Date;
    interval: RecurrenceInterval;
    first_run_at: Date;
}

export function UpdateRecurrentTicketModal({
    isOpen,
    onClose,
    onSubmit,
    currentTicket
}: UpdateRecurrentTicketModalProps) {
    const { users } = useUsers();

    const [formData, setFormData] = useState<RecurrentTicket | null>(null);
    
    useEffect(() => {
        if (currentTicket) {
            setFormData({
                ...currentTicket,
                dueDate: typeof currentTicket.dueDate === 'string' ? new Date(currentTicket.dueDate) : currentTicket.dueDate,
                first_run_at: typeof currentTicket.first_run_at === 'string' ? new Date(currentTicket.first_run_at) : currentTicket.first_run_at,
            });
        }
    }, [currentTicket]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;
        console.log(formData)
        onSubmit(formData);
        handleClose();
    };

    const handleClose = () => {
        onClose();
    };

    if (!formData) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-125">
                <DialogHeader>
                    <DialogTitle>Editar Ticket Recurrente</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título</Label>
                        <Input
                            id="title"
                            placeholder="Ej: Mantenimiento Preventivo V042"
                            defaultValue={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                            id="description"
                            placeholder="Detalles del ticket..."
                            defaultValue={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="priority">Prioridad</Label>
                            <Select
                                defaultValue={formData.priority}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, priority: value as TicketPriority })
                                }
                            >
                                <SelectTrigger id="priority">
                                    <SelectValue placeholder="Seleccionar prioridad" />
                                </SelectTrigger>
                                <SelectContent defaultValue={formData.priority}>
                                    <SelectItem value={TicketPriority.LOW}>Baja</SelectItem>
                                    <SelectItem value={TicketPriority.MEDIUM}>Media</SelectItem>
                                    <SelectItem value={TicketPriority.HIGH}>Alta</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Categoría</Label>
                            <Select
                                defaultValue={formData.category}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, category: value as TicketCategory })
                                }
                            >
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Seleccionar categoría" />
                                </SelectTrigger>
                                <SelectContent defaultValue={formData.category}>
                                    {Object.entries(TicketCategoryLabel).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="assignedTo">Asignado a</Label>
                            <Select
                                onValueChange={(value) =>
                                    setFormData({ ...formData, assignedTo: value || undefined })
                                }
                                defaultValue={formData.assignedTo?.toString()}
                            >
                                <SelectTrigger id="assignedTo">
                                    <SelectValue placeholder="Seleccionar agente" />
                                </SelectTrigger>
                                <SelectContent defaultValue={formData.assignedTo?.toString()}>
                                    {users.map((user) => (
                                        <SelectItem key={user.id} value={user.id.toString()}>
                                            {user.fullName || user.username}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="interval">Intervalo</Label>
                            <Select
                                defaultValue={formData.interval}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, interval: value as RecurrenceInterval })
                                }
                                required
                            >
                                <SelectTrigger id="interval">
                                    <SelectValue placeholder="Seleccionar intervalo" />
                                </SelectTrigger>
                                <SelectContent defaultValue={formData.interval}>
                                    <SelectItem value={RecurrenceInterval.DAILY}>Diario</SelectItem>
                                    <SelectItem value={RecurrenceInterval.WEEKLY}>Semanal</SelectItem>
                                    <SelectItem value={RecurrenceInterval.MONTHLY}>Mensual</SelectItem>
                                    <SelectItem value={RecurrenceInterval.YEARLY}>Anual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dueDate">Fecha de Vencimiento</Label>
                        <Input
                            id="dueDate"
                            type="date"
                            defaultValue={formData.dueDate instanceof Date ? formData.dueDate.toISOString().split('T')[0] : ''}
                            onChange={(e) =>
                                setFormData({ ...formData, dueDate: new Date(e.target.value)  })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="startDate">Fecha de Inicio</Label>
                        <Input
                            id="startDate"
                            type="date"
                            defaultValue={formData.first_run_at instanceof Date ? formData.first_run_at.toISOString().split('T')[0] : ''}
                            onChange={(e) =>
                                setFormData({ ...formData, first_run_at: new Date(e.target.value) })
                            }
                            required
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button type="submit">Editar Ticket</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
