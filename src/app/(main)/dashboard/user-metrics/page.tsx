"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Clock, Mail, AlertTriangle, Filter, ChevronLeft as ChevronLeftIcon, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTicketsByUserId } from "@/features/tickets/hooks/useTicketsByUserId";
import type { Ticket, TicketStatus } from "@/lib/api/types";

const chartConfig = {
  abierto: {
    label: "Abierto",
    color: "hsl(var(--chart-1))",
  },
  resuelto: {
    label: "Resuelto",
    color: "hsl(var(--chart-2))",
  },
  en_progreso: {
    label: "En Progreso",
    color: "hsl(var(--chart-3))",
  },
  cerrado: {
    label: "Cerrado",
    color: "hsl(var(--chart-4))",
  },
} as const;

function getStatusVariant(status: TicketStatus): "default" | "secondary" | "destructive" | "outline" {
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

function getStatusLabel(status: TicketStatus): string {
  switch (status) {
    case "open":
      return "ABIERTO";
    case "in_progress":
      return "EN PROGRESO";
    case "resolved":
      return "RESUELTO";
    case "closed":
      return "CERRADO";
    default:
      return status;
  }
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function UserMetricsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const userIdNumber = userId ? parseInt(userId, 10) : null;

  const { tickets, isLoading, errorMessage } = useTicketsByUserId(userIdNumber);

  // Calculate metrics
  const inProgressCount = tickets.filter((t) => t.status === "in_progress").length;
  const openCount = tickets.filter((t) => t.status === "open").length;
  const overdueCount = tickets.filter((t) => {
    if (!t.dueDate) return false;
    const dueDate = new Date(t.dueDate);
    return dueDate < new Date() && t.status !== "resolved" && t.status !== "closed";
  }).length;

  // Calculate chart data
  const statusCounts = React.useMemo(() => {
    const counts: Record<string, number> = {
      abierto: tickets.filter((t) => t.status === "open").length,
      resuelto: tickets.filter((t) => t.status === "resolved").length,
      en_progreso: tickets.filter((t) => t.status === "in_progress").length,
      cerrado: tickets.filter((t) => t.status === "closed").length,
    };
    return Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => ({ status, count }));
  }, [tickets]);

  const totalTickets = tickets.length;

  const [currentPage, setCurrentPage] = React.useState(0);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(tickets.length / itemsPerPage);
  const currentTickets = tickets.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Cargando métricas...</div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-destructive">{errorMessage}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ChevronLeft className="size-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Métricas de Empleados</h1>
          <p className="text-muted-foreground">
            Monitoreo en tiempo real del rendimiento y eficiencia del equipo operativo.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tickets en Progreso */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="size-5 text-primary" />
                </div>
                <CardTitle className="text-base">Tickets en Progreso</CardTitle>
              </div>
              <Badge variant="default" className="gap-1">
                <span className="size-2 rounded-full bg-green-500" />
                Activo
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{inProgressCount}</div>
          </CardContent>
        </Card>

        {/* Tickets Abiertos */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <Mail className="size-5 text-yellow-600" />
                </div>
                <CardTitle className="text-base">Tickets Abiertos</CardTitle>
              </div>
              <Badge variant="outline" className="gap-1">
                <AlertTriangle className="size-3 text-yellow-600" />
                Nuevo
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{openCount}</div>
          </CardContent>
        </Card>

        {/* Tickets Atrasados */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <AlertTriangle className="size-5 text-red-600" />
                </div>
                <CardTitle className="text-base">Tickets Atrasados</CardTitle>
              </div>
              <Badge variant="destructive" className="gap-1">
                <span className="size-2 rounded-full bg-red-500" />
                Crítico
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overdueCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tickets de Empleado</CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="size-4" />
              FILTRAR POR
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>TÍTULO</TableHead>
                <TableHead>ESTADO</TableHead>
                <TableHead>FECHA DE INICIO</TableHead>
                <TableHead>FECHA DE VENCIMIENTO</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No hay tickets disponibles
                  </TableCell>
                </TableRow>
              ) : (
                currentTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.title}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(ticket.status)}>
                        {getStatusLabel(ticket.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                    <TableCell>{formatDate(ticket.dueDate)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {totalTickets > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {currentTickets.length} de {totalTickets} tickets
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                >
                  <ChevronLeftIcon className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage >= totalPages - 1}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución por Estado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-48 h-48">
              <ChartContainer config={chartConfig} className="aspect-square">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{totalTickets}</div>
                      <div className="text-xs text-muted-foreground">TOTAL</div>
                    </div>
                  </div>
                  {/* Simple CSS-based donut chart representation */}
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    {statusCounts.map((item, index) => {
                      const percentage = (item.count / totalTickets) * 100;
                      const offset = statusCounts
                        .slice(0, index)
                        .reduce((acc, prev) => acc + (prev.count / totalTickets) * 100, 0);
                      return (
                        <circle
                          key={item.status}
                          cx="18"
                          cy="18"
                          r="15.91549430918954"
                          fill="transparent"
                          stroke={chartConfig[item.status as keyof typeof chartConfig]?.color}
                          strokeWidth="3"
                          strokeDasharray={`${percentage} ${100 - percentage}`}
                          strokeDashoffset={-offset}
                        />
                      );
                    })}
                  </svg>
                </div>
              </ChartContainer>
            </div>
            <div className="flex flex-wrap gap-4">
              {statusCounts.map((item) => (
                <div key={item.status} className="flex items-center gap-2">
                  <div
                    className="size-3 rounded-full"
                    style={{
                      backgroundColor: chartConfig[item.status as keyof typeof chartConfig]?.color,
                    }}
                  />
                  <span className="text-sm">
                    {chartConfig[item.status as keyof typeof chartConfig]?.label} ({item.count})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
