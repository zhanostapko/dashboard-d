import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { RepairWithItems } from "./mappers";

export const repairRepository = {
  getAllRepairs: async (): Promise<RepairWithItems[]> => {
    const repairs = await prisma.repair.findMany({
      include: { items: true, invoice: true, workers: { include: { user: true } } },
      orderBy: { createdAt: "desc" },
    });
    return repairs;
  },
  getRepairById: async (id: number): Promise<RepairWithItems | null> => {
    const repair = await prisma.repair.findUnique({
      where: { id },
      include: { items: true, invoice: true, workers: { include: { user: true } } },
    });
    return repair;
  },
  getRepairsByClientId: async (clientId: number): Promise<RepairWithItems[]> => {
    return prisma.repair.findMany({
      where: { clientId },
      include: { items: true, invoice: true, workers: { include: { user: true } } },
      orderBy: { date: "desc" },
    });
  },
  createRepair: async (
    repair: Prisma.RepairCreateInput
  ): Promise<RepairWithItems> => {
    const newRepair = await prisma.repair.create({
      data: repair,
      include: { items: true, invoice: true, workers: { include: { user: true } } },
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
      include: { items: true, invoice: true, workers: { include: { user: true } } },
    });
    return updatedRepair;
  },
  deleteRepair: async (id: number): Promise<void> => {
    await prisma.repair.delete({ where: { id } });
  },
  closeRepair: async (id: number): Promise<RepairWithItems> => {
    return prisma.repair.update({
      where: { id },
      data: { status: "Closed", closedAt: new Date() },
      include: { items: true, invoice: true, workers: { include: { user: true } } },
    });
  },
  reopenRepair: async (id: number): Promise<RepairWithItems> => {
    return prisma.repair.update({
      where: { id },
      data: { status: "Open", closedAt: null },
      include: { items: true, invoice: true, workers: { include: { user: true } } },
    });
  },
  replaceWorkers: async (
    repairId: number,
    workers: Array<{ userId: number; rate: number }>
  ): Promise<RepairWithItems> => {
    return prisma.$transaction(async (tx) => {
      await tx.repairWorker.deleteMany({ where: { repairId } });
      if (workers.length > 0) {
        await tx.repairWorker.createMany({
          data: workers.map((worker) => ({
            repairId,
            userId: worker.userId,
            rate: worker.rate,
          })),
        });
      }

      return tx.repair.findUniqueOrThrow({
        where: { id: repairId },
        include: { items: true, invoice: true, workers: { include: { user: true } } },
      });
    });
  },
  markRepairPaid: async (
    id: number,
    paidAt = new Date()
  ): Promise<RepairWithItems> =>
    prisma.repair.update({
      where: { id },
      data: { paymentStatus: "Paid", paidAt },
      include: { items: true, invoice: true, workers: { include: { user: true } } },
    }),
  markRepairPaidByInvoice: async (
    invoiceId: number,
    paidAt = new Date()
  ): Promise<RepairWithItems | null> => {
    const repair = await prisma.repair.findFirst({
      where: { invoice: { id: invoiceId } },
      include: { items: true, invoice: true, workers: { include: { user: true } } },
    });

    if (!repair) return null;

    return prisma.repair.update({
      where: { id: repair.id },
      data: { paymentStatus: "Paid", paidAt },
      include: { items: true, invoice: true, workers: { include: { user: true } } },
    });
  },
};
