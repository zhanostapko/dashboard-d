import { z } from "zod";
import type { RepairDto } from "@/modules/repairs/schema";

const baseVehicleFields = {
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  plate: z.string().optional(),
  vin: z.string().optional(),
};

export const vehicleSchema = z.object({
  id: z.number(),
  ...baseVehicleFields,
});

export const vehicleCreateSchema = z.object(baseVehicleFields);

export const vehicleUpdateSchema = vehicleCreateSchema.extend({
  id: z.number().int().positive(),
});

export type VehicleDto = z.infer<typeof vehicleSchema>;
export type VehicleCreateDto = z.infer<typeof vehicleCreateSchema>;
export type VehicleUpdateDto = z.infer<typeof vehicleUpdateSchema>;
export type VehicleOwnerDto = { id: number; name: string };
export type VehicleDetailDto = VehicleDto & {
  owners: VehicleOwnerDto[];
  repairs: RepairDto[];
};
