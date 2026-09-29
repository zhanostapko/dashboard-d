import { z } from "zod";

export const repairItemTypeSchema = z.enum(["work", "materials"], {
  required_error: "Type is required",
  invalid_type_error: "Type is required",
});

export const repairItemCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  unit: repairItemTypeSchema,
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be positive"),
});

export const repairItemSchema = repairItemCreateSchema.extend({
  id: z.number(),
});

const baseRepairFields = {
  date: z.string().min(1, "Date is required"),
  clientName: z.string().min(1, "Client name is required"),
  clientPhone: z.string().optional(),
  carBrand: z.string().min(1, "Car brand is required"),
  carModel: z.string().min(1, "Car model is required"),
  carPlate: z.string().min(1, "Car plate is required"),
  carMileage: z.string().optional(),
  items: z.array(repairItemCreateSchema).min(1, "Нужно добавить хотя бы одну позицию."),
};

export const repairSchema = z.object({
  id: z.number(),
  clientId: z.number().nullable().optional(),
  createdAt: z.string().optional(),
  ...baseRepairFields,
  items: z.array(repairItemSchema).min(1, "Нужно добавить хотя бы одну позицию."),
});

export const repairCreateSchema = z.object({
  clientId: z.number().optional(),
  ...baseRepairFields,
});

export const repairUpdateSchema = repairCreateSchema.partial().extend({
  id: z.number(),
});

const repairItemFormSchema = repairItemCreateSchema.extend({
  id: z.number().optional(),
});

export const repairFormSchema = z.object({
  id: z.number().optional(),
  clientId: z.number().optional(),
  date: z.string().min(1, "Date is required"),
  clientName: z.string().min(1, "Client name is required"),
  clientPhone: z.string().optional(),
  carBrand: z.string().min(1, "Car brand is required"),
  carModel: z.string().min(1, "Car model is required"),
  carPlate: z.string().min(1, "Car plate is required"),
  carMileage: z.string().optional(),
  items: z.array(repairItemFormSchema).min(1, "Нужно добавить хотя бы одну позицию."),
});

export type RepairFormValues = z.infer<typeof repairFormSchema>;
export type RepairItemType = z.infer<typeof repairItemTypeSchema>;
export type RepairItemCreateDto = z.infer<typeof repairItemCreateSchema>;
export type RepairItemDto = z.infer<typeof repairItemSchema>;
export type RepairDto = z.infer<typeof repairSchema>;
export type RepairCreateDto = z.infer<typeof repairCreateSchema>;
export type RepairUpdateDto = z.infer<typeof repairUpdateSchema>;
