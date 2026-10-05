import prisma from "@/lib/db";
import { Prisma, Vehicle } from "@prisma/client";

export const vehicleRepository = {
  getVehicleById: async (id: number): Promise<Vehicle | null> => {
    return prisma.vehicle.findFirst({
      where: { id, isDeleted: false },
    });
  },
  getVehiclesByClientId: async (clientId: number): Promise<Vehicle[]> => {
    return prisma.vehicle.findMany({
      where: {
        isDeleted: false,
        clients: {
          some: { id: clientId, isDeleted: false },
        },
      },
      orderBy: [{ brand: "asc" }, { model: "asc" }, { plate: "asc" }],
    });
  },
  findClientVehicleBySnapshot: async ({
    brand,
    clientId,
    model,
    plate,
  }: {
    brand: string;
    clientId: number;
    model: string;
    plate?: string | null;
  }): Promise<Vehicle | null> => {
    return prisma.vehicle.findFirst({
      where: {
        brand,
        model,
        plate: plate || null,
        isDeleted: false,
        clients: {
          some: { id: clientId, isDeleted: false },
        },
      },
    });
  },
  createVehicleForClient: async (
    clientId: number,
    vehicle: Prisma.VehicleCreateInput
  ): Promise<Vehicle> => {
    return prisma.vehicle.create({
      data: {
        ...vehicle,
        clients: {
          connect: { id: clientId },
        },
      },
    });
  },
  attachVehicleToClient: async (
    vehicleId: number,
    clientId: number
  ): Promise<Vehicle> => {
    return prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        clients: {
          connect: { id: clientId },
        },
      },
    });
  },
};
