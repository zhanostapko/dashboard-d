import { z } from "zod";

export const repairItemTypeSchema = z.enum(["work", "materials"], {
  required_error: "Укажите тип позиции.",
  invalid_type_error: "Укажите тип позиции.",
});

export const repairItemCreateSchema = z.object({
  name: z.string().min(1, "Введите наименование позиции."),
  unit: repairItemTypeSchema,
  quantity: z
    .number({
      required_error: "Введите количество.",
      invalid_type_error: "Количество должно быть числом.",
    })
    .min(1, "Количество должно быть не менее 1."),
  price: z
    .number({
      required_error: "Введите цену.",
      invalid_type_error: "Цена должна быть числом.",
    })
    .min(0, "Цена не может быть отрицательной."),
});

export const repairItemSchema = repairItemCreateSchema.extend({
  id: z.number(),
});

const baseRepairFields = {
  date: z.string().min(1, "Укажите дату ремонта."),
  clientName: z.string().min(1, "Введите имя клиента."),
  clientPhone: z.string().optional(),
  carBrand: z.string().min(1, "Введите марку автомобиля."),
  carModel: z.string().min(1, "Введите модель автомобиля."),
  carPlate: z.string().optional(),
  carMileage: z.string().optional(),
  items: z.array(repairItemCreateSchema).min(1, "Нужно добавить хотя бы одну позицию."),
};

export const repairSchema = z.object({
  id: z.number(),
  clientId: z.number().nullable().optional(),
  vehicleId: z.number().nullable().optional(),
  invoiceId: z.number().nullable().optional(),
  status: z.enum(["Open", "Closed"]),
  createdAt: z.string().optional(),
  ...baseRepairFields,
  items: z.array(repairItemSchema).min(1, "Нужно добавить хотя бы одну позицию."),
});

export const repairCreateSchema = z.object({
  clientId: z.number().optional(),
  vehicleId: z.number().optional(),
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
  vehicleId: z.number().optional(),
  date: z.string().min(1, "Укажите дату ремонта."),
  clientName: z.string().min(1, "Введите имя клиента."),
  clientPhone: z.string().optional(),
  carBrand: z.string().min(1, "Введите марку автомобиля."),
  carModel: z.string().min(1, "Введите модель автомобиля."),
  carPlate: z.string().optional(),
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
