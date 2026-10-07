import { Prisma, User } from "@prisma/client";
import { UserCreateDto, UserDto, UserUpdateDto } from "./schema";

export const toUserDto = (user: User): UserDto => ({
  id: user.id,
  email: user.email,
  name: user.name ?? null,
  surname: user.surname ?? undefined,
  role: user.role,
  baseRate: user.baseRate.toNumber(),
  createdAt: user.createdAt.toISOString(),
});

export const toUserCreateEntity = (
  dto: UserCreateDto
): Prisma.UserCreateInput => ({
  email: dto.email,
  name: dto.name,
  surname: dto.surname ?? null,
  role: dto.role ?? "USER",
  baseRate: dto.baseRate ?? 0,
});

export const toUserUpdateEntity = (
  dto: UserUpdateDto
): Prisma.UserUpdateInput => {
  const data: Prisma.UserUpdateInput = {};
  if (dto.name !== undefined) data.name = dto.name;
  if (dto.surname !== undefined) data.surname = dto.surname ?? null;
  if (dto.role !== undefined) data.role = dto.role;
  if (dto.baseRate !== undefined) data.baseRate = dto.baseRate;
  return data;
};
