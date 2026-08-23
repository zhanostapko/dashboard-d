import prisma from "@/lib/db";
import { Prisma, User } from "@prisma/client";

export const userRepository = {
  getAllUsers: async (): Promise<User[]> => {
    const users = await prisma.user.findMany();
    return users;
  },
  getUserById: async (id: number): Promise<User | null> => {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  },
  updateUser: async (id: number, user: Prisma.UserUpdateInput) => {
    const updatedUser = await prisma.user.update({ data: user, where: { id } });

    return updatedUser;
  },
  createUser: async (user: Prisma.UserCreateInput) => {
    const newUser = await prisma.user.create({
      data: user,
    });
    return newUser;
  },
  deleteUser: async (id: number) => {
    await prisma.user.delete({ where: { id } });
  },

  getUserByEmail: async (email: string): Promise<User | null> => {
    const user = await prisma.user.findUnique({ where: { email } });

    return user;
  },
};
