// invoice-pdf.template.ts
//
// Genera el HTML que Puppeteer va a renderizar. No depende de Puppeteer en sí:
// es una función pura string -> string, fácil de testear (podés hacer snapshot
// testing del HTML sin levantar un browser).

import type { OperationFormState, PaymentMethodEntry } from "@/features/operations/types";

const formatMoney = (value?: string | number | null): string => {
  const parsed = typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));
  if (Number.isNaN(parsed)) return "";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(parsed);
};

const formatDate = (value?: Date | string | number): string => {
  if (value === undefined || value === null || value === "") return "";
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat("es-AR", { dateStyle: "medium" }).format(parsed);
};

// Convierte undefined/null en celda vacía en vez de "undefined" en el PDF.
const cell = (value?: string | number): string => {
  if (value === undefined || value === null || value === "") return "";
  return String(value);
};

function getPaymentBreakdown(data: OperationFormState) {
  const payments = data.payments ?? [];
  const getAmount = (method: PaymentMethodEntry["method"]): number => {
    const entry = payments.find((payment) => payment.method === method);
    return entry ? Number.parseFloat(String(entry.amount)) || 0 : 0;
  };

  const financingEntry = payments.find((payment) => payment.method === "financiacion");
  const promissoryEntry = payments.find((payment) => payment.method === "pagares");

  return {
    downPayment: getAmount("sena"),
    tradeInValue: getAmount("permuta"),
    cash: getAmount("contado"),
    card: getAmount("tarjeta"),
    financingAmount: getAmount("financiacion"),
    financing: {
      method: financingEntry?.financingMedium ?? "",
      installments: financingEntry?.quotas ?? "",
      rateType: financingEntry?.system ?? "",
    },
    promissoryNotesAmount: getAmount("pagares"),
    promissoryNotes: {
      quantity: promissoryEntry?.promissoryCount ?? "",
      amountEach: promissoryEntry?.promissoryAmount ?? "",
    },
    observations: {
      downPayment: payments.find((payment) => payment.method === "sena")?.observations ?? "",
      tradeInValue: payments.find((payment) => payment.method === "permuta")?.observations ?? "",
      cash: payments.find((payment) => payment.method === "contado")?.observations ?? "",
      card: payments.find((payment) => payment.method === "tarjeta")?.observations ?? "",
      financing: financingEntry?.observations ?? "",
      promissoryNotes: promissoryEntry?.observations ?? "",
    },
  };
}

export function buildInvoiceHtml(data: OperationFormState): string {
  const invoiceNumber = data.invoiceNumber ?? data.id ?? "";
  const sellerName = data.seller ?? "";
  const vehicleDescription = [data.car?.brand ?? "", data.car?.model ?? ""].filter(Boolean).join(" ").trim();
  const licensePlate = data.car?.domain ?? data.car?.domain ?? "";
  const salePrice = Number.parseFloat(String(data.salePrice)) || 0;
  const transferCost = Number.parseFloat(String(data.transferCost)) || 0;
  const paperworkCost = Number.parseFloat(String(data.folderCost)) || 0;
  const totalToCollect = Number.parseFloat(String(data.totalAmount)) || salePrice + transferCost + paperworkCost;
  const pb = getPaymentBreakdown(data);
  const paymentTotal = (data.payments ?? []).reduce((sum, payment) => sum + (Number.parseFloat(String(payment.amount)) || 0), 0);
  const customer = {
    fullName: data.customer?.fullName ?? data.customer?.fullName ?? "",
    cuilOrDni: data.customer?.document ?? "",
    address: data.customer?.address ?? "",
    phone: data.customer?.phone ?? "",
    email: data.customer?.email ?? "",
    notes: data.observations ?? "",
  };
  const tradeIn = data.carSwapped
    ? {
        model: data.carSwapped.model ?? "",
        year: data.carSwapped.year ?? "",
        licensePlate: data.carSwapped.domain ?? "",
        notes: data.swapObservations ?? "",
      }
    : undefined;
  const createdAt = data.createdAt ? new Date(data.createdAt) : new Date();

  return /* html */ `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<title>Factura ${cell(invoiceNumber)}</title>
<style>
  @page {
    size: A4;
    margin: 14mm 12mm;
  }
  * { box-sizing: border-box; }
  body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 11px;
    color: #111;
    margin: 0;
  }
  .doc-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 10px;
  }
  .doc-header h1 {
    font-size: 15px;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .doc-header .meta {
    text-align: right;
    font-size: 10px;
    color: #444;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 14px;
  }
  th, td {
    border: 1px solid #333;
    padding: 5px 8px;
    vertical-align: middle;
  }
  th {
    background: #eee;
    text-transform: uppercase;
    font-size: 10.5px;
    letter-spacing: 0.3px;
  }
  td.label {
    font-weight: 600;
    text-transform: uppercase;
    width: 45%;
  }
  td.sublabel {
    font-weight: 400;
    text-transform: none;
    padding-left: 22px;
    font-style: italic;
    color: #333;
  }
  td.value {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
  td.center { text-align: center; }
  tr.total td {
    background: #d9d9d9;
    font-weight: 700;
    text-transform: uppercase;
  }

  /* ---- Bloque superior: Vehiculo / Dominio / Vendedor ---- */
  .top-grid {
    display: grid;
    grid-template-columns: 2fr 1.2fr 1.6fr;
  }
  .top-grid > div {
    border: 1px solid #333;
    border-left: none;
    padding: 5px 8px;
  }
  .top-grid > div:first-child { border-left: 1px solid #333; }
  .top-grid .k {
    font-weight: 700;
    text-transform: uppercase;
    font-size: 10.5px;
  }
  .top-grid .v {
    font-size: 12px;
    margin-top: 2px;
  }

  .section-title {
    text-align: center;
    font-weight: 700;
    text-transform: uppercase;
    padding: 6px;
    background: #eee;
  }

  .status-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 3px;
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    color: #fff;
  }
</style>
</head>
<body>

  <div class="doc-header">
    <h1>Comprobante de Venta / Factura</h1>
    <div class="meta">
      Nº Factura: <strong>${cell(invoiceNumber)}</strong><br />
      Fecha: ${formatDate(createdAt)}
    </div>
  </div>

  <!-- VEHICULO / DOMINIO / VENDEDOR -->
  <div class="top-grid">
    <div>
      <div class="k">Vehículo</div>
      <div class="v">${cell(vehicleDescription)}</div>
    </div>
    <div>
      <div class="k">Dominio</div>
      <div class="v">${cell(licensePlate)}</div>
    </div>
    <div>
      <div class="k">Vendedor</div>
      <div class="v">${cell(sellerName)}</div>
    </div>
  </div>

  <!-- COSTOS / TOTAL A COBRAR -->
  <table>
    <tbody>
      <tr>
        <td class="label">Precio de venta</td>
        <td class="value">${formatMoney(salePrice)}</td>
      </tr>
      <tr>
        <td class="label">Gasto de transferencia</td>
        <td class="value">${formatMoney(transferCost)}</td>
      </tr>
      <tr>
        <td class="label">Armado de carpeta</td>
        <td class="value">${formatMoney(paperworkCost)}</td>
      </tr>
      <tr class="total">
        <td class="label">Total a cobrar</td>
        <td class="value">${formatMoney(totalToCollect)}</td>
      </tr>
    </tbody>
  </table>

  <!-- FORMAS DE PAGO -->
  <table>
    <thead>
      <tr>
        <th colspan="2">Formas de pago</th>
        <th>Observaciones</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="label">Seña</td>
        <td class="value">${formatMoney(pb.downPayment)}</td>
        <td>${cell(pb.observations?.downPayment)}</td>
      </tr>
      <tr>
        <td class="label">Permuta precio</td>
        <td class="value">${formatMoney(pb.tradeInValue)}</td>
        <td>${cell(pb.observations?.tradeInValue)}</td>
      </tr>
      <tr>
        <td class="label">Al contado (efvo/transf)</td>
        <td class="value">${formatMoney(pb.cash)}</td>
        <td>${cell(pb.observations?.cash)}</td>
      </tr>
      <tr>
        <td class="label">Tarjeta de crédito</td>
        <td class="value">${formatMoney(pb.card)}</td>
        <td>${cell(pb.observations?.card)}</td>
      </tr>
      <tr>
        <td class="label">Financiación</td>
        <td class="value">${formatMoney(pb.financingAmount)}</td>
        <td rowspan="4">${cell(pb.observations?.financing)}</td>
      </tr>
      <tr>
        <td class="sublabel">Medio financiación</td>
        <td class="center">${cell(pb.financing?.method)}</td>
      </tr>
      <tr>
        <td class="sublabel">Cantidad cuotas</td>
        <td class="center">${cell(pb.financing?.installments)}</td>
      </tr>
      <tr>
        <td class="sublabel">Uva/fija</td>
        <td class="center">${cell(pb.financing?.rateType)}</td>
      </tr>
      <tr>
        <td class="label">Pagarés</td>
        <td class="value">${formatMoney(pb.promissoryNotesAmount)}</td>
        <td rowspan="3">${cell(pb.observations?.promissoryNotes)}</td>
      </tr>
      <tr>
        <td class="sublabel">Cantidad pagarés</td>
        <td class="center">${cell(pb.promissoryNotes?.quantity)}</td>
      </tr>
      <tr>
        <td class="sublabel">Monto cada pagaré</td>
        <td class="center">${formatMoney(pb.promissoryNotes?.amountEach)}</td>
      </tr>
      <tr class="total">
        <td class="label">Total a cobrar</td>
        <td class="value">${formatMoney(paymentTotal)}</td>
        <td></td>
      </tr>
    </tbody>
  </table>

  <!-- DATOS CLIENTE -->
  <table>
    <thead>
      <tr><th colspan="2">Datos cliente</th></tr>
    </thead>
    <tbody>
      <tr>
        <td class="label">Nombre completo</td>
        <td>${cell(customer.fullName)}</td>
      </tr>
      <tr>
        <td class="label">CUIL/DNI</td>
        <td>${cell(customer.cuilOrDni)}</td>
      </tr>
      <tr>
        <td class="label">Domicilio</td>
        <td>${cell(customer.address)}</td>
      </tr>
      <tr>
        <td class="label">Celular</td>
        <td>${cell(customer.phone)}</td>
      </tr>
      <tr>
        <td class="label">Mail</td>
        <td>${cell(customer.email)}</td>
      </tr>
      <tr>
        <td class="label">Observaciones</td>
        <td>${cell(customer.notes)}</td>
      </tr>
    </tbody>
  </table>

  <!-- PERMUTA (solo si hay carSwapped) -->
  ${
    tradeIn
      ? `
  <table>
    <thead>
      <tr><th colspan="2">Permuta</th></tr>
    </thead>
    <tbody>
      <tr>
        <td class="label">Modelo</td>
        <td>${cell(tradeIn.model)}</td>
      </tr>
      <tr>
        <td class="label">Año</td>
        <td>${cell(tradeIn.year)}</td>
      </tr>
      <tr>
        <td class="label">Dominio</td>
        <td>${cell(tradeIn.licensePlate)}</td>
      </tr>
      <tr>
        <td class="label">Observaciones</td>
        <td>${cell(tradeIn.notes)}</td>
      </tr>
    </tbody>
  </table>`
      : ""
  }

</body>
</html>
`;
}