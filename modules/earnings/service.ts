import { calculateCommission, calculateWorkTotal } from "@/modules/repairs/commission";
import { EarningsFilter, EarningsReportDto } from "./schema";
import { earningsRepository } from "./repository";

const roundToCents = (value: number): number =>
  Math.round((value + Number.EPSILON) * 100) / 100;

const toStartOfDay = (value: string): Date => new Date(`${value}T00:00:00.000Z`);
const toEndOfDay = (value: string): Date => new Date(`${value}T23:59:59.999Z`);

export const earningsService = {
  getReport: async (filters: EarningsFilter = {}): Promise<EarningsReportDto> => {
    const closedAt: { not: null; gte?: Date; lte?: Date } = { not: null };
    if (filters.from) closedAt.gte = toStartOfDay(filters.from);
    if (filters.to) closedAt.lte = toEndOfDay(filters.to);

    const repairs = await earningsRepository.getClosedRepairs({
      status: "Closed",
      closedAt,
      ...(filters.workerId
        ? { workers: { some: { userId: filters.workerId } } }
        : {}),
    });

    const mappedRepairs = repairs.map((repair) => {
      const items = repair.items.map((item) => ({
        unit: item.unit === "materials" ? "materials" as const : "work" as const,
        quantity: item.quantity,
        price: item.price.toNumber(),
      }));
      const workTotal = calculateWorkTotal(items);
      const workers = repair.workers
        .filter((worker) => !filters.workerId || worker.userId === filters.workerId)
        .map((worker) => ({
          userId: worker.userId,
          name: worker.user.name,
          surname: worker.user.surname,
          rate: worker.rate.toNumber(),
          commission: calculateCommission(workTotal, worker.rate.toNumber()),
        }));

      return {
        id: repair.id,
        clientName: repair.clientName ?? "",
        closedAt: repair.closedAt!.toISOString(),
        workTotal,
        workers,
      };
    });

    const workersById = new Map<number, {
      userId: number;
      name: string;
      surname: string | null;
      rate: number;
      commission: number;
      workTotal: number;
    }>();

    for (const repair of mappedRepairs) {
      for (const worker of repair.workers) {
        const current = workersById.get(worker.userId);
        workersById.set(worker.userId, {
          ...worker,
          workTotal: (current?.workTotal ?? 0) + repair.workTotal,
          commission: (current?.commission ?? 0) + worker.commission,
        });
      }
    }

    return {
      totalWork: roundToCents(mappedRepairs.reduce((sum, repair) => sum + repair.workTotal, 0)),
      totalCommission: roundToCents(
        mappedRepairs.reduce(
          (sum, repair) => sum + repair.workers.reduce((workerSum, worker) => workerSum + worker.commission, 0),
          0
        )
      ),
      workers: Array.from(workersById.values()).map((worker) => ({
        ...worker,
        workTotal: roundToCents(worker.workTotal),
        commission: roundToCents(worker.commission),
      })),
      repairs: mappedRepairs,
    };
  },
};
