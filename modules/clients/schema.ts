import { z } from "zod";

const baseClientFields = {
  name: z.string().min(1, "Name is required"),
  regNr: z.string().optional(),
  address: z.string().optional(),
  bank: z.string().optional(),
  bankCode: z.string().optional(),
  account: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
};

export const clientSchema = z.object({
  id: z.number(),
  ...baseClientFields,
});

export const clientCreateSchema = z.object(baseClientFields);
export const clientUpdateSchema = z.object({
  id: z.number(),
  name: baseClientFields.name.optional(),
  regNr: baseClientFields.regNr.optional(),
  address: baseClientFields.address.optional(),
  bank: baseClientFields.bank.optional(),
  bankCode: baseClientFields.bankCode.optional(),
  account: baseClientFields.account.optional(),
  phone: baseClientFields.phone.optional(),
  email: baseClientFields.email.optional(),
});

export type ClientDto = z.infer<typeof clientSchema>;
export type ClientCreateDto = z.infer<typeof clientCreateSchema>;
export type ClientUpdateDto = z.infer<typeof clientUpdateSchema>;
