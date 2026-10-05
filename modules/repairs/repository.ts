import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { RepairWithItems } from "./mappers";

export const repairRepository = {
  getAllRepairs: async (): Promise<RepairWithItems[]> => {
    const repairs = await prisma.repair.findMany({
      include: { items: true, invoice: true },
      orderBy: { createdAt: "desc" },
    });
    return repairs;
  },
  getRepairById: async (id: number): Promise<RepairWithItems | null> => {
    const repair = await prisma.repair.findUnique({
      where: { id },
      include: { items: true, invoice: true },
    });
    return repair;
  },
  createRepair: async (
    repair: Prisma.RepairCreateInput
  ): Promise<RepairWithItems> => {
    const newRepair = await prisma.repair.create({
      data: repair,
      include: { items: true, invoice: true },
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
      include: { items: true, invoice: true },
    });
    return updatedRepair;
  },
  deleteRepair: async (id: number): Promise<void> => {
    await prisma.repair.delete({ where: { id } });
  },
  closeRepair: async (id: number): Promise<RepairWithItems> => {
    return prisma.repair.update({
      where: { id },
      data: { status: "Closed" },
      include: { items: true, invoice: true },
    });
  },
  reopenRepair: async (id: number): Promise<RepairWithItems> => {
    return prisma.repair.update({
      where: { id },
      data: { status: "Open" },
      include: { items: true, invoice: true },
    });
  },
  closeRepairByPaidInvoice: async (
    invoiceId: number
  ): Promise<RepairWithItems | null> => {
    const repair = await prisma.repair.findFirst({
      where: { invoice: { id: invoiceId, status: "Paid" } },
      include: { items: true, invoice: true },
    });

    if (!repair || repair.status === "Closed") return repair;

    return prisma.repair.update({
      where: { id: repair.id },
      data: { status: "Closed" },
      include: { items: true, invoice: true },
    });
  },
};
