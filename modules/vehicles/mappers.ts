import { Prisma, Vehicle } from "@prisma/client";
import { VehicleCreateDto, VehicleDetailDto, VehicleDto } from "./schema";
import type { VehicleWithRelations } from "./repository";
import { toRepairDto } from "@/modules/repairs/mappers";

const normalizeOptionalText = (value: string | null | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

export const toVehicleDto = (vehicle: Vehicle): VehicleDto => ({
  id: vehicle.id,
  brand: vehicle.brand,
  model: vehicle.model,
  plate: vehicle.plate ?? undefined,
  vin: vehicle.vin ?? undefined,
});

export const toVehicleDetailDto = (
  vehicle: VehicleWithRelations
): VehicleDetailDto => ({
  ...toVehicleDto(vehicle),
  owners: vehicle.clients.map((client) => ({
    id: client.id,
    name: client.name,
  })),
  repairs: vehicle.repairs.map(toRepairDto),
});

export const toVehicleCreateEntity = (
  dto: VehicleCreateDto
): Prisma.VehicleCreateInput => ({
  brand: dto.brand.trim(),
  model: dto.model.trim(),
  plate: normalizeOptionalText(dto.plate),
  vin: normalizeOptionalText(dto.vin),
});
