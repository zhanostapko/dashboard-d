"use server";

// import prisma from "@/lib/db";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
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
}
