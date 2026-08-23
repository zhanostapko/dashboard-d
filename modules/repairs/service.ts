import { RepairCreateDto, RepairDto, RepairUpdateDto } from "./schema";
import { repairRepository } from "./repository";
import { toRepairCreateEntity, toRepairDto, toRepairUpdateEntity } from "./mappers";

export const repairService = {
  getAllRepairs: async (): Promise<RepairDto[]> => {
    const repairs = await repairRepository.getAllRepairs();
    const mappedRepairs = repairs.map((repair) => {
      return toRepairDto(repair);
    });
    return mappedRepairs.sort((a, b) => {
      return (
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      );
    });
  },
  getRepairById: async (id: number): Promise<RepairDto | null> => {
    const repair = await repairRepository.getRepairById(id);
    if (!repair) {
      return null;
    }
    return toRepairDto(repair);
  },
  createRepair: async (repair: RepairCreateDto): Promise<RepairDto> => {
    const repairEntity = toRepairCreateEntity(repair);
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
    const repairEntity = toRepairUpdateEntity(repair);
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
    await repairRepository.deleteRepair(id);
    return toRepairDto(existingRepair);
  },
};
