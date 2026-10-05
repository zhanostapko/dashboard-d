import { Prisma, RepairItem } from "@prisma/client";
import {
  RepairCreateDto,
  RepairDto,
  RepairItemDto,
  RepairUpdateDto,
} from "./schema";

export type RepairWithItems = Prisma.RepairGetPayload<{
  include: { items: true; invoice: true };
}>;

const normalizeRepairItemType = (
  unit: string | null | undefined
): RepairItemDto["unit"] => {
  return unit === "materials" ? "materials" : "work";
};

const toMoneyNumber = (value: number | Prisma.Decimal): number =>
  typeof value === "number" ? value : value.toNumber();

const toRepairItemDto = (item: RepairItem): RepairItemDto => ({
  id: item.id,
  name: item.name,
  unit: normalizeRepairItemType(item.unit),
  quantity: item.quantity,
  price: toMoneyNumber(item.price),
});

export const toRepairDto = (repair: RepairWithItems): RepairDto => ({
  id: repair.id,
  clientId: repair.clientId,
  vehicleId: repair.vehicleId,
  invoiceId: repair.invoice?.id ?? null,
  status: repair.status,
  date: repair.date.toISOString(),
  clientName: repair.clientName ?? "",
  clientPhone: repair.clientPhone ?? "",
  carBrand: repair.carBrand ?? "",
  carModel: repair.carModel ?? "",
  carPlate: repair.carPlate ?? "",
  carMileage: repair.carMileage ?? "",
  createdAt: repair.createdAt.toISOString(),
  items: repair.items?.map(toRepairItemDto) ?? [],
});

export const toRepairCreateEntity = (
  dto: RepairCreateDto
): Prisma.RepairCreateInput => {
  const data: Prisma.RepairCreateInput = {
    date: new Date(dto.date),
    clientName: dto.clientName,
    clientPhone: dto.clientPhone ?? null,
    carBrand: dto.carBrand,
    carModel: dto.carModel,
    carPlate: dto.carPlate,
    carMileage: dto.carMileage ?? "",
    items: {
      create: dto.items.map((item) => ({
        name: item.name,
        unit: item.unit,
        quantity: item.quantity,
        price: item.price,
      })),
    },
  };

  if (dto.clientId !== undefined) {
    data.client = { connect: { id: dto.clientId } };
  }
  if (dto.vehicleId !== undefined) {
    data.vehicle = { connect: { id: dto.vehicleId } };
  }

  return data;
};

export const toRepairUpdateEntity = (
  dto: RepairUpdateDto
): Prisma.RepairUpdateInput => {
  const data: Prisma.RepairUpdateInput = {};

  if (dto.clientId !== undefined) {
    data.client = dto.clientId
      ? { connect: { id: dto.clientId } }
      : { disconnect: true };
  }
  if (dto.vehicleId !== undefined) {
    data.vehicle = dto.vehicleId
      ? { connect: { id: dto.vehicleId } }
      : { disconnect: true };
  }
  if (dto.date !== undefined) data.date = new Date(dto.date);
  if (dto.clientName !== undefined) data.clientName = dto.clientName;
  if (dto.clientPhone !== undefined)
    data.clientPhone = dto.clientPhone ?? null;
  if (dto.carBrand !== undefined) data.carBrand = dto.carBrand;
  if (dto.carModel !== undefined) data.carModel = dto.carModel;
  if (dto.carPlate !== undefined) data.carPlate = dto.carPlate;
  if (dto.carMileage !== undefined) data.carMileage = dto.carMileage ?? "";

  if (dto.items !== undefined) {
    data.items = {
      deleteMany: {},
      create: dto.items.map((item) => ({
        name: item.name,
        unit: item.unit,
        quantity: item.quantity,
        price: item.price,
      })),
    };
  }

  return data;
};
