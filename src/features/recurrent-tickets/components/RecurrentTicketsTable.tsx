"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RecurrenceInterval, TicketStatus, TicketPriority, TicketCategory, type RecurrentTicket, TicketCategoryLabel } from "../types";

interface RecurrentTicketsTableProps {
  tickets: RecurrentTicket[];
  onEdit: (ticket: RecurrentTicket) => void;
  onDelete: (ticketId: string) => void;
}

function getPriorityColor(priority?: TicketPriority): string {
  if (!priority) return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  switch (priority) {
    case TicketPriority.HIGH:
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case TicketPriority.MEDIUM:
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case TicketPriority.LOW:
      return "bg-green-100 text-green-800 hover:bg-green-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
}

function getIntervalLabel(interval: RecurrenceInterval): string {
  switch (interval) {
    case RecurrenceInterval.DAILY:
      return "Diario";
    case RecurrenceInterval.WEEKLY:
      return "Semanal";
    case RecurrenceInterval.MONTHLY:
      return "Mensual";
    case RecurrenceInterval.YEARLY:
      return "Anual";
    default:
      return interval;
  }
}

function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const year = dateObj.getFullYear();
  const month = dateObj.toLocaleString('en-US', { month: 'short' });
  const day = dateObj.getDate();
  return `${day} ${month} ${year}`;
}

function getStatusLabel(status?: TicketStatus): string {
  if (!status) return "-";
  switch (status) {
    case TicketStatus.OPEN:
      return "Abierto";
    case TicketStatus.IN_PROGRESS:
      return "En Progreso";
    case TicketStatus.RESOLVED:
      return "Resuelto";
    case TicketStatus.CLOSED:
      return "Cerrado";
    default:
      return status;
  }
}

function getCategoryLabel(category?: TicketCategory): string {
  if (!category) return "-";
  const categoryLabel = TicketCategoryLabel[category];
  return categoryLabel || category;
}

export function RecurrentTicketsTable({
  tickets,
  onEdit,
  onDelete,
}: RecurrentTicketsTableProps) {
  if (tickets.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">No hay Tickets Fijos</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>TÍTULO</TableHead>
            <TableHead>ESTADO</TableHead>
            <TableHead>PRIORIDAD</TableHead>
            <TableHead>CATEGORÍA</TableHead>
            <TableHead>INTERVALO</TableHead>
            <TableHead>VENCIMIENTO</TableHead>
            <TableHead>COMENZADO EN</TableHead>
            <TableHead className="text-right">ACCIONES</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className="font-medium">{ticket.title}</TableCell>
              <TableCell>{getStatusLabel(ticket.status)}</TableCell>
              <TableCell>
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority?.toUpperCase() || "-"}
                </Badge>
              </TableCell>
              <TableCell>{getCategoryLabel(ticket.category)}</TableCell>
              <TableCell>{getIntervalLabel(ticket.interval)}</TableCell>
              <TableCell>{ticket.dueDate ? formatDate(ticket.dueDate) : "-"}</TableCell>
              <TableCell>{formatDate(ticket.first_run_at)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(ticket)}
                    className="h-8 w-8 p-0"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-pencil"
                    >
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(ticket.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-trash-2"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
