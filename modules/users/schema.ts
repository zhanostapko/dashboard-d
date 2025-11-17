import { z } from "zod";
import { User as UserModel } from "@prisma/client"

export const userCreateSchema = z.object({
  email: z.string(),
  name: z.string().min(2).max(50),
  surname: z.string().min(2).max(50).optional(),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  surname: z.string().min(2).max(50).optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
});


//Original
export type UpdateUserInput = z.infer<typeof userUpdateSchema>;
export type CreateUserInput = z.infer<typeof userCreateSchema>;

//Test

export type User = Pick<UserModel, 'id' | "email" | "name" | "surname" | "role">



