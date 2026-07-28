"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Clock, Pen, Trash, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { Ticket } from "@/lib/api/types";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "../types";
import { useTicketsByTicketId } from "../hooks/useTicketById";
import { useDeleteTicket } from "../hooks/useDeleteTicket";
import { useEditTicketModal } from "../hooks/useEditTicketModal";
import { TicketsModal } from "./TicketsModal";

interface TicketDetailProps {
  ticketId: string;
}

function getPriorityBadgeVariant(priority: string): "default" | "secondary" | "destructive" | "outline" {
  switch (priority) {
    case "low":
      return "secondary";
    case "medium":
      return "default";
    case "high":
      return "outline";
    case "critical":
      return "destructive";
    default:
      return "secondary";
  }
}

function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "open":
      return "outline";
    case "in_progress":
      return "default";
    case "resolved":
      return "secondary";
    case "closed":
      return "outline";
    default:
      return "outline";
  }
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "No establecida";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function TicketDetail({ ticketId }: TicketDetailProps) {
  const router = useRouter();
  const { ticket, isLoading, errorMessage, refetch } = useTicketsByTicketId(ticketId);
  const { deleteTicket, isDeleting } = useDeleteTicket();
  const editTicketModal = useEditTicketModal();

  const handleDelete = async () => {
    if (!ticket?.id) return;
    try {
      await deleteTicket(ticket.id);
      router.push("/dashboard/kanban");
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  const handleEdit = () => {
    if (ticket) {
      editTicketModal.openModal(ticket);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Cargando ticket...</div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-destructive">{errorMessage}</div>
        <Button onClick={() => refetch()} variant="outline">
          Reintentar
        </Button>
      </div>
    );
  }

  if (!ticket || !ticket.id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-muted-foreground">Ticket no encontrado</div>
        <Button asChild variant="outline">
          <Link href="/dashboard/kanban">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Kanban
          </Link>
        </Button>
      </div>
    );
  }

  const priorityLabel = PRIORITY_OPTIONS.find((opt) => opt.value === ticket.priority)?.label || ticket.priority;
  const statusLabel = STATUS_OPTIONS.find((opt) => opt.value === ticket.status)?.label || ticket.status;

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="default" size="sm">
            <Link href="/dashboard/kanban">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Detalle del Ticket</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleEdit} variant="outline" size="sm">
            <Pen className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button 
            onClick={handleDelete} 
            variant="destructive" 
            size="sm"
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash className="mr-2 h-4 w-4" />
            {isDeleting ? "Borrando..." : "Borrar"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{ticket.title}</CardTitle>
              <CardDescription>ID: {ticket.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Descripción</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{ticket.description || "Sin descripción"}</p>
              </div>
              <Separator />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Estado</h3>
                  <Badge variant={getStatusBadgeVariant(ticket.status)}>{statusLabel}</Badge>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Prioridad</h3>
                  <Badge variant={getPriorityBadgeVariant(ticket.priority)}>{priorityLabel}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Asignado a</p>
                  <p className="text-sm text-muted-foreground">
                    {ticket.assignedTo ? ticket.assignedTo.fullName || ticket.assignedTo.username : "Sin asignar"}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Creado por</p>
                  <p className="text-sm text-muted-foreground">
                    {ticket.createdBy ? ticket.createdBy.fullName || ticket.createdBy.username : "No especificado"}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Fecha de vencimiento</p>
                  <p className="text-sm text-muted-foreground">{formatDate(ticket.dueDate)}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Creado el</p>
                  <p className="text-sm text-muted-foreground">{formatDate(ticket.createdAt)}</p>
                </div>
              </div>
              {ticket.resolvedAt && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Resuelto el</p>
                      <p className="text-sm text-muted-foreground">{formatDate(ticket.resolvedAt)}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {ticket.category && (
            <Card>
              <CardHeader>
                <CardTitle>Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">{ticket.category}</Badge>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <TicketsModal {...editTicketModal.modalProps} />
    </div>
  );
}
