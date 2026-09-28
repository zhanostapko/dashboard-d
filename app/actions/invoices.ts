"use server";

import type { InvoiceFormValues } from "@/modules/invoices/schema";

export type SaveInvoiceState = {
  errors: Record<string, string[]> | null;
  success: boolean | null;
  formData: InvoiceFormValues | null;
};

export async function saveInvoiceAction(
  prevState: SaveInvoiceState,
  action: InvoiceFormValues
): Promise<SaveInvoiceState> {
  // Temporarily disabled during the focused users/auth/shared refactor.
  return {
    ...prevState,
    success: false,
    formData: action,
    errors: {
      invoice: ["Счета временно отключены на время рефакторинга."],
    },
  };
}
