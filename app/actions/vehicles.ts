"use server";

import { revalidatePath } from "next/cache";
import { authMessages } from "@/lib/auth-messages";
import { getCurrentUser } from "@/lib/authz";
import { vehicleService } from "@/modules/vehicles/service";

type AttachVehicleState = {
  error: string | null;
  success: boolean;
};

export async function attachVehicleToClientAction(
  vehicleId: number,
  clientId: number
): Promise<AttachVehicleState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return { error: authMessages.authenticationRequired, success: false };
  }

  if (!Number.isInteger(vehicleId) || !Number.isInteger(clientId)) {
    return { error: "Некорректная машина или клиент.", success: false };
  }

  try {
    const attachedVehicle = await vehicleService.attachVehicleToClient(
      vehicleId,
      clientId
    );

    if (!attachedVehicle) {
      return { error: "Машина не найдена.", success: false };
    }

    revalidatePath(`/auth/clients/${clientId}`);
    revalidatePath("/auth/clients");
    revalidatePath("/auth/repairs/new");
    return { error: null, success: true };
  } catch (error) {
    return {
      error: `Не удалось прикрепить машину: ${(error as Error).message}`,
      success: false,
    };
  }
}
