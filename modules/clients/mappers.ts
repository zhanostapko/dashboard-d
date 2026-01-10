import { Client, Prisma } from "@prisma/client";
import { ClientCreateDto, ClientDto, ClientUpdateDto } from "./schema";

export const toClientDto = (client: Client): ClientDto => ({
  id: client.id,
  name: client.name,
  regNr: client.regNr ?? undefined,
  address: client.address ?? undefined,
  bank: client.bank ?? undefined,
  bankCode: client.bankCode ?? undefined,
  account: client.account ?? undefined,
  phone: client.phone ?? undefined,
  email: client.email ?? undefined,
});

export const toClientCreateEntity = (
  dto: ClientCreateDto
): Prisma.ClientCreateInput => ({
  name: dto.name,
  regNr: dto.regNr ?? null,
  address: dto.address ?? null,
  bank: dto.bank ?? null,
  bankCode: dto.bankCode ?? null,
  account: dto.account ?? null,
  phone: dto.phone ?? null,
  email: dto.email ?? null,
});

export const toClientUpdateEntity = (
  dto: ClientUpdateDto
): Prisma.ClientUpdateInput => {
  const data: Prisma.ClientUpdateInput = {};

  if (dto.name !== undefined) data.name = dto.name;
  if (dto.regNr !== undefined) data.regNr = dto.regNr ?? null;
  if (dto.address !== undefined) data.address = dto.address ?? null;
  if (dto.bank !== undefined) data.bank = dto.bank ?? null;
  if (dto.bankCode !== undefined) data.bankCode = dto.bankCode ?? null;
  if (dto.account !== undefined) data.account = dto.account ?? null;
  if (dto.phone !== undefined) data.phone = dto.phone ?? null;
  if (dto.email !== undefined) data.email = dto.email ?? null;

  return data;
};
