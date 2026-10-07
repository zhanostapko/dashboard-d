import { z } from "zod";

export const earningsFilterSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  workerId: z.number().int().positive().optional(),
});

export type EarningsFilter = z.infer<typeof earningsFilterSchema>;

export type EarningsWorkerDto = {
  userId: number;
  name: string;
  surname: string | null;
  rate: number;
  commission: number;
};

export type EarningsRepairDto = {
  id: number;
  clientName: string;
  closedAt: string;
  workTotal: number;
  workers: EarningsWorkerDto[];
};

export type EarningsWorkerSummaryDto = EarningsWorkerDto & {
  workTotal: number;
};

export type EarningsReportDto = {
  totalWork: number;
  totalCommission: number;
  workers: EarningsWorkerSummaryDto[];
  repairs: EarningsRepairDto[];
};
