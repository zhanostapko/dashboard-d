import { Invoice } from "@prisma/client";
import prisma from "./db";

export type InvoicePreview = Pick<
  Invoice,
  "id" | "total" | "clientName" | "number" | "date" | "carPlate" | "status"
>;

export const invoiceNumberGenerate = async () => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const formattedMonth = month < 10 ? `0${month}` : month;
  const postfix = `-${formattedMonth}${now.getFullYear()}`;

  const invoiceNumbers = await prisma.invoice.findMany({
    where: {
      number: {
        endsWith: postfix,
      },
    },
    select: {
      number: true,
    },
  });
  const maxNumber = invoiceNumbers.reduce((currentMax, invoice) => {
    if (!invoice.number) {
      return currentMax;
    }

    const parsedNumber = Number.parseInt(invoice.number.replace(postfix, ""), 10);
    return Number.isNaN(parsedNumber)
      ? currentMax
      : Math.max(currentMax, parsedNumber);
  }, 0);

  return `${maxNumber + 1}${postfix}`;
};
