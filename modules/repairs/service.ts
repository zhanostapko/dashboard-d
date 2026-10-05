import { RepairCreateDto, RepairDto, RepairUpdateDto } from "./schema";
import { repairRepository } from "./repository";
import { toRepairCreateEntity, toRepairDto, toRepairUpdateEntity } from "./mappers";
import { vehicleService } from "@/modules/vehicles/service";

const CLOSED_REPAIR_ERROR = "Закрытый ремонт нельзя изменить или удалить.";
const REPAIR_WITH_UNPAID_INVOICE_ERROR =
  "Ремонт с неоплаченным счетом нельзя закрыть.";
const REPAIR_WITH_INVOICE_ERROR =
  "Ремонт с привязанным счетом нельзя удалить.";
const PAID_INVOICE_REOPEN_ERROR =
  "Ремонт с оплаченным счетом нельзя открыть заново.";

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
    if (existingRepair.invoice && existingRepair.invoice.status !== "Paid") {
      throw new RepairServiceConflictError(REPAIR_WITH_UNPAID_INVOICE_ERROR);
    }

    const closedRepair = await repairRepository.closeRepair(id);
    return toRepairDto(closedRepair);
  },
  closeRepairForPaidInvoice: async (invoiceId: number): Promise<void> => {
    await repairRepository.closeRepairByPaidInvoice(invoiceId);
  },
  reopenRepair: async (id: number): Promise<RepairDto | null> => {
    const existingRepair = await repairRepository.getRepairById(id);
    if (!existingRepair) return null;
    if (existingRepair.status === "Open") return toRepairDto(existingRepair);
    if (existingRepair.invoice?.status === "Paid") {
      throw new RepairServiceConflictError(PAID_INVOICE_REOPEN_ERROR);
    }

    const reopenedRepair = await repairRepository.reopenRepair(id);
    return toRepairDto(reopenedRepair);
  },
};
