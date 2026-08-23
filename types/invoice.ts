import { invoiceService } from "@/modules/invoices/service";

export type InvoiceWithDetails = NonNullable<
  Awaited<ReturnType<typeof invoiceService.getInvoice>>
>;
