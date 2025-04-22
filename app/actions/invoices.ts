"use server";

// import prisma from "@/lib/db";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
// import { InvoiceItem, InvoiceStatus } from "@prisma/client";
import { invoiceSchema } from "@/lib/schemas/schemas";
import { z } from "zod";

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;

export type SaveInvoiceState = {
  errors: Record<string, string[]> | null;
  success: boolean | null;
  formData: InvoiceFormValues | null;
};

export async function saveInvoiceAction(
  prevState: SaveInvoiceState,
  action: InvoiceFormValues
): Promise<SaveInvoiceState> {
  const parsedData = await invoiceSchema.safeParseAsync(action);

  if (!parsedData.success) {
    return {
      ...prevState,
      errors: {
        validation: ["Validation error occurred. Please check and try again"],
      },
      success: false,
      formData: action,
    };
  }

  const { id } = parsedData.data;

  const { items, ...baseData } = parsedData.data;

  console.log(baseData, "baseData");

  try {
    if (id !== 0 || id) {
      // update data in db
      await prisma.invoice.update({
        where: { id },
        data: {
          ...baseData,
          date: new Date(baseData.date),
          items: {
            deleteMany: {},
            create: items.map((item) => ({
              name: item.name,
              unit: item.unit,
              quantity: item.quantity,
              price: item.price,
              total: item.total,
            })),
          },
        },
      });
      revalidatePath("/invoices/[invoiceId]");
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...dataWithoutId } = baseData;
      // create data in db
      await prisma.invoice.create({
        data: {
          ...dataWithoutId,
          date: new Date(dataWithoutId.date),
          supplier: { connect: { id: 1 } },
          items: {
            create: items.map((item) => ({
              name: item.name,
              unit: item.unit,
              quantity: item.quantity,
              price: item.price,
              total: item.total,
            })),
          },
        },
      });
      revalidatePath("/invoices");
    }

    // revalidatePath("/invoices");
    return { errors: null, success: true, formData: null };
  } catch (err) {
    console.error("Server error:", err);

    return {
      success: false,
      formData: action,
      errors: {
        db: ["Something went wrong on the server. Please try again later."],
      },
    };
  }
  // const id = sanitizedFormData["id"] ? Number(sanitizedFormData["id"]) : null;
  // const baseData = {
  //   number: sanitizedFormData["number"]?.toString() || null,
  //   date: new Date(sanitizedFormData["date"] ? sanitizedFormData["date"] : ""),
  //   total: parseFloat(sanitizedFormData["total"]?.toString() || "0"),
  //   supplier: {
  //     connect: { id: Number(sanitizedFormData["supplierId"]) || 1 },
  //   },
  //   client: sanitizedFormData["clientId"]
  //     ? { connect: { id: Number(sanitizedFormData["clientId"]) } }
  //     : undefined,
  //   clientName: sanitizedFormData["clientName"]?.toString() || null,
  //   clientRegNr: sanitizedFormData["clientRegNr"]?.toString() || null,
  //   clientAddress: sanitizedFormData["clientAddress"]?.toString() || null,
  //   clientEmail: sanitizedFormData["clientEmail"]?.toString() || null,
  //   clientPhone: sanitizedFormData["clientPhone"]?.toString() || null,
  //   clientBank: sanitizedFormData["clientBank"]?.toString() || null,
  //   clientBankCode: sanitizedFormData["clientBankCode"]?.toString() || null,
  //   clientAccount: sanitizedFormData["clientAccount"]?.toString() || null,
  //   carBrand: sanitizedFormData["carBrand"]?.toString() || "",
  //   carModel: sanitizedFormData["carModel"]?.toString() || "",
  //   carPlate: sanitizedFormData["carPlate"]?.toString() || "",
  //   status:
  //     (sanitizedFormData["status"] as InvoiceStatus) === "LOCKED"
  //       ? InvoiceStatus.LOCKED
  //       : InvoiceStatus.EDITABLE,
  // };
  // try {
  //   if (id) {
  //     await prisma.invoice.update({
  //       where: { id },
  //       data: {
  //         ...baseData,
  //         items: {
  //           deleteMany: {},
  //           create: itemsData.map((item) => ({
  //             name: item.name,
  //             unit: item.unit,
  //             quantity: item.quantity,
  //             price: item.price,
  //             total: item.total,
  //           })),
  //         },
  //       },
  //     });
  //   } else {
  //     await prisma.invoice.create({
  //       data: {
  //         ...baseData,
  //         items: {
  //           create: itemsData.map((item) => ({
  //             name: item.name,
  //             unit: item.unit,
  //             quantity: item.quantity,
  //             price: item.price,
  //             total: item.total,
  //           })),
  //         },
  //       },
  //     });
  //   }
  //   revalidatePath("/invoices");
  //   return { errors: null, success: true, formData: {} };
  // } catch (error) {
  // return {
  //   errors: {
  //     general: [`Database error occurred. ${(error as Error).message}`],
  //   },
  //   success: false,
  //   formData: sanitizedFormData,
  // };
  // }
}
