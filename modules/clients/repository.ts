import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

export type ClientWithVehicles = Prisma.ClientGetPayload<{
  include: { vehicles: true };
}>;

export const clientRepository = {
  getAllClients: async (): Promise<ClientWithVehicles[]> => {
    const clients = await prisma.client.findMany({
      include: {
        vehicles: {
          orderBy: [{ brand: "asc" }, { model: "asc" }, { plate: "asc" }],
          where: { isDeleted: false },
        },
      },
      orderBy: { name: "asc" },
      where: { isDeleted: false },
    });
    return clients;
  },
  getClientById: async (id: number): Promise<ClientWithVehicles | null> => {
    const client = await prisma.client.findFirst({
      include: {
        vehicles: {
          orderBy: [{ brand: "asc" }, { model: "asc" }, { plate: "asc" }],
          where: { isDeleted: false },
        },
      },
      where: { id, isDeleted: false },
    });
    return client;
  },
  createClient: async (
    client: Prisma.ClientCreateInput
  ): Promise<ClientWithVehicles> => {
    const newClient = await prisma.client.create({
      data: client,
      include: { vehicles: { where: { isDeleted: false } } },
    });
    return newClient;
  },
  updateClient: async (
    id: number,
    client: Prisma.ClientUpdateInput
  ): Promise<ClientWithVehicles> => {
    const updatedClient = await prisma.client.update({
      data: client,
      where: { id },
      include: {
        vehicles: {
          orderBy: [{ brand: "asc" }, { model: "asc" }, { plate: "asc" }],
          where: { isDeleted: false },
        },
      },
    });
    return updatedClient;
  },
  deleteClient: async (id: number): Promise<ClientWithVehicles> => {
    const deletedClient = await prisma.client.update({
      data: { isDeleted: true },
      where: { id },
      include: { vehicles: { where: { isDeleted: false } } },
    });
    return deletedClient;
  },
};
