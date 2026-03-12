import { InvoiceItem, Prisma } from "@prisma/client";
import {
  InvoiceCreateDto,
  InvoiceDetailsDto,
  InvoiceDto,
  InvoiceItemDto,
  InvoiceUpdateDto,
} from "./schema";

export type InvoiceWithItems = Prisma.InvoiceGetPayload<{
  include: { items: true };
}>;

export type InvoiceWithItemsAndSupplier = Prisma.InvoiceGetPayload<{
  include: { items: true; supplier: true };
}>;

const toInvoiceItemDto = (item: InvoiceItem): InvoiceItemDto => ({
  id: item.id,
  name: item.name,
  unit: item.unit,
  quantity: item.quantity,
  price: item.price,
  total: item.total,
});

export const toInvoiceDto = (invoice: InvoiceWithItems): InvoiceDto => ({
  id: invoice.id,
  number: invoice.number ?? "",
  date: invoice.date.toISOString(),
  status: invoice.status,
  supplierId: invoice.supplierId,
  clientName: invoice.clientName ?? "",
  clientRegNr: invoice.clientRegNr ?? "",
  clientAddress: invoice.clientAddress ?? "",
  clientBank: invoice.clientBank ?? "",
  clientBankCode: invoice.clientBankCode ?? "",
  clientAccount: invoice.clientAccount ?? "",
  clientPhone: invoice.clientPhone ?? "",
  clientEmail: invoice.clientEmail ?? "",
  carBrand: invoice.carBrand ?? "",
  carModel: invoice.carModel ?? "",
  carPlate: invoice.carPlate ?? "",
  carMileage: invoice.carMileage ?? "",
  paymentType: invoice.paymentType,
  total: invoice.total,
  createdAt: invoice.createdAt.toISOString(),
  items: invoice.items?.map(toInvoiceItemDto) ?? [],
});

export const toInvoiceDetailsDto = (
  invoice: InvoiceWithItemsAndSupplier
): InvoiceDetailsDto => ({
  id: invoice.id,
  number: invoice.number ?? "",
  date: invoice.date.toISOString(),
  status: invoice.status,
  supplierId: invoice.supplierId,
  supplier: {
    id: invoice.supplier!.id,
    name: invoice.supplier!.name,
    regNr: invoice.supplier!.regNr,
    phone: invoice.supplier!.phone,
    bank: invoice.supplier!.bank,
    code: invoice.supplier!.code,
    account: invoice.supplier!.account,
  },
  clientName: invoice.clientName ?? "",
  clientRegNr: invoice.clientRegNr ?? "",
  clientAddress: invoice.clientAddress ?? "",
  clientBank: invoice.clientBank ?? "",
  clientBankCode: invoice.clientBankCode ?? "",
  clientAccount: invoice.clientAccount ?? "",
  clientPhone: invoice.clientPhone ?? "",
  clientEmail: invoice.clientEmail ?? "",
  carBrand: invoice.carBrand ?? "",
  carModel: invoice.carModel ?? "",
  carPlate: invoice.carPlate ?? "",
  carMileage: invoice.carMileage ?? "",
  paymentType: invoice.paymentType,
  total: invoice.total,
  createdAt: invoice.createdAt.toISOString(),
  items: invoice.items?.map(toInvoiceItemDto) ?? [],
});

export const toInvoiceCreateEntity = (
  dto: InvoiceCreateDto
): Prisma.InvoiceCreateInput => {
  if (dto.supplierId === undefined) {
    throw new Error("Supplier must be configured before creating an invoice.");
  }

  return {
    number: dto.number,
    date: new Date(dto.date),
    status: dto.status ?? "Unpaid",
    supplier: { connect: { id: dto.supplierId } },
    clientName: dto.clientName,
    clientRegNr: dto.clientRegNr,
    clientAddress: dto.clientAddress,
    clientBank: dto.clientBank,
    clientBankCode: dto.clientBankCode,
    clientAccount: dto.clientAccount,
    clientPhone: dto.clientPhone ?? null,
    clientEmail: dto.clientEmail ?? null,
    carBrand: dto.carBrand,
    carModel: dto.carModel,
    carPlate: dto.carPlate,
    carMileage: dto.carMileage ?? "",
    paymentType: dto.paymentType,
    total: dto.total,
    items: {
      create: dto.items.map((item) => ({
        name: item.name,
        unit: item.unit,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
    },
  };
};

export const toInvoiceUpdateEntity = (
  dto: InvoiceUpdateDto
): Prisma.InvoiceUpdateInput => {
  const data: Prisma.InvoiceUpdateInput = {};

  if (dto.number !== undefined) data.number = dto.number;
  if (dto.date !== undefined) data.date = new Date(dto.date);
  if (dto.supplierId !== undefined) {
    data.supplier = { connect: { id: dto.supplierId } };
  }
  if (dto.clientName !== undefined) data.clientName = dto.clientName;
  if (dto.clientRegNr !== undefined) data.clientRegNr = dto.clientRegNr;
  if (dto.clientAddress !== undefined) data.clientAddress = dto.clientAddress;
  if (dto.clientBank !== undefined) data.clientBank = dto.clientBank;
  if (dto.clientBankCode !== undefined)
    data.clientBankCode = dto.clientBankCode;
  if (dto.clientAccount !== undefined) data.clientAccount = dto.clientAccount;
  if (dto.clientPhone !== undefined) data.clientPhone = dto.clientPhone ?? null;
  if (dto.clientEmail !== undefined) data.clientEmail = dto.clientEmail ?? null;
  if (dto.carBrand !== undefined) data.carBrand = dto.carBrand;
  if (dto.carModel !== undefined) data.carModel = dto.carModel;
  if (dto.carPlate !== undefined) data.carPlate = dto.carPlate;
  if (dto.carMileage !== undefined) data.carMileage = dto.carMileage ?? "";
  if (dto.paymentType !== undefined) data.paymentType = dto.paymentType;
  if (dto.total !== undefined) data.total = dto.total;
  if (dto.status !== undefined) data.status = dto.status;

  if (dto.items !== undefined) {
    data.items = {
      deleteMany: {},
      create: dto.items.map((item) => ({
        name: item.name,
        unit: item.unit,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
    };
  }

  return data;
};
