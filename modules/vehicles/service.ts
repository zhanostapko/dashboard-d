import {
  toVehicleCreateEntity,
  toVehicleDetailDto,
  toVehicleDto,
} from "./mappers";
import {
  VehicleCreateDto,
  VehicleDetailDto,
  VehicleDto,
  VehicleUpdateDto,
} from "./schema";
import { vehicleRepository } from "./repository";

const normalizeOptionalText = (value: string | null | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const normalizeVehicle = (vehicle: VehicleCreateDto): VehicleCreateDto => ({
  brand: vehicle.brand.trim(),
  model: vehicle.model.trim(),
  plate: normalizeOptionalText(vehicle.plate),
  vin: normalizeOptionalText(vehicle.vin),
});

export const vehicleService = {
  getAllVehicles: async (): Promise<VehicleDto[]> => {
    const vehicles = await vehicleRepository.getAllVehicles();
    return vehicles.map(toVehicleDto);
  },
  getVehiclesByClientId: async (clientId: number): Promise<VehicleDto[]> => {
    const vehicles = await vehicleRepository.getVehiclesByClientId(clientId);
    return vehicles.map(toVehicleDto);
  },
  getVehicleById: async (id: number): Promise<VehicleDto | null> => {
    const vehicle = await vehicleRepository.getVehicleById(id);
    return vehicle ? toVehicleDto(vehicle) : null;
  },
  getVehicleDetailsById: async (
    id: number
  ): Promise<VehicleDetailDto | null> => {
    const vehicle = await vehicleRepository.getVehicleDetailsById(id);
    return vehicle ? toVehicleDetailDto(vehicle) : null;
  },
  createVehicle: async (vehicle: VehicleCreateDto): Promise<VehicleDto> => {
    const normalizedVehicle = normalizeVehicle(vehicle);
    const vehicleEntity = toVehicleCreateEntity(normalizedVehicle);
    const createdVehicle = await vehicleRepository.createVehicle(vehicleEntity);
    return toVehicleDto(createdVehicle);
  },
  updateVehicle: async (vehicle: VehicleUpdateDto): Promise<VehicleDto | null> => {
    const existingVehicle = await vehicleRepository.getVehicleById(vehicle.id);
    if (!existingVehicle) return null;

    const normalizedVehicle = normalizeVehicle(vehicle);
    const updatedVehicle = await vehicleRepository.updateVehicle(
      vehicle.id,
      toVehicleCreateEntity(normalizedVehicle),
    );
    return toVehicleDto(updatedVehicle);
  },
  deleteVehicle: async (id: number): Promise<VehicleDto | null> => {
    const existingVehicle = await vehicleRepository.getVehicleById(id);
    if (!existingVehicle) return null;

    const deletedVehicle = await vehicleRepository.deleteVehicle(id);
    return toVehicleDto(deletedVehicle);
  },
  attachVehicleToClient: async (
    vehicleId: number,
    clientId: number
  ): Promise<VehicleDto | null> => {
    const vehicle = await vehicleRepository.getVehicleById(vehicleId);
    if (!vehicle) return null;

    const attachedVehicle = await vehicleRepository.attachVehicleToClient(
      vehicleId,
      clientId
    );
    return toVehicleDto(attachedVehicle);
  },
  findOrCreateClientVehicle: async (
    clientId: number,
    vehicle: VehicleCreateDto
  ): Promise<VehicleDto> => {
    const normalizedVehicle = normalizeVehicle(vehicle);
    const existingVehicle = await vehicleRepository.findClientVehicleBySnapshot({
      brand: normalizedVehicle.brand,
      clientId,
      model: normalizedVehicle.model,
      plate: normalizedVehicle.plate,
    });

    if (existingVehicle) {
      return toVehicleDto(existingVehicle);
    }

    const vehicleEntity = toVehicleCreateEntity(normalizedVehicle);
    const createdVehicle = await vehicleRepository.createVehicleForClient(
      clientId,
      vehicleEntity
    );
    return toVehicleDto(createdVehicle);
  },
};
