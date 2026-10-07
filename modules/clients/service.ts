import { ClientCreateDto, ClientDto, ClientUpdateDto } from "./schema";
import { clientRepository } from "./repository";
import { toClientCreateEntity, toClientDto, toClientUpdateEntity } from "./mappers";

export const clientService = {
  getAllClients: async (): Promise<ClientDto[]> => {
    const clients = await clientRepository.getAllClients();
    const mappedClients = clients.map((client) => {
      return toClientDto(client);
    });
    return mappedClients;
  },
  getClientById: async (id: number): Promise<ClientDto | null> => {
    const client = await clientRepository.getClientById(id);
    if (!client) {
      return null;
    }
    return toClientDto(client);
  },
  createClient: async (client: ClientCreateDto): Promise<ClientDto> => {
    const clientEntity = toClientCreateEntity(client);
    const createdClient = await clientRepository.createClient(clientEntity);
    return toClientDto(createdClient);
  },
  updateClient: async (
    id: number,
    client: ClientUpdateDto
  ): Promise<ClientDto | null> => {
    const existingClient = await clientRepository.getClientById(id);
    if (!existingClient) {
      return null;
    }
    const clientEntity = toClientUpdateEntity(client);
    const updatedClient = await clientRepository.updateClient(id, clientEntity);
    return toClientDto(updatedClient);
  },
  deleteClient: async (id: number): Promise<ClientDto | null> => {
    const existingClient = await clientRepository.getClientById(id);
    if (!existingClient) {
      return null;
    }
    const deletedClient = await clientRepository.deleteClient(id);
    return toClientDto(deletedClient);
  },
};
