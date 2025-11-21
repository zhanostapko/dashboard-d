import { z } from "zod";

const invoiceItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  unit: z.string().min(1, "Unit is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(1, "Price must be positive"),
  total: z.number().min(1, "Total must be positive"),
});

const baseInvoiceFields = {
  number: z.string().min(1, "Invoice number is required"),
  date: z.string().min(1, "Date is required"),
  clientName: z.string().min(1, "Client name is required"),
  clientRegNr: z.string().min(1, "Client registration number is required"),
  clientAddress: z.string().min(1, "Client address is required"),
  clientBank: z.string().min(1, "Client bank is required"),
  clientBankCode: z.string().min(1, "Client bank code is required"),
  clientAccount: z.string().min(1, "Client account is required"),
  clientPhone: z.string().optional(),
  clientEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  carBrand: z.string().min(1, "Car brand is required"),
  carModel: z.string().min(1, "Car model is required"),
  carPlate: z.string().min(1, "Car plate is required"),
  carMileage: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
  paymentType: z.enum(["Cash", "NonCash"]),
  total: z.number().min(1, "Total must be greater than 0"),
};

export const invoiceSchema = z.object({
  id: z.number().optional(),
  ...baseInvoiceFields,
});

export const invoiceCreateSchema = z.object(baseInvoiceFields);

export const invoiceUpdateSchema = invoiceCreateSchema.partial().extend({
  id: z.number(),
});

export type InvoiceItemDto = z.infer<typeof invoiceItemSchema>;
export type InvoiceDto = z.infer<typeof invoiceSchema>;
export type InvoiceCreateDto = z.infer<typeof invoiceCreateSchema>;
export type InvoiceUpdateDto = z.infer<typeof invoiceUpdateSchema>;
