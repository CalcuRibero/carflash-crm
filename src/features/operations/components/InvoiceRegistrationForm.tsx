"use client";

import { useMemo, useState } from "react";
import { BadgeDollarSign, CarFront, CircleDollarSign, FileText, Plus, Printer, Repeat2, Save, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SellerSelector } from "@/features/operations/components/SellerSelector";
import { VehicleSelector } from "@/features/operations/components/VehicleSelector";
import type { OperationFormState, PaymentMethod, PaymentMethodEntry } from "@/features/operations/types";
import { useCreateInvoice } from "@/features/invoice/hooks/useCreateInvoice";
import { printInvoice } from "@/lib/printer/printer";

const initialPayment: PaymentMethodEntry = {
  id: crypto.randomUUID(),
  method: "sena",
  amount: "",
  observations: "",
  financingMedium: "",
  quotas: "",
  system: "UVA",
  promissoryCount: "",
  promissoryAmount: "",
};

const initialFormState: OperationFormState = {
  id: "",
  invoiceNumber: "",
  subtotal: "",
  taxAmount: "",
  totalAmount: "",
  status: "PENDING",
  paymentMethod: "contado",
  customer: {
    id: "",
    fullName: "",
    document: "",
    address: "",
    phone: "",
    email: "",
  },
  car: {
    id: "",
    domain: "",
    brand: "",
    model: "",
    year: 0,
    vin: "",
    price: 0,
    status: "AVAILABLE",
  },
  seller: "",
  salePrice: "",
  transferCost: "",
  folderCost: "",
  observations: "",
  swapModel: "",
  swapYear: "",
  swapDomain: "",
  swapObservations: "",
  payments: [initialPayment],
};

function formatCurrency(value: string | number) {
  const amount = typeof value === "number" ? value : Number.parseFloat(value);
  if (Number.isNaN(amount)) return "$0,00";
  return `$${amount.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function PaymentFields({ entry, onChange }: { entry: PaymentMethodEntry; onChange: (entry: PaymentMethodEntry) => void }) {
  const showFinancing = entry.method === "financiacion";
  const showPromissory = entry.method === "pagares";

  return (
    <div className="rounded-2xl border border-border/70 bg-slate-50/70 p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-[1.1fr_0.7fr_1.2fr]">
        <label className="space-y-2 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Método</span>
          <Select value={entry.method} onValueChange={(value) => onChange({ ...entry, method: value as PaymentMethod })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="sena">Seña</SelectItem>
                <SelectItem value="permuta">Permuta</SelectItem>
                <SelectItem value="contado">Al contado</SelectItem>
                <SelectItem value="tarjeta">Tarjeta</SelectItem>
                <SelectItem value="financiacion">Financiación</SelectItem>
                <SelectItem value="pagares">Pagarés</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Monto</span>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input value={entry.amount} onChange={(event) => onChange({ ...entry, amount: event.target.value })} placeholder="0.00" className="pl-8" type="number" />
          </div>
        </label>
        <label className="space-y-2 text-sm md:col-span-1">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Observaciones</span>
          <Input value={entry.observations} onChange={(event) => onChange({ ...entry, observations: event.target.value })} placeholder="Notas adicionales" />
        </label>
      </div>

      {(showFinancing || showPromissory) && (
        <div className="mt-4 grid gap-4 rounded-2xl border border-dashed border-border/80 bg-white/70 p-4 md:grid-cols-3">
          {showFinancing && (
            <>
              <label className="space-y-2 text-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Medio de financiación</span>
                <Input value={entry.financingMedium} onChange={(event) => onChange({ ...entry, financingMedium: event.target.value })} placeholder="Banco / Financiera" />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Cuotas</span>
                <Input value={entry.quotas} onChange={(event) => onChange({ ...entry, quotas: event.target.value })} placeholder="12, 24, 36" type="number" />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Sistema</span>
                <Select value={entry.system} onValueChange={(value) => onChange({ ...entry, system: value as "UVA" | "Fija" })}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="UVA">UVA</SelectItem>
                      <SelectItem value="Fija">Fija</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </label>
            </>
          )}
          {showPromissory && (
            <>
              <label className="space-y-2 text-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Cantidad de pagarés</span>
                <Input value={entry.promissoryCount} onChange={(event) => onChange({ ...entry, promissoryCount: event.target.value })} placeholder="1, 2, 3" type="number" />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Monto por pagaré</span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input value={entry.promissoryAmount} onChange={(event) => onChange({ ...entry, promissoryAmount: event.target.value })} placeholder="0.00" className="pl-8" type="number" />
                </div>
              </label>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function InvoiceRegistrationForm() {
  const [form, setForm] = useState<OperationFormState>(initialFormState);
  const { createInvoice, isCreating, errorMessage } = useCreateInvoice();

  const totals = useMemo(() => {
    const price = Number.parseFloat(String(form.salePrice)) || 0;
    const transfer = Number.parseFloat(String(form.transferCost)) || 0;
    const folder = Number.parseFloat(String(form.folderCost)) || 0;
    return {
      price,
      transfer,
      folder,
      total: price + transfer + folder,
    };
  }, [form.folderCost, form.salePrice, form.transferCost]);

  const addPayment = () => {
    setForm((current) => ({ ...current, payments: [...current.payments, { ...initialPayment, id: crypto.randomUUID() }] }));
  };

  const handlePrintInvoice = () => {
    // Aquí podrías llamar a la función de impresión con los datos del formulario.
    printInvoice(form);
    console.log("Imprimiendo factura con los siguientes datos:", form);
  }

  const handleSave = async () => {
    const subtotal = Number.parseFloat(String(form.subtotal)) || 0;
    const taxAmount = Number.parseFloat(String(form.taxAmount)) || 0;
    const totalAmount = Number.parseFloat(String(form.totalAmount)) || 0;

    const invoiceData = {
      invoiceNumber: form.invoiceNumber || "",
      subtotal,
      taxAmount,
      totalAmount,
      status: form.status,
      paymentMethod: form.paymentMethod,
      customer: form.customer.id || "",
      car: form.car.id || "",
      carSwapped: form.carSwapped?.id,
      administrationNotes: form.administrationNotes || form.observations || "",
      paidAt: form.paidAt ? new Date(form.paidAt) : new Date(),
    };

    const result = await createInvoice(invoiceData);
    
    if (result) {
      console.log("Factura creada exitosamente:", result);
      // Aquí podrías agregar lógica adicional como resetear el formulario o redirigir
    } else {
      console.error("Error al crear la factura:", errorMessage);
    }
  }

  const updatePayment = (updatedEntry: PaymentMethodEntry) => {
    setForm((current) => ({
      ...current,
      payments: current.payments.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry)),
    }));
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-4 border-b border-border/80 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-primary/80">Facturación</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Registro de Factura <span className="text-primary">CarFlash</span></h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">Captura los datos del vehículo, cliente, permuta y los métodos de pago para consolidar la liquidación.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" className="gap-2" onClick={handlePrintInvoice}>
            <Printer className="size-4" />
            Imprimir
          </Button>
          <Button size="sm" className="gap-2" onClick={handleSave} disabled={isCreating}>
            <Save className="size-4" />
            Guardar registro
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
        <div className="space-y-6">
          <Card className="overflow-visible border-0 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
            <CardHeader className="border-b border-border/60 bg-slate-50/70 px-6 py-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-primary/10 p-2 text-primary">
                    <CarFront className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Detalles del vehículo</CardTitle>
                    <p className="text-sm text-muted-foreground">Información básica de la operación y asignación comercial.</p>
                  </div>
                </div>
                <span className="rounded-full border border-border/70 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Ref: CF-2024-001</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid gap-6 md:grid-cols-[1.4fr_0.6fr]">
                <label className="space-y-2 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Vehículo</span>
                  <VehicleSelector value={form.car.id ?? ""} onValueChange={(vehicleId) => setForm((current) => ({ ...current, car: { ...current.car, id: vehicleId } }))} />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Dominio</span>
                  <Input value={form.car.domain} onChange={(event) => setForm((current) => ({ ...current, car: { ...current.car, domain: event.target.value } }))} placeholder="ABC-123" />
                </label>
              </div>
              <label className="space-y-2 text-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Vendedor asignado</span>
                <SellerSelector value={form.seller} onValueChange={(sellerId) => setForm((current) => ({ ...current, seller: sellerId }))} />
              </label>
              <div className="grid gap-4 rounded-2xl border border-border/70 bg-slate-50/70 p-4 md:grid-cols-3">
                <label className="space-y-2 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Precio de venta</span>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input value={form.salePrice} onChange={(event) => setForm((current) => ({ ...current, salePrice: event.target.value }))} placeholder="0.00" className="pl-8" type="number" />
                  </div>
                </label>
                <label className="space-y-2 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Gasto transferencia</span>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input value={form.transferCost} onChange={(event) => setForm((current) => ({ ...current, transferCost: event.target.value }))} placeholder="0.00" className="pl-8" type="number" />
                  </div>
                </label>
                <label className="space-y-2 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Armado carpeta</span>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input value={form.folderCost} onChange={(event) => setForm((current) => ({ ...current, folderCost: event.target.value }))} placeholder="0.00" className="pl-8" type="number" />
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-visible border-0 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
            <CardHeader className="border-b border-border/60 bg-slate-50/70 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-500/10 p-2 text-emerald-600">
                  <UserRound className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">Datos del cliente</CardTitle>
                  <p className="text-sm text-muted-foreground">Información de contacto y observaciones del cierre.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Nombre completo</span>
                  <Input value={form.customer.fullName} onChange={(event) => setForm((current) => ({ ...current, customer: { ...current.customer, fullName: event.target.value } }))} placeholder="Nombre y apellido" />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">CUIL / DNI</span>
                  <Input value={form.customer.document} onChange={(event) => setForm((current) => ({ ...current, customer: { ...current.customer, document: event.target.value } }))} placeholder="20-12345678-9" />
                </label>
              </div>
              <label className="space-y-2 text-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Domicilio</span>
                <Input value={form.customer.address} onChange={(event) => setForm((current) => ({ ...current, customer: { ...current.customer, address: event.target.value } }))} placeholder="Calle y número" />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Celular</span>
                  <Input value={form.customer.phone} onChange={(event) => setForm((current) => ({ ...current, customer: { ...current.customer, phone: event.target.value } }))} placeholder="11 1234 5678" />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">E-mail</span>
                  <Input value={form.customer.email} onChange={(event) => setForm((current) => ({ ...current, customer: { ...current.customer, email: event.target.value } }))} placeholder="cliente@correo.com" />
                </label>
              </div>
              <label className="space-y-2 text-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Observaciones</span>
                <Textarea value={form.observations} onChange={(event) => setForm((current) => ({ ...current, observations: event.target.value }))} rows={3} placeholder="Comentarios sobre la operación o entregables" />
              </label>
            </CardContent>
          </Card>

          <Card className="overflow-visible border-0 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
            <CardHeader className="border-b border-border/60 bg-slate-50/70 px-6 py-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-amber-500/10 p-2 text-amber-600">
                    <Repeat2 className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Datos permuta</CardTitle>
                    <p className="text-sm text-muted-foreground">Información complementaria de la operación de intercambio.</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 p-6">
              <label className="space-y-2 text-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Modelo / versión</span>
                <Input value={form.swapModel} onChange={(event) => setForm((current) => ({ ...current, swapModel: event.target.value }))} placeholder="Modelo de la unidad de cambio" />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Año</span>
                  <Input value={form.swapYear} onChange={(event) => setForm((current) => ({ ...current, swapYear: event.target.value }))} placeholder="2024" />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Dominio</span>
                  <Input value={form.swapDomain} onChange={(event) => setForm((current) => ({ ...current, swapDomain: event.target.value }))} placeholder="ABC-456" />
                </label>
              </div>
              <label className="space-y-2 text-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Observaciones estado</span>
                <Textarea value={form.swapObservations} onChange={(event) => setForm((current) => ({ ...current, swapObservations: event.target.value }))} rows={3} placeholder="Detalles del estado del vehículo de cambio" />
              </label>
            </CardContent>
          </Card>

          <Card className="overflow-visible border-0 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
            <CardHeader className="border-b border-border/60 bg-slate-50/70 px-6 py-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-sky-500/10 p-2 text-sky-600">
                    <BadgeDollarSign className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Formas de pago</CardTitle>
                    <p className="text-sm text-muted-foreground">Declara los métodos con sus observaciones y datos dinámicos.</p>
                  </div>
                </div>
                <Button type="button" variant="outline" size="sm" className="gap-2" onClick={addPayment}>
                  <Plus className="size-4" />
                  Agregar método
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {form.payments.map((entry) => (
                <PaymentFields key={entry.id} entry={entry} onChange={updatePayment} />
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="overflow-hidden border-0 bg-slate-950 text-white shadow-[0_18px_45px_rgba(15,23,42,0.35)]">
            <CardHeader className="bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-400/15 p-2 text-emerald-300">
                  <CircleDollarSign className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-xl text-white">Resumen de liquidación</CardTitle>
                  <p className="text-sm text-slate-300">El total se calcula automáticamente sobre los montos base.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 p-6">
              <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Precio vehículo</span>
                  <span className="font-mono">{formatCurrency(form.salePrice || "0")}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Transferencia</span>
                  <span className="font-mono">{formatCurrency(form.transferCost || "0")}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Carpeta</span>
                  <span className="font-mono">{formatCurrency(form.folderCost || "0")}</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base font-semibold text-emerald-300">
                  <span>Total</span>
                  <span className="font-mono">{formatCurrency(totals.total)}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
                <div className="flex items-center gap-2 font-semibold">
                  <FileText className="size-4" />
                  Validación de fondos
                </div>
                <p className="mt-2 leading-6 text-emerald-50/80">El total a cobrar debe quedar cubierto por los métodos de pago declarados. Los montos de permuta quedan sujetos a peritaje técnico.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
            <CardHeader className="px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary/10 p-2 text-primary">
                  <FileText className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">Checklist operativo</CardTitle>
                  <p className="text-sm text-muted-foreground">Registra los puntos relevantes antes de cerrar la operación.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 p-6">
              {[
                "Documentación completa del cliente",
                "Validación de dominio y precio", 
                "Permuta inspeccionada",
                "Métodos de pago confirmados",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-slate-50/70 px-3 py-3 text-sm">
                  <div className="size-2.5 rounded-full bg-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
