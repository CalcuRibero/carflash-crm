"use client";

import * as React from "react";
import { 
  CalendarDays, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  FileText, 
  MoreVertical, 
  Receipt, 
  Search, 
  User,
  XCircle
} from "lucide-react";

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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useInvoices } from "../hooks/useInvoices";
import type { Invoice, InvoiceStatus, PaymentMethod } from "../types";

const statusConfig: Record<InvoiceStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "Pendiente", variant: "secondary" },
  PAID: { label: "Pagado", variant: "default" },
  PARTIALLY_PAID: { label: "Parcialmente Pagado", variant: "outline" },
  CANCELLED: { label: "Cancelado", variant: "destructive" },
  REFUNDED: { label: "Reembolsado", variant: "destructive" },
};

const paymentMethodConfig: Record<PaymentMethod, string> = {
  sena: "Seña",
  permuta: "Permuta",
  contado: "Contado",
  tarjeta: "Tarjeta",
  financiacion: "Financiación",
  pagares: "Pagarés",
};

const getStatusIcon = (status: InvoiceStatus) => {
  switch (status) {
    case "PAID":
      return <CheckCircle2 className="h-4 w-4" />;
    case "PENDING":
    case "PARTIALLY_PAID":
      return <Clock className="h-4 w-4" />;
    case "CANCELLED":
    case "REFUNDED":
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

export function InvoiceList() {
  const { invoices=[], isLoading, error, filters, updateFilters, refetch } = useInvoices();
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateFilters({ search: value || undefined });
  };

  const handleStatusFilter = (value: string) => {
    updateFilters({ status: value === "all" ? undefined : (value as InvoiceStatus) });
  };

  const handlePaymentMethodFilter = (value: string) => {
    updateFilters({ paymentMethod: value === "all" ? undefined : (value as PaymentMethod) });
  };

  const filteredInvoices = React.useMemo(() => {
    if (!searchTerm) return invoices;
    
    const term = searchTerm.toLowerCase();
    return invoices.filter((invoice) => {
      const haystack = `${invoice.invoiceNumber} ${invoice.customer.fullName} ${invoice.customer.document} ${invoice.car.domain} ${invoice.car.brand} ${invoice.car.model}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [searchTerm, invoices]);

  const totalAmount = React.useMemo(() => {
    return invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
  }, [invoices]);

  const paidAmount = React.useMemo(() => {
    return invoices
      .filter((invoice) => invoice.status === "PAID")
      .reduce((sum, invoice) => sum + invoice.totalAmount, 0);
  }, [invoices]);

  const pendingAmount = React.useMemo(() => {
    return invoices
      .filter((invoice) => invoice.status === "PENDING" || invoice.status === "PARTIALLY_PAID")
      .reduce((sum, invoice) => sum + invoice.totalAmount, 0);
  }, [invoices]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <Receipt className="h-5 w-5" />
            <p className="text-sm font-semibold uppercase tracking-[0.32em]">Finanzas</p>
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Gestión de Facturación</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Administra y controla todas las facturas emitidas en el sistema.
          </p>
        </div>

        <Button className="gap-2" asChild>
          <a href="/dashboard/invoice/create">
            <FileText className="h-4 w-4" />
            Iniciar Nueva Factura
          </a>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">+
            
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Facturado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{formatCurrency(totalAmount)}</p>
                <p className="text-sm text-muted-foreground">Suma total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pagado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-500/10 p-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{formatCurrency(paidAmount)}</p>
                <p className="text-sm text-muted-foreground">Facturas cobradas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendiente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-500/10 p-2 text-orange-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{formatCurrency(pendingAmount)}</p>
                <p className="text-sm text-muted-foreground">Por cobrar</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Buscar por Factura, Cliente o Dominio..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              <Select onValueChange={handleStatusFilter} defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Estado de Pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="PENDING">Pendiente</SelectItem>
                    <SelectItem value="PAID">Pagado</SelectItem>
                    <SelectItem value="PARTIALLY_PAID">Parcialmente Pagado</SelectItem>
                    <SelectItem value="CANCELLED">Cancelado</SelectItem>
                    <SelectItem value="REFUNDED">Reembolsado</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select onValueChange={handlePaymentMethodFilter} defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Método de Pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Todos los métodos</SelectItem>
                    <SelectItem value="sena">Seña</SelectItem>
                    <SelectItem value="permuta">Permuta</SelectItem>
                    <SelectItem value="contado">Contado</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta</SelectItem>
                    <SelectItem value="financiacion">Financiación</SelectItem>
                    <SelectItem value="pagares">Pagarés</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Facturas</CardTitle>
          <CardDescription>Revisa y administra todas las facturas del sistema.</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Factura</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Vehículo</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Método de Pago</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                    Cargando facturas...
                  </TableCell>
                </TableRow>
              ) : filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                    No se encontraron facturas
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{invoice.customer.fullName}</div>
                          <div className="text-xs text-muted-foreground">{invoice.customer.document}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{invoice.car.brand} {invoice.car.model}</span>
                        <span className="text-sm text-muted-foreground">{invoice.car.domain}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(invoice.totalAmount)}</TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[invoice.status as InvoiceStatus]?.variant || "secondary"} className="gap-1">
                        {getStatusIcon(invoice.status as InvoiceStatus)}
                        {statusConfig[invoice.status as InvoiceStatus]?.label || invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{paymentMethodConfig[invoice.paymentMethod] || invoice.paymentMethod}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        {formatDate(invoice.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Imprimir</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
