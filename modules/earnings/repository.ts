import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

export type EarningsRepairRecord = Prisma.RepairGetPayload<{
  include: { items: true; workers: { include: { user: true } } };
}>;

export const earningsRepository = {
  getClosedRepairs: async (where: Prisma.RepairWhereInput): Promise<EarningsRepairRecord[]> =>
    prisma.repair.findMany({
      where,
      include: { items: true, workers: { include: { user: true } } },
      orderBy: { closedAt: "desc" },
    }),
};
