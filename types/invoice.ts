import { getInvoiceDetails } from "@/lib/invoices";

export type InvoiceWithDetails = NonNullable<
  Awaited<ReturnType<typeof getInvoiceDetails>>
>;
