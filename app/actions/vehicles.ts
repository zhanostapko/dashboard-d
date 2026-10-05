"use server";

import { revalidatePath } from "next/cache";
import { authMessages } from "@/lib/auth-messages";
import { getCurrentUser } from "@/lib/authz";
import { vehicleService } from "@/modules/vehicles/service";
import { getServerLabels } from "@/lib/i18n";
import { VehicleDto, vehicleCreateSchema } from "@/modules/vehicles/schema";

type AttachVehicleState = {
  error: string | null;
  success: boolean;
};

type SaveVehicleState = {
  error: string | null;
  success: string | null;
  vehicle: Partial<VehicleDto> | null;
};

const getFormValue = (payload: FormData, key: string) =>
  String(payload.get(key) ?? "");

export async function saveVehicleAction(
  _prevState: SaveVehicleState,
  payload: FormData
): Promise<SaveVehicleState> {
  const labels = await getServerLabels();
  const brand = getFormValue(payload, "brand");
  const model = getFormValue(payload, "model");
  const plate = getFormValue(payload, "plate");
  const vin = getFormValue(payload, "vin");
  const vehicle = { brand, model, plate, vin };
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      error: authMessages.authenticationRequired,
      success: null,
      vehicle,
    };
  }

  const parsed = await vehicleCreateSchema.safeParseAsync(vehicle);
  if (!parsed.success) {
    return {
      error: parsed.error.issues.map((issue) => issue.message).join(", "),
      success: null,
      vehicle,
    };
  }

  try {
    await vehicleService.createVehicle(parsed.data);
    revalidatePath("/auth/vehicles");
    revalidatePath("/auth/clients");
    revalidatePath("/auth/repairs/new");
    return { error: null, success: labels.common.saved, vehicle: null };
  } catch (error) {
    return {
      error: labels.errors.database ?? `Database error: ${(error as Error).message}`,
      success: null,
      vehicle,
    };
  }
}

export async function attachVehicleToClientAction(
  vehicleId: number,
  clientId: number
): Promise<AttachVehicleState> {
  const labels = await getServerLabels();
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return { error: authMessages.authenticationRequired, success: false };
  }

  if (!Number.isInteger(vehicleId) || !Number.isInteger(clientId)) {
    return { error: labels.errors.invalid, success: false };
  }

  try {
    const attachedVehicle = await vehicleService.attachVehicleToClient(
      vehicleId,
      clientId
    );

    if (!attachedVehicle) {
      return { error: labels.errors.notFound, success: false };
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
