"use server";

import { revalidatePath } from "next/cache";
import { authMessages } from "@/lib/auth-messages";
import { getCurrentUser } from "@/lib/authz";
import {
  repairCreateSchema,
  RepairFormValues,
  repairUpdateSchema,
} from "@/modules/repairs/schema";
import {
  RepairServiceConflictError,
  repairService,
} from "@/modules/repairs/service";
import { getServerLabels } from "@/lib/i18n";

export type SaveRepairState = {
  errors: Record<string, string[]> | null;
  success: boolean | null;
  formData: RepairFormValues | null;
};

type RepairActionState = {
  error: string | null;
  success: boolean;
};

export async function saveRepairAction(
  prevState: SaveRepairState,
  action: RepairFormValues
): Promise<SaveRepairState> {
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
      const existingRepair = await repairService.getRepairById(id!);

      if (!existingRepair) {
        return {
          ...prevState,
          errors: {
            repair: [labels.errors.notFound],
          },
          success: false,
          formData: action,
        };
      }

      const parsed = await repairUpdateSchema.safeParseAsync(action);

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

      const updatedRepair = await repairService.updateRepair(id!, parsed.data);

      if (!updatedRepair) {
        return {
          ...prevState,
          errors: {
            repair: [labels.errors.notFound],
          },
          success: false,
          formData: action,
        };
      }

      revalidatePath("/auth/repairs");
      revalidatePath(`/auth/repairs/${id}`);
    } else {
      const parsed = await repairCreateSchema.safeParseAsync(action);

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

      await repairService.createRepair(parsed.data);
      revalidatePath("/auth/repairs");
    }

    return { errors: null, success: true, formData: null };
  } catch (error) {
    if (error instanceof RepairServiceConflictError) {
      return {
        success: false,
        formData: action,
        errors: { repair: [error.message.includes("неоплачен") ? labels.errors.unpaidClose : labels.errors.closedRepair] },
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

export async function deleteRepairAction(
  repairId: number
): Promise<RepairActionState> {
  const labels = await getServerLabels();
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      error: authMessages.authenticationRequired,
      success: false,
    };
  }

  if (!Number.isInteger(repairId)) {
    return {
      error: labels.errors.invalid,
      success: false,
    };
  }

  try {
    const deletedRepair = await repairService.deleteRepair(repairId);

    if (!deletedRepair) {
      return {
        error: labels.errors.notFound,
        success: false,
      };
    }

    revalidatePath("/auth/repairs");
    revalidatePath(`/auth/repairs/${repairId}`);
    return { error: null, success: true };
  } catch (error) {
    if (error instanceof RepairServiceConflictError) {
      return {
        error: error.message.includes("привязанным счетом")
          ? labels.errors.linkedInvoiceRepair
          : error.message.includes("неоплачен")
            ? labels.errors.unpaidClose
            : labels.errors.closedRepair,
        success: false,
      };
    }
    return {
      error: labels.errors.database,
      success: false,
    };
  }
}

export async function closeRepairAction(
  repairId: number
): Promise<RepairActionState> {
  const labels = await getServerLabels();
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return { error: authMessages.authenticationRequired, success: false };
  }

  if (!Number.isInteger(repairId)) {
    return { error: labels.errors.invalid, success: false };
  }

  try {
    const closedRepair = await repairService.closeRepair(repairId);
    if (!closedRepair) return { error: labels.errors.notFound, success: false };

    revalidatePath("/auth/repairs");
    revalidatePath(`/auth/repairs/${repairId}`);
    return { error: null, success: true };
  } catch (error) {
    if (error instanceof RepairServiceConflictError) {
      return {
        error: error.message.includes("привязанным счетом")
          ? labels.errors.linkedInvoiceRepair
          : error.message.includes("неоплачен")
            ? labels.errors.unpaidClose
            : labels.errors.closedRepair,
        success: false,
      };
    }
    return {
      error: labels.errors.database,
      success: false,
    };
  }
}

export async function reopenRepairAction(
  repairId: number
): Promise<RepairActionState> {
  const labels = await getServerLabels();
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return { error: authMessages.authenticationRequired, success: false };
  }

  if (!Number.isInteger(repairId)) {
    return { error: labels.errors.invalid, success: false };
  }

  try {
    const reopenedRepair = await repairService.reopenRepair(repairId);
    if (!reopenedRepair) return { error: labels.errors.notFound, success: false };

    revalidatePath("/auth/repairs");
    revalidatePath(`/auth/repairs/${repairId}`);
    return { error: null, success: true };
  } catch (error) {
    if (error instanceof RepairServiceConflictError) {
      return {
        error: error.message.includes("оплаченным счетом")
          ? labels.errors.paidRepairReopen
          : labels.errors.closedRepair,
        success: false,
      };
    }

    return { error: labels.errors.database, success: false };
  }
}
