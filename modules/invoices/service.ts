import {
  InvoiceCreateDto,
  InvoiceDetailsDto,
  InvoiceDto,
  InvoiceUpdateDto,
} from "@/modules/invoices/schema";
import { Prisma } from "@prisma/client";
import { invoiceNumberGenerate } from "@/lib/invoices";
import { getDefaultSupplierId } from "@/lib/suppliers";
import { invoiceRepository } from "./repository";
import {
  toInvoiceCreateEntity,
  toInvoiceDetailsDto,
  toInvoiceDto,
  toInvoiceUpdateEntity,
} from "./mappers";
import { repairService } from "@/modules/repairs/service";

const MAX_INVOICE_NUMBER_ATTEMPTS = 5;
const PAID_INVOICE_ERROR = "Оплаченный счет нельзя изменить или удалить.";
const REPAIR_ALREADY_INVOICED_ERROR = "У этого ремонта уже есть счет.";

export class InvoiceServiceConflictError extends Error {}

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
    if (invoice.repairId !== undefined) {
      const repair = await repairService.getRepairById(invoice.repairId);
      if (!repair) throw new InvoiceServiceConflictError("Ремонт не найден.");
      if (repair.invoiceId) {
        throw new InvoiceServiceConflictError(REPAIR_ALREADY_INVOICED_ERROR);
      }
      if (repair.status === "Closed") {
        throw new InvoiceServiceConflictError(
          "Для закрытого ремонта нельзя создавать новый счет."
        );
      }
    }

    const supplierId = invoice.supplierId ?? (await getDefaultSupplierId());
    let lastError: unknown;

    for (let attempt = 0; attempt < MAX_INVOICE_NUMBER_ATTEMPTS; attempt += 1) {
      const invoiceEntity = toInvoiceCreateEntity({
        ...invoice,
        supplierId,
        number: await invoiceNumberGenerate(),
      });

      try {
        const createdInvoice = await invoiceRepository.createInvoice(
          invoiceEntity
        );
        if (createdInvoice.status === "Paid" && createdInvoice.repairId) {
          await repairService.closeRepairForPaidInvoice(createdInvoice.repairId);
        }
        return toInvoiceDto(createdInvoice);
      } catch (error) {
        lastError = error;

        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          continue;
        }

        throw error;
      }
    }

    throw lastError instanceof Error
      ? lastError
      : new Error("Failed to generate a unique invoice number.");
  },
  updateInvoice: async (
    id: number,
    invoice: InvoiceUpdateDto
  ): Promise<InvoiceDto | null> => {
    const existingInvoice = await invoiceRepository.getInvoiceById(id);

    if (!existingInvoice) {
      return null;
    }

    if (existingInvoice.status === "Paid") {
      throw new InvoiceServiceConflictError(PAID_INVOICE_ERROR);
    }

    if (invoice.repairId !== undefined) {
      const repair = await repairService.getRepairById(invoice.repairId);
      if (!repair) {
        throw new InvoiceServiceConflictError("Ремонт не найден.");
      }
      if (repair.invoiceId && repair.invoiceId !== id) {
        throw new InvoiceServiceConflictError(REPAIR_ALREADY_INVOICED_ERROR);
      }
      if (repair.status === "Closed" && repair.invoiceId !== id) {
        throw new InvoiceServiceConflictError(
          "Для закрытого ремонта нельзя привязать счет."
        );
      }
    }

    const invoiceEntity = toInvoiceUpdateEntity(invoice);
    const updatedInvoice = await invoiceRepository.updateInvoice(
      id,
      invoiceEntity
    );
    if (updatedInvoice.status === "Paid" && updatedInvoice.repairId) {
      await repairService.closeRepairForPaidInvoice(updatedInvoice.repairId);
    }
    return toInvoiceDto(updatedInvoice);
  },
  deleteInvoice: async (id: number): Promise<InvoiceDto | null> => {
    const existingInvoice = await invoiceRepository.getInvoiceById(id);

    if (!existingInvoice) {
      return null;
    }

    if (existingInvoice.status === "Paid") {
      throw new InvoiceServiceConflictError(PAID_INVOICE_ERROR);
    }

    const invoice = await invoiceRepository.deleteInvoice(id);
    return toInvoiceDto(invoice);
  },
};
