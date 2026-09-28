import type { OperationToPrint } from "@/features/operations/types";

import { buildInvoiceHtml } from "./invoice-pdf.template";

export function printInvoice(data: OperationToPrint): void {
  try {
    const html = buildInvoiceHtml(data);

    // Validación básica del HTML generado
    if (!html || html.length < 100) {
      throw new Error("Error: HTML generado inválido o vacío");
    }

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    iframe.setAttribute("aria-hidden", "true");

    document.body.appendChild(iframe);

    const cleanup = () => {
      // Esperamos un toque antes de sacar el iframe: si lo removés
      // inmediatamente, algunos navegadores cancelan el diálogo de impresión.
      setTimeout(() => {
        if (iframe.parentNode) document.body.removeChild(iframe);
      }, 500);
    };

    iframe.onload = () => {
      const win = iframe.contentWindow;
      if (!win) return cleanup();

      // Si el usuario cierra o confirma el diálogo, limpiamos el iframe.
      win.onafterprint = cleanup;

      win.focus();
      win.print();
    };

    const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
    if (!doc) {
      cleanup();
      return;
    }

    doc.open();
    doc.write(html);
    doc.close();
  } catch (error) {
    console.error("Error al generar HTML de factura:", error);
    throw new Error(`Error al generar factura: ${error instanceof Error ? error.message : "Error desconocido"}`);
  }
}
