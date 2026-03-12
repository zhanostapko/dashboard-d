"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/authz";
import {
  invoiceCreateSchema,
  InvoiceFormValues,
  invoiceUpdateSchema,
} from "@/modules/invoices/schema";
import { invoiceService } from "@/modules/invoices/service";

export type SaveInvoiceState = {
  errors: Record<string, string[]> | null;
  success: boolean | null;
  formData: InvoiceFormValues | null;
};

export async function saveInvoiceAction(
  prevState: SaveInvoiceState,
  action: InvoiceFormValues
): Promise<SaveInvoiceState> {
  const id = action.id;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      ...prevState,
      success: false,
      formData: action,
      errors: {
        auth: ["Authentication required."],
      },
    };
  }

  try {
    if (Number.isInteger(id) && id !== 0) {
      const existingInvoice = await invoiceService.getInvoice(id!);

      if (!existingInvoice) {
        return {
          ...prevState,
          errors: {
            invoice: ["Invoice not found."],
          },
          success: false,
          formData: action,
        };
      }

      if (existingInvoice.status === "Paid") {
        return {
          ...prevState,
          errors: {
            invoice: ["Paid invoices cannot be edited."],
          },
          success: false,
          formData: action,
        };
      }

      const parsed = await invoiceUpdateSchema.safeParseAsync(action);
      if (!parsed.success) {
        return {
          ...prevState,
          errors: {
            validation: [
              "Validation error occurred. Please check and try again",
            ],
          },
          success: false,
          formData: action,
        };
      }
      await invoiceService.updateInvoice(id!, parsed.data);
      revalidatePath("/auth/invoices");
      revalidatePath(`/auth/invoices/${id}`);
    } else {
      const parsed = await invoiceCreateSchema.safeParseAsync(action);
      if (!parsed.success) {
        return {
          ...prevState,
          errors: {
            validation: [
              "Validation error occurred. Please check and try again",
            ],
          },
          success: false,
          formData: action,
        };
      }
      await invoiceService.createInvoice(parsed.data);
      revalidatePath("/auth/invoices");
    }

    return { errors: null, success: true, formData: null };
  } catch (err) {
    console.error("Server error:", err);

    return {
      success: false,
      formData: action,
      errors: {
        db: ["Something went wrong on the server. Please try again later."],
      },
    };
  }
}
