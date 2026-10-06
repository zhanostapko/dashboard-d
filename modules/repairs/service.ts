import {
  RepairCreateDto,
  RepairDto,
  RepairUpdateDto,
  RepairWorkerInput,
} from "./schema";
import { repairRepository } from "./repository";
import { toRepairCreateEntity, toRepairDto, toRepairUpdateEntity } from "./mappers";
import { vehicleService } from "@/modules/vehicles/service";
import { userRepository } from "@/modules/users/repository";
import { validateWorkerRateSum } from "./commission";

const CLOSED_REPAIR_ERROR = "Закрытый ремонт нельзя изменить или удалить.";
const REPAIR_WITH_INVOICE_ERROR =
  "Ремонт с привязанным счетом нельзя удалить.";
const WORKER_RATE_SUM_ERROR =
  "Сумма ставок работников не может превышать 100%.";
const DUPLICATE_WORKER_ERROR = "Один пользователь не может быть назначен дважды.";
const WORKER_NOT_FOUND_ERROR = "Работник не найден.";
const REPAIR_PAYMENT_VIA_INVOICE_ERROR =
  "Ремонт с привязанным счетом нужно оплачивать через счет.";

export class RepairServiceConflictError extends Error {}

const resolveVehicleIdForRepair = async (
  repair: RepairCreateDto | RepairUpdateDto
): Promise<number | undefined> => {
  if (repair.vehicleId) {
    if (repair.clientId) {
      await vehicleService.attachVehicleToClient(repair.vehicleId, repair.clientId);
    }
    return repair.vehicleId;
  }

  if (!repair.clientId || !repair.carBrand || !repair.carModel) {
    return undefined;
  }

  const vehicle = await vehicleService.findOrCreateClientVehicle(repair.clientId, {
    brand: repair.carBrand,
    model: repair.carModel,
    plate: repair.carPlate,
  });

  return vehicle.id;
};

export const repairService = {
  getAllRepairs: async (): Promise<RepairDto[]> => {
    const repairs = await repairRepository.getAllRepairs();
    const mappedRepairs = repairs.map((repair) => {
      return toRepairDto(repair);
    });
    return mappedRepairs;
  },
  getRepairById: async (id: number): Promise<RepairDto | null> => {
    const repair = await repairRepository.getRepairById(id);
    if (!repair) {
      return null;
    }
    return toRepairDto(repair);
  },
  getRepairsByClientId: async (clientId: number): Promise<RepairDto[]> => {
    const repairs = await repairRepository.getRepairsByClientId(clientId);
    return repairs.map(toRepairDto);
  },
  createRepair: async (repair: RepairCreateDto): Promise<RepairDto> => {
    const vehicleId = await resolveVehicleIdForRepair(repair);
    const repairEntity = toRepairCreateEntity({ ...repair, vehicleId });
    const createdRepair = await repairRepository.createRepair(repairEntity);
    return toRepairDto(createdRepair);
  },
  updateRepair: async (
    id: number,
    repair: RepairUpdateDto
  ): Promise<RepairDto | null> => {
    const existingRepair = await repairRepository.getRepairById(id);
    if (!existingRepair) {
      return null;
    }
    if (existingRepair.status === "Closed") {
      throw new RepairServiceConflictError(CLOSED_REPAIR_ERROR);
    }
    const vehicleId = await resolveVehicleIdForRepair(repair);
    const repairEntity = toRepairUpdateEntity({ ...repair, vehicleId });
    const updatedRepair = await repairRepository.updateRepair(
      id,
      repairEntity
    );
    return toRepairDto(updatedRepair);
  },
  deleteRepair: async (id: number): Promise<RepairDto | null> => {
    const existingRepair = await repairRepository.getRepairById(id);
    if (!existingRepair) {
      return null;
    }
    if (existingRepair.status === "Closed") {
      throw new RepairServiceConflictError(CLOSED_REPAIR_ERROR);
    }
    if (existingRepair.invoice) {
      throw new RepairServiceConflictError(REPAIR_WITH_INVOICE_ERROR);
    }
    await repairRepository.deleteRepair(id);
    return toRepairDto(existingRepair);
  },
  closeRepair: async (id: number): Promise<RepairDto | null> => {
    const existingRepair = await repairRepository.getRepairById(id);
    if (!existingRepair) return null;
    if (existingRepair.status === "Closed") return toRepairDto(existingRepair);
    const closedRepair = await repairRepository.closeRepair(id);
    return toRepairDto(closedRepair);
  },
  markRepairPaid: async (id: number): Promise<RepairDto | null> => {
    const existingRepair = await repairRepository.getRepairById(id);
    if (!existingRepair) return null;
    if (existingRepair.paymentStatus === "Paid") return toRepairDto(existingRepair);
    if (existingRepair.invoice) {
      throw new RepairServiceConflictError(REPAIR_PAYMENT_VIA_INVOICE_ERROR);
    }

    const paidRepair = await repairRepository.markRepairPaid(id);
    return toRepairDto(paidRepair);
  },
  markRepairPaidForInvoice: async (invoiceId: number): Promise<void> => {
    await repairRepository.markRepairPaidByInvoice(invoiceId);
  },
  replaceWorkers: async (
    id: number,
    workers: RepairWorkerInput[]
  ): Promise<RepairDto | null> => {
    const existingRepair = await repairRepository.getRepairById(id);
    if (!existingRepair) return null;

    const workerIds = workers.map((worker) => worker.userId);
    if (new Set(workerIds).size !== workerIds.length) {
      throw new RepairServiceConflictError(DUPLICATE_WORKER_ERROR);
    }
    if (!validateWorkerRateSum(workers.map((worker) => worker.rate))) {
      throw new RepairServiceConflictError(WORKER_RATE_SUM_ERROR);
    }

    const users = await userRepository.getUsersByIds(workerIds);
    const usersById = new Map(users.map((user) => [user.id, user]));
    const existingWorkersByUserId = new Map(
      existingRepair.workers.map((worker) => [worker.userId, worker])
    );
    const resolvedWorkers = workers.map((worker) => {
      const user = usersById.get(worker.userId);
      if (!user) throw new RepairServiceConflictError(WORKER_NOT_FOUND_ERROR);

      const existingWorker = existingWorkersByUserId.get(worker.userId);
      return {
        userId: worker.userId,
        rate: existingWorker ? worker.rate : user.baseRate.toNumber(),
      };
    });

    if (!validateWorkerRateSum(resolvedWorkers.map((worker) => worker.rate))) {
      throw new RepairServiceConflictError(WORKER_RATE_SUM_ERROR);
    }

    const updatedRepair = await repairRepository.replaceWorkers(
      id,
      resolvedWorkers
    );
    return toRepairDto(updatedRepair);
  },
  reopenRepair: async (id: number): Promise<RepairDto | null> => {
    const existingRepair = await repairRepository.getRepairById(id);
    if (!existingRepair) return null;
    if (existingRepair.status === "Open") return toRepairDto(existingRepair);
    const reopenedRepair = await repairRepository.reopenRepair(id);
    return toRepairDto(reopenedRepair);
  },
};
