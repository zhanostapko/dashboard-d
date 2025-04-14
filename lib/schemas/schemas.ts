import { z } from "zod";

const invoiceItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  unit: z.string().min(1, "Unit is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be positive"),
  total: z.number().min(0, "Total must be positive"),
});

export const invoiceSchema = z.object({
  id: z.number().optional(),
  number: z.string().min(1, "Invoice number is required"),
  date: z.string().min(1, "Date is required"),
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
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),

  total: z.number().min(1, "Total must be grater than 0"),
});
