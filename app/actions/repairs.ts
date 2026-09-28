"use server";

import type { RepairFormValues } from "@/modules/repairs/schema";

export type SaveRepairState = {
  errors: Record<string, string[]> | null;
  success: boolean | null;
  formData: RepairFormValues | null;
};

export async function saveRepairAction(
  prevState: SaveRepairState,
  action: RepairFormValues
): Promise<SaveRepairState> {
  // Temporarily disabled during the focused users/auth/shared refactor.
  return {
    ...prevState,
    success: false,
    formData: action,
    errors: {
      repair: ["Ремонты временно отключены на время рефакторинга."],
    },
  };
}
