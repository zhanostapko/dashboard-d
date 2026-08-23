"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/authz";
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
      const parsed = await repairUpdateSchema.safeParseAsync(action);
      if (!parsed.success) {
        return {
          ...prevState,
          errors: {
            validation: [
              "Произошла ошибка валидации. Пожалуйста, проверьте данные и попробуйте снова.",
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
            repair: ["Repair not found."],
          },
          success: false,
          formData: action,
        };
      }
      revalidatePath("/auth/repairs");
    } else {
      const parsed = await repairCreateSchema.safeParseAsync(action);
      if (!parsed.success) {
        return {
          ...prevState,
          errors: {
            validation: [
              "Произошла ошибка валидации. Пожалуйста, проверьте данные и попробуйте снова.",
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
  } catch (err) {
    console.error("Server error:", err);

    return {
      success: false,
      formData: action,
      errors: {
        db: ["На сервере произошла ошибка. Пожалуйста, попробуйте позже."],
      },
    };
  }
}
