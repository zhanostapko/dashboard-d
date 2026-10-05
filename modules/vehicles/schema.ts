import { z } from "zod";

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

export type VehicleDto = z.infer<typeof vehicleSchema>;
export type VehicleCreateDto = z.infer<typeof vehicleCreateSchema>;
