import { z } from "zod";

const baseUserFields = {
  email: z.string().email(),
  name: z.string().min(2).max(50),
  surname: z.string().optional(),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
};

export const userSchema = z.object({
  id: z.number(),
  createdAt: z.string(),
  ...baseUserFields,
});

export const userCreateSchema = z.object(baseUserFields);
export const userUpdateSchema = z.object({
  id: z.number(),
  name: baseUserFields.name.optional(),
  surname: baseUserFields.surname.optional(),
  role: baseUserFields.role.optional(),
});

export const userClientSchema = userSchema.pick({
  id: true,
  email: true,
  name: true,
  surname: true,
  role: true,
  createdAt: true,
});

export type UserDto = z.infer<typeof userSchema>;
export type UserCreateDto = z.infer<typeof userCreateSchema>;
export type UserUpdateDto = z.infer<typeof userUpdateSchema>;
