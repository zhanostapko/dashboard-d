"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/authz";
import { authMessages } from "@/lib/auth-messages";
import {
  invoiceCreateSchema,
  InvoiceFormValues,
  invoiceUpdateSchema,
} from "@/modules/invoices/schema";
import {
  InvoiceServiceConflictError,
  invoiceService,
} from "@/modules/invoices/service";
import { getServerLabels } from "@/lib/i18n";

export type SaveInvoiceState = {
  errors: Record<string, string[]> | null;
  success: boolean | null;
  formData: InvoiceFormValues | null;
};

type InvoiceActionState = {
  error: string | null;
  success: boolean;
};

export async function saveInvoiceAction(
  prevState: SaveInvoiceState,
  action: InvoiceFormValues
): Promise<SaveInvoiceState> {
  const labels = await getServerLabels();
  const id = action.id;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      ...prevState,
      success: false,
      formData: action,
      errors: {
        auth: [authMessages.authenticationRequired],
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
            invoice: [labels.errors.notFound],
          },
          success: false,
          formData: action,
        };
      }

      if (existingInvoice.status === "Paid") {
        return {
          ...prevState,
          errors: {
            invoice: [labels.errors.paidEdit],
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
              labels.errors.validation,
            ],
          },
          success: false,
          formData: action,
        };
      }
      const updatedInvoice = await invoiceService.updateInvoice(
        id!,
        parsed.data
      );
      if (!updatedInvoice) {
        return {
          ...prevState,
          errors: {
            invoice: [labels.errors.notFound],
          },
          success: false,
          formData: action,
        };
      }
      revalidatePath("/auth/invoices");
      revalidatePath(`/auth/invoices/${id}`);
    } else {
      const parsed = await invoiceCreateSchema.safeParseAsync(action);
      if (!parsed.success) {
        return {
          ...prevState,
          errors: {
            validation: [
              labels.errors.validation,
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
  } catch (error) {
    if (error instanceof InvoiceServiceConflictError) {
      return {
        success: false,
        formData: action,
        errors: {
          invoice: [error.message.includes("оплач") ? labels.errors.paidEdit : error.message.includes("уже есть") ? labels.errors.alreadyInvoiced : labels.errors.closedInvoice],
        },
      };
    }

    console.error("Server error:", error);

    return {
      success: false,
      formData: action,
      errors: {
        db: [labels.errors.database],
      },
    };
  }
}

export async function markInvoicePaidAction(
  invoiceId: number
): Promise<InvoiceActionState> {
  const labels = await getServerLabels();
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      error: authMessages.authenticationRequired,
      success: false,
    };
  }

  if (!Number.isInteger(invoiceId)) {
    return {
      error: labels.errors.invalid,
      success: false,
    };
  }

  try {
    const updatedInvoice = await invoiceService.updateInvoice(invoiceId, {
      id: invoiceId,
      status: "Paid",
    });

    if (!updatedInvoice) {
      return {
        error: labels.errors.notFound,
        success: false,
      };
    }

    revalidatePath("/auth/invoices");
    revalidatePath(`/auth/invoices/${invoiceId}`);
    if (updatedInvoice.repairId) {
      revalidatePath("/auth/repairs");
      revalidatePath(`/auth/repairs/${updatedInvoice.repairId}`);
    }
    return { error: null, success: true };
  } catch (error) {
    if (error instanceof InvoiceServiceConflictError) {
      return {
        error: error.message.includes("оплач") ? labels.errors.paidInvoice : labels.errors.closedInvoice,
        success: false,
      };
    }

    return {
      error: labels.errors.database,
      success: false,
    };
  }
}

export async function deleteInvoiceAction(
  invoiceId: number
): Promise<InvoiceActionState> {
  const labels = await getServerLabels();
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      error: authMessages.authenticationRequired,
      success: false,
    };
  }

  if (!Number.isInteger(invoiceId)) {
    return {
      error: labels.errors.invalid,
      success: false,
    };
  }

  try {
    const deletedInvoice = await invoiceService.deleteInvoice(invoiceId);

    if (!deletedInvoice) {
      return {
        error: labels.errors.notFound,
        success: false,
      };
    }

    revalidatePath("/auth/invoices");
    revalidatePath(`/auth/invoices/${invoiceId}`);
    return { error: null, success: true };
  } catch (error) {
    if (error instanceof InvoiceServiceConflictError) {
      return {
        error: error.message.includes("оплач") ? labels.errors.paidInvoice : labels.errors.closedInvoice,
        success: false,
      };
    }

    return {
      error: labels.errors.database,
      success: false,
    };
  }
}
