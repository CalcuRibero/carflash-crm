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
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { printInvoice } from "@/lib/printer/printer";

import { useInvoices } from "../hooks/useInvoices";
import { getInvoiceById } from "../services/invoiceService";
import type { Invoice, InvoiceStatus, PaymentMethod } from "../types";

const statusConfig: Record<
  InvoiceStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
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


const getLength = (invoices: Invoice[] | undefined) => {
  if (!invoices) return 0;
  if (!Array.isArray(invoices)) {
    console.warn("Expected invoices to be an array, but got:", invoices);
    return 0;
  }
  return invoices.length;
};

export function InvoiceList() {
  const { invoices, isLoading, error, filters, updateFilters, refetch } = useInvoices();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(null);
  const [printingInvoiceId, setPrintingInvoiceId] = React.useState<string | null>(null);

  // Debug logging
  React.useEffect(() => {
    console.log("=== InvoiceList Debug ===");
    console.log("invoices:", invoices);
    console.log("invoices type:", typeof invoices);
    console.log("invoices length:", invoices?.length);
    console.log("isLoading:", isLoading);
    console.log("error:", error);
    console.log("searchTerm:", searchTerm);
  }, [invoices, isLoading, error, searchTerm]);

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
    console.log("Filtering invoices:", invoices);

    if (!searchTerm) {
      console.log("No search term, returning all invoices");
      return invoices || [];
    }

    const term = searchTerm.toLowerCase();
    console.log("Search term:", term);

    const filtered = (invoices || []).filter((invoice) => {
      console.log("Filtering invoice:", invoice);

      const haystack =
        `${invoice.invoiceNumber || ""} ${invoice.customer?.fullName || ""} ${invoice.customer?.document || ""} ${invoice.car?.domain || ""} ${invoice.car?.brand || ""} ${invoice.car?.model || ""}`.toLowerCase();

      const matches = haystack.includes(term);
      console.log("Invoice matches search:", matches);

      return matches;
    });


    console.log("Filtered invoices:", filtered);
    console.log("Filtered invoices length:", getLength(filtered));
    return filtered;
  }, [searchTerm, invoices]);

  const totalAmount = React.useMemo(() => {
    return (invoices || []).reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);
  }, [invoices]);

  const paidAmount = React.useMemo(() => {
    return (invoices || [])
      .filter((invoice) => invoice.status === "PAID")
      .reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);
  }, [invoices]);

  const pendingAmount = React.useMemo(() => {
    return (invoices || [])
      .filter((invoice) => invoice.status === "PENDING" || invoice.status === "PARTIALLY_PAID")
      .reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);
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

  const handlePrintInvoice = async (invoice: Invoice) => {
    setPrintingInvoiceId(invoice.id);

    try {
      const details = await getInvoiceById(invoice.id);
      printInvoice(details);
    } catch (printError) {
      toast.error("No se pudo imprimir la factura", {
        description: printError instanceof Error ? printError.message : "Intente nuevamente.",
      });
    } finally {
      setPrintingInvoiceId(null);
    }
  };

  return (
    <div className="space-y-6" data-hide-header="true">
      <PageHeader
        icon={Receipt}
        category="Finanzas"
        title="Gestión de Facturación"
        action={{
          label: "Iniciar Nueva Factura",
          href: "/dashboard/invoice/create",
          icon: FileText,
        }}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            +<CardTitle className="text-sm font-medium text-muted-foreground">Total Facturado</CardTitle>
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
                <>
                  {console.log("Rendering loading state")}
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                      Cargando facturas...
                    </TableCell>
                  </TableRow>
                </>
              ) : (getLength(filteredInvoices)) === 0 ? (
                <>
                  {console.log("Rendering empty state")}
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                      No se encontraron facturas
                    </TableCell>
                  </TableRow>
                </>
              ) : (
                <>
                  {console.log("Rendering invoices table with", filteredInvoices.length, "invoices")}
                  {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{invoice.customer?.fullName || "N/A"}</div>
                          <div className="text-xs text-muted-foreground">{invoice.customer?.document || "N/A"}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {invoice.car?.brand || "N/A"} {invoice.car?.model || "N/A"}
                        </span>
                        <span className="text-sm text-muted-foreground">{invoice.car?.domain || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(invoice.totalAmount)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={statusConfig[invoice.status as InvoiceStatus]?.variant || "secondary"}
                        className="gap-1"
                      >
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
                          <DropdownMenuItem onSelect={() => setSelectedInvoice(invoice)}>Ver detalles</DropdownMenuItem>
                          <DropdownMenuItem
                            disabled
                            title="La API de facturas no tiene una operación de actualización disponible."
                          >
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={printingInvoiceId === invoice.id}
                            onSelect={() => void handlePrintInvoice(invoice)}
                          >
                            {printingInvoiceId === invoice.id ? "Imprimiendo..." : "Imprimir"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                </>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={selectedInvoice !== null} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        {selectedInvoice && (
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Factura {selectedInvoice.invoiceNumber}</DialogTitle>
              <DialogDescription>
                Emitida el {formatDate(selectedInvoice.createdAt)}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 sm:grid-cols-2">
              <section className="space-y-3">
                <h3 className="text-sm font-semibold">Cliente</h3>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Nombre</dt>
                    <dd>{selectedInvoice.customer?.fullName || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Documento</dt>
                    <dd>{selectedInvoice.customer?.document || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Teléfono</dt>
                    <dd>{selectedInvoice.customer?.phone || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Correo</dt>
                    <dd>{selectedInvoice.customer?.email || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Dirección</dt>
                    <dd>{selectedInvoice.customer?.address || "N/A"}</dd>
                  </div>
                </dl>
              </section>
              <section className="space-y-3">
                <h3 className="text-sm font-semibold">Operación</h3>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Vehículo</dt>
                    <dd>
                      {[selectedInvoice.car?.brand, selectedInvoice.car?.model].filter(Boolean).join(" ") || "N/A"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Dominio</dt>
                    <dd>{selectedInvoice.car?.domain || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Vendedor</dt>
                    <dd>{selectedInvoice.seller || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Método de pago</dt>
                    <dd>{paymentMethodConfig[selectedInvoice.paymentMethod] || selectedInvoice.paymentMethod}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Estado</dt>
                    <dd>{statusConfig[selectedInvoice.status as InvoiceStatus]?.label || selectedInvoice.status}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Total</dt>
                    <dd className="font-semibold">{formatCurrency(selectedInvoice.totalAmount)}</dd>
                  </div>
                </dl>
              </section>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
