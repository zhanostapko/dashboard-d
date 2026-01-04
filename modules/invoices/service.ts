import {
  InvoiceCreateDto,
  InvoiceDetailsDto,
  InvoiceDto,
  InvoiceUpdateDto,
} from "@/modules/invoices/schema";
import { invoiceRepository } from "./repository";
import {
  toInvoiceCreateEntity,
  toInvoiceDetailsDto,
  toInvoiceDto,
  toInvoiceUpdateEntity,
} from "./mappers";

export const invoiceService = {
  getAllInvoices: async (): Promise<InvoiceDto[]> => {
    const invoices = await invoiceRepository.getAllInvoices();

    const mappedInvoices: InvoiceDto[] = invoices.map((invoice) => {
      return toInvoiceDto(invoice);
    });

    return mappedInvoices.sort((a, b) => {
      return (
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      );
    });
  },
  getInvoice: async (id: number): Promise<InvoiceDetailsDto | null> => {
    const invoice = await invoiceRepository.getInvoiceById(id);

    if (!invoice) return null;

    const mappedInvoice = toInvoiceDetailsDto(invoice);

    return mappedInvoice;
  },
  createInvoice: async (invoice: InvoiceCreateDto): Promise<InvoiceDto> => {
    const invoiceEntity = toInvoiceCreateEntity(invoice);
    const createdInvoice = await invoiceRepository.createInvoice(invoiceEntity);
    return toInvoiceDto(createdInvoice);
  },
  updateInvoice: async (
    id: number,
    invoice: InvoiceUpdateDto
  ): Promise<InvoiceDto> => {
    const invoiceEntity = toInvoiceUpdateEntity(invoice);
    const updatedInvoice = await invoiceRepository.updateInvoice(
      id,
      invoiceEntity
    );
    return toInvoiceDto(updatedInvoice);
  },
  deleteInvoice: async (id: number): Promise<InvoiceDto> => {
    const invoice = await invoiceRepository.deleteInvoice(id);
    return toInvoiceDto(invoice);
  },
};
