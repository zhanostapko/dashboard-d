"use server";

import { revalidatePath } from "next/cache";
import {
  repairCreateSchema,
  RepairFormValues,
  repairUpdateSchema,
} from "@/modules/repairs/schema";
import { repairService } from "@/modules/repairs/service";

export type SaveRepairState = {
  errors: Record<string, string[]> | null;
  success: boolean | null;
  formData: RepairFormValues | null;
};

export async function saveRepairAction(
  prevState: SaveRepairState,
  action: RepairFormValues
): Promise<SaveRepairState> {
  const id = action.id;

  try {
    if (Number.isInteger(id) && id !== 0) {
      const parsed = await repairUpdateSchema.safeParseAsync(action);
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
      await repairService.updateRepair(id!, parsed.data);
      revalidatePath("/repairs");
    } else {
      const parsed = await repairCreateSchema.safeParseAsync(action);
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
      await repairService.createRepair(parsed.data);
      revalidatePath("/repairs");
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
