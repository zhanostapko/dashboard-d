"use server";

import { revalidatePath } from "next/cache";
import { authMessages } from "@/lib/auth-messages";
import { getCurrentUser } from "@/lib/authz";
import { vehicleService } from "@/modules/vehicles/service";
import { getServerLabels } from "@/lib/i18n";
import {
  VehicleDto,
  vehicleCreateSchema,
  vehicleUpdateSchema,
} from "@/modules/vehicles/schema";

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
  const vehicleId = Number(payload.get("vehicleId") ?? 0);
  const vehicle = { brand, model, plate, vin };
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      error: authMessages.authenticationRequired,
      success: null,
      vehicle,
    };
  }

  try {
    if (vehicleId > 0) {
      const parsed = await vehicleUpdateSchema.safeParseAsync({
        ...vehicle,
        id: vehicleId,
      });
      if (!parsed.success) {
        return {
          error: parsed.error.issues.map((issue) => issue.message).join(", "),
          success: null,
          vehicle,
        };
      }
      const updatedVehicle = await vehicleService.updateVehicle(parsed.data);
      if (!updatedVehicle) {
        return { error: labels.errors.notFound, success: null, vehicle };
      }
    } else {
      const parsed = await vehicleCreateSchema.safeParseAsync(vehicle);
      if (!parsed.success) {
        return {
          error: parsed.error.issues.map((issue) => issue.message).join(", "),
          success: null,
          vehicle,
        };
      }
      await vehicleService.createVehicle(parsed.data);
    }
    revalidatePath("/auth/vehicles");
    if (vehicleId > 0) revalidatePath(`/auth/vehicles/${vehicleId}`);
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

export async function deleteVehicleAction(
  vehicleId: number,
): Promise<AttachVehicleState> {
  const labels = await getServerLabels();
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return { error: authMessages.authenticationRequired, success: false };
  }

  if (!Number.isInteger(vehicleId) || vehicleId <= 0) {
    return { error: labels.errors.invalid, success: false };
  }

  try {
    const deletedVehicle = await vehicleService.deleteVehicle(vehicleId);
    if (!deletedVehicle) {
      return { error: labels.errors.notFound, success: false };
    }

    revalidatePath("/auth/vehicles");
    revalidatePath("/auth/clients");
    revalidatePath("/auth/repairs/new");
    revalidatePath(`/auth/vehicles/${vehicleId}`);
    return { error: null, success: true };
  } catch (error) {
    return {
      error: labels.errors.deleteVehicle ?? `Database error: ${(error as Error).message}`,
      success: false,
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

export async function detachVehicleFromClientAction(
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
    const detachedVehicle = await vehicleService.detachVehicleFromClient(
      vehicleId,
      clientId
    );

    if (!detachedVehicle) {
      return { error: labels.errors.notFound, success: false };
    }

    revalidatePath(`/auth/clients/${clientId}`);
    revalidatePath("/auth/clients");
    revalidatePath("/auth/repairs/new");
    revalidatePath(`/auth/vehicles/${vehicleId}`);
    return { error: null, success: true };
  } catch (error) {
    return {
      error: labels.errors.database ?? `Database error: ${(error as Error).message}`,
      success: false,
    };
  }
}
