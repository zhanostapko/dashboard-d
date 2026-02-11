import { Prisma, RepairItem } from "@prisma/client";
import {
  RepairCreateDto,
  RepairDto,
  RepairItemDto,
  RepairUpdateDto,
} from "./schema";

export type RepairWithItems = Prisma.RepairGetPayload<{
  include: { items: true };
}>;

const toRepairItemDto = (item: RepairItem): RepairItemDto => ({
  id: item.id,
  name: item.name,
  unit: item.unit,
  quantity: item.quantity,
  price: item.price,
});

export const toRepairDto = (repair: RepairWithItems): RepairDto => ({
  id: repair.id,
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
): Prisma.RepairCreateInput => ({
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
});

export const toRepairUpdateEntity = (
  dto: RepairUpdateDto
): Prisma.RepairUpdateInput => {
  const data: Prisma.RepairUpdateInput = {};

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
