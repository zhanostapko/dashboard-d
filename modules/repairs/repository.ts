import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { RepairWithItems } from "./mappers";

export const repairRepository = {
  getAllRepairs: async (): Promise<RepairWithItems[]> => {
    const repairs = await prisma.repair.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return repairs;
  },
  getRepairById: async (id: number): Promise<RepairWithItems | null> => {
    const repair = await prisma.repair.findUnique({
      where: { id },
      include: { items: true },
    });
    return repair;
  },
  createRepair: async (
    repair: Prisma.RepairCreateInput
  ): Promise<RepairWithItems> => {
    const newRepair = await prisma.repair.create({
      data: repair,
      include: { items: true },
    });
    return newRepair;
  },
  updateRepair: async (
    id: number,
    repair: Prisma.RepairUpdateInput
  ): Promise<RepairWithItems> => {
    const updatedRepair = await prisma.repair.update({
      data: repair,
      where: { id },
      include: { items: true },
    });
    return updatedRepair;
  },
  deleteRepair: async (id: number): Promise<void> => {
    await prisma.repair.delete({ where: { id } });
  },
};
