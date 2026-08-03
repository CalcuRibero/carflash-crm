import { buildInvoiceHtml } from './invoice-pdf.template';
import { OperationFormState } from '@/features/operations/types';
 
export function printInvoice(data: OperationFormState): void {
  const html = buildInvoiceHtml(data);
 
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  iframe.setAttribute('aria-hidden', 'true');
 
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
}