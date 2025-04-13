"use server";
import { User } from "@prisma/client";
import prisma from "./db";

export async function getUsers(): Promise<User[]> {
  return await prisma.user.findMany();
}

export async function createUser(data: { email: string; name: string }) {
  return await prisma.user.create({ data });
}

export async function updateUser(
  id: number,
  data: { email?: string; name?: string }
) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id: number) {
  return await prisma.user.delete({
    where: { id },
  });
}
