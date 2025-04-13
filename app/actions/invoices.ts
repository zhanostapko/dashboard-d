"use server";

// import prisma from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import {  InvoiceItem, InvoiceStatus,  } from "@prisma/client";

export type SaveInvoiceState = {
  errors: Record<string, string[]> | null;
  success: boolean | null;
  formData: Record<string, string | number | null>;
};

const invoiceItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  unit: z.string().min(1, "Unit is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be positive"),
  total: z.number().min(0, "Total must be positive"),
});

const invoiceSchema = z.object({
  date: z.string().min(1, "Date is required"),
  clientName: z.string().min(1, "Client name is required"),
  clientRegNr: z.string().min(1, "Client registration number is required"),
  clientAddress: z.string().min(1, "Client address is required"),
  clientBank: z.string().min(1, "Client bank is required"),
  clientBankCode: z.string().min(1, "Client bank code is required"),
  clientAccount: z.string().min(1, "Client account is required"),
  clientEmail: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  carBrand: z.string().min(1, "Car brand is required"),
  carModel: z.string().min(1, "Car model is required"),
  carPlate: z.string().min(1, "Car plate is required"),
  items: z
    .array(invoiceItemSchema)
    .default([])
    .superRefine((val, ctx) => {
      if (val.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one item is required",
          path: ["items"],
        });
      }
    }),
});

export async function saveInvoiceAction(
  prevState: SaveInvoiceState,
  action: FormData
): Promise<SaveInvoiceState> {
  const formDataObject = Object.fromEntries(action.entries());

  const sanitizedFormData: Record<string, string | number | null> =
    Object.fromEntries(
      Object.entries(formDataObject).map(([key, value]) => [
        key,
        value instanceof File ? null : value.toString(),
      ])
    );

  let itemsData: InvoiceItem[] = [];
  try {
    itemsData = JSON.parse(sanitizedFormData["items"] as string);
  } catch (error) {
    return {
      ...prevState,
      errors: { items: ["Invalid items format"] },
      success: false,
      formData: sanitizedFormData,
    };
  }

  const parsed = await invoiceSchema.safeParseAsync({
    ...sanitizedFormData,
    items: itemsData,
  });

  if (!parsed.success) {
    return {
      ...prevState,
      errors: parsed.error.flatten().fieldErrors,
      success: false,
      formData: sanitizedFormData,
    };
  }

  const id = sanitizedFormData["id"] ? Number(sanitizedFormData["id"]) : null;

  const baseData = {
    number: sanitizedFormData["number"]?.toString() || null,
    date: new Date(sanitizedFormData["date"] ? sanitizedFormData["date"] : ""),
    total: parseFloat(sanitizedFormData["total"]?.toString() || "0"),
    supplier: {
      connect: { id: Number(sanitizedFormData["supplierId"]) || 1 },
    },
    client: sanitizedFormData["clientId"]
      ? { connect: { id: Number(sanitizedFormData["clientId"]) } }
      : undefined,

    clientName: sanitizedFormData["clientName"]?.toString() || null,
    clientRegNr: sanitizedFormData["clientRegNr"]?.toString() || null,
    clientAddress: sanitizedFormData["clientAddress"]?.toString() || null,
    clientEmail: sanitizedFormData["clientEmail"]?.toString() || null,
    clientPhone: sanitizedFormData["clientPhone"]?.toString() || null,
    clientBank: sanitizedFormData["clientBank"]?.toString() || null,
    clientBankCode: sanitizedFormData["clientBankCode"]?.toString() || null,
    clientAccount: sanitizedFormData["clientAccount"]?.toString() || null,
    carBrand: sanitizedFormData["carBrand"]?.toString() || "",
    carModel: sanitizedFormData["carModel"]?.toString() || "",
    carPlate: sanitizedFormData["carPlate"]?.toString() || "",
    status:
      (sanitizedFormData["status"] as InvoiceStatus) === "LOCKED"
        ? InvoiceStatus.LOCKED
        : InvoiceStatus.EDITABLE,
  };

  try {
    if (id) {
      await prisma.invoice.update({
        where: { id },
        data: {
          ...baseData,
          items: {
            deleteMany: {},
            create: itemsData.map((item) => ({
              name: item.name,
              unit: item.unit,
              quantity: item.quantity,
              price: item.price,
              total: item.total,
            })),
          },
        },
      });
    } else {
      await prisma.invoice.create({
        data: {
          ...baseData,
          items: {
            create: itemsData.map((item) => ({
              name: item.name,
              unit: item.unit,
              quantity: item.quantity,
              price: item.price,
              total: item.total,
            })),
          },
        },
      });
    }

    revalidatePath("/invoices");
    return { errors: null, success: true, formData: {} };
  } catch (error) {
    return {
      errors: {
        general: [`Database error occurred. ${(error as Error).message}`],
      },
      success: false,
      formData: sanitizedFormData,
    };
  }
}
