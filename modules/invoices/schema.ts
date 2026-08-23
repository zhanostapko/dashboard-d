import { z } from "zod";

export const invoiceItemCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  unit: z.string().min(1, "Unit is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(1, "Price must be positive"),
  total: z.number().min(1, "Total must be positive"),
});

export const invoiceItemSchema = invoiceItemCreateSchema.extend({
  id: z.number(),
});

const baseInvoiceFields = {
  number: z.string().min(1, "Invoice number is required"),
  date: z.string().min(1, "Date is required"),
  supplierId: z.number().optional(),
  status: z.enum(["Paid", "Unpaid"]).default("Unpaid"),
  clientName: z.string().min(1, "Client name is required"),
  clientRegNr: z.string().min(1, "Client registration number is required"),
  clientAddress: z.string().min(1, "Client address is required"),
  clientBank: z.string().min(1, "Client bank is required"),
  clientBankCode: z.string().min(1, "Client bank code is required"),
  clientAccount: z.string().min(1, "Client account is required"),
  clientPhone: z.string().optional(),
  clientEmail: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  carBrand: z.string().min(1, "Car brand is required"),
  carModel: z.string().min(1, "Car model is required"),
  carPlate: z.string().min(1, "Car plate is required"),
  carMileage: z.string().optional(),
  items: z
    .array(invoiceItemCreateSchema)
    .min(1, "Нужно добавить хотя бы одну позицию."),
  paymentType: z.enum(["Cash", "NonCash"]),
  total: z.number().min(1, "Total must be greater than 0"),
};

const supplierSchema = z.object({
  id: z.number(),
  name: z.string(),
  regNr: z.string(),
  phone: z.string().nullable(),
  bank: z.string(),
  code: z.string().nullable(),
  account: z.string(),
});

export const invoiceSchema = z.object({
  id: z.number(),
  createdAt: z.string().optional(),
  ...baseInvoiceFields,
  items: z.array(invoiceItemSchema).min(1, "Нужно добавить хотя бы одну позицию."),
});

export const invoiceDetailsSchema = invoiceSchema.extend({
  supplier: supplierSchema,
});

export const invoiceCreateSchema = z.object(baseInvoiceFields);

export const invoiceUpdateSchema = invoiceCreateSchema.partial().extend({
  id: z.number(),
  supplierId: z.number().optional(),
});

const invoiceItemFormSchema = invoiceItemCreateSchema.extend({
  id: z.number().optional(),
});

export const invoiceFormSchema = z.object({
  id: z.number().optional(),
  number: z.string().min(1, "Invoice number is required"),
  date: z.string().min(1, "Date is required"),
  supplierId: z.number().optional(),
  clientName: z.string().min(1, "Client name is required"),
  clientRegNr: z.string().min(1, "Client registration number is required"),
  clientAddress: z.string().min(1, "Client address is required"),
  clientBank: z.string().min(1, "Client bank is required"),
  clientBankCode: z.string().min(1, "Client bank code is required"),
  clientAccount: z.string().min(1, "Client account is required"),
  clientPhone: z.string().optional(),
  clientEmail: z.string().email().optional().or(z.literal("")),
  carBrand: z.string().min(1, "Car brand is required"),
  carModel: z.string().min(1, "Car model is required"),
  carPlate: z.string().min(1, "Car plate is required"),
  carMileage: z.string().optional(),
  paymentType: z.enum(["Cash", "NonCash"]),
  items: z.array(invoiceItemFormSchema).min(1, "Нужно добавить хотя бы одну позицию."),
  total: z.number().min(1, "Total must be greater than 0"),
});
export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

export type InvoiceItemCreateDto = z.infer<typeof invoiceItemCreateSchema>;
export type InvoiceItemDto = z.infer<typeof invoiceItemSchema>;
export type InvoiceDto = z.infer<typeof invoiceSchema>;
export type InvoiceDetailsDto = z.infer<typeof invoiceDetailsSchema>;
export type InvoiceCreateDto = z.infer<typeof invoiceCreateSchema>;
export type InvoiceUpdateDto = z.infer<typeof invoiceUpdateSchema>;
