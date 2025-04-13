"use server";

export type InvoicePreview = Pick<
  Invoice,
  "id" | "total" | "clientName" | "number" | "date" | "carPlate" | "status"
>;
import { Invoice } from "@prisma/client";
import prisma from "./db";

export const invoiceNumberGenerate = async () => {
  const now = new Date();
  const prefix = `${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-`;

  const lastInvoice = await prisma.invoice.findFirst({
    where: {
      number: {
        startsWith: prefix,
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
    const lastNumber = parseInt(lastInvoice.number.replace(prefix, ""));
    if (!isNaN(lastNumber)) {
      newNumber = lastNumber + 1;
    }
  }

  const newInvoiceNumber = `${prefix}${newNumber}`;

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
    include: { items: true },
  });
};
