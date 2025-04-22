"use server";

export type InvoicePreview = Pick<
  Invoice,
  "id" | "total" | "clientName" | "number" | "date" | "carPlate" | "status"
>;
import { Invoice } from "@prisma/client";
import prisma from "./db";

export const invoiceNumberGenerate = async () => {
  const now = new Date();
  const postfix = `-${now.getFullYear()}`;

  const lastInvoice = await prisma.invoice.findFirst({
    where: {
      number: {
        endsWith: postfix,
      },
    },
    select: {
      number: true,
    },
    orderBy: {
      number: "desc",
    },
  });

  let newNumber = 1;

  if (lastInvoice?.number) {
    const lastNumber = parseInt(lastInvoice.number.replace(postfix, ""));
    if (!isNaN(lastNumber)) {
      newNumber = lastNumber + 1;
    }
  }

  const newInvoiceNumber = `${newNumber}${postfix}`;

  return newInvoiceNumber;
};

export const getAllInvoices = async (): Promise<InvoicePreview[]> => {
  return await prisma.invoice.findMany({
    select: {
      id: true,
      total: true,
      clientName: true,
      number: true,
      date: true,
      carPlate: true,
      status: true,
    },
  });
};

export const getInvoice = async (id: number) => {
  return await prisma.invoice.findUnique({
    where: { id },
    include: { items: true, supplier: true },
  });
};
