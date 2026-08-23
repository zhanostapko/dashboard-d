import prisma from "@/lib/db";
import { Client, Prisma } from "@prisma/client";

export const clientRepository = {
  getAllClients: async (): Promise<Client[]> => {
    const clients = await prisma.client.findMany({
      where: { isDeleted: false },
    });
    return clients;
  },
  getClientById: async (id: number): Promise<Client | null> => {
    const client = await prisma.client.findFirst({
      where: { id, isDeleted: false },
    });
    return client;
  },
  createClient: async (client: Prisma.ClientCreateInput): Promise<Client> => {
    const newClient = await prisma.client.create({
      data: client,
    });
    return newClient;
  },
  updateClient: async (
    id: number,
    client: Prisma.ClientUpdateInput
  ): Promise<Client> => {
    const updatedClient = await prisma.client.update({
      data: client,
      where: { id },
    });
    return updatedClient;
  },
  deleteClient: async (id: number): Promise<Client> => {
    const deletedClient = await prisma.client.update({
      data: { isDeleted: true },
      where: { id },
    });
    return deletedClient;
  },
};
