import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { InvoiceWithItems, InvoiceWithItemsAndSupplier } from "./mappers";

export const invoiceRepository = {
  getAllInvoices: async (): Promise<InvoiceWithItems[]> => {
    const invoices = await prisma.invoice.findMany({
      include: { items: true },
    });
    return invoices;
  },
  getInvoiceById: async (
    id: number
  ): Promise<InvoiceWithItemsAndSupplier | null> => {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { items: true, supplier: true },
    });
    return invoice;
  },
  createInvoice: async (
    invoice: Prisma.InvoiceCreateInput
  ): Promise<InvoiceWithItems> => {
    const newInvoice = await prisma.invoice.create({
      data: invoice,
      include: { items: true },
    });
    return newInvoice;
  },
  updateInvoice: async (
    id: number,
    invoice: Prisma.InvoiceUpdateInput
  ): Promise<InvoiceWithItems> => {
    const updatedInvoice = await prisma.invoice.update({
      data: invoice,
      where: { id },
      include: { items: true },
    });
    return updatedInvoice;
  },
  deleteInvoice: async (id: number): Promise<InvoiceWithItems> => {
    const deletedInvoice = await prisma.invoice.delete({
      where: { id },
      include: { items: true },
    });
    return deletedInvoice;
  },
};
