"use server";

import { User } from "@prisma/client";
import prisma from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";

type SaveUserState = {
  error: string | null;
  success: string | null;
  user: Partial<User> | null;
};

const userSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .refine(async (email) => {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      return !existingUser;
    }, "Email must be unique"),
  name: z.string().min(1, "Name is required"),
  role: z.enum(["USER", "ADMIN"], {
    errorMap: () => ({ message: "Invalid role" }),
  }),
});

export async function saveUserAction(
  prevState: SaveUserState,
  payload: FormData
): Promise<SaveUserState> {
  const id = payload.get("id") ? Number(payload.get("id")) : null;
  const email = payload.get("email") as string;
  const name = payload.get("name") as string;
  const surname = payload.get("surname") as string;
  const role = (payload.get("role") as "USER" | "ADMIN") || "USER";

  const parsed = await userSchema.safeParseAsync({ email, name, role });

  if (!parsed.success) {
    return {
      error: parsed.error.issues.map((issue) => issue.message).join(", "),
      success: null,
      user: { email, name, surname, role },
    };
  }

  try {
    if (id) {
      await prisma.user.update({
        where: { id },
        data: { email, name, surname, role },
      });
    } else {
      await prisma.user.create({
        data: { email, name, surname, role },
      });
    }
    revalidatePath("/users");
    return { error: null, success: "User saved!", user: null };
  } catch (error) {
    return {
      error: `Database error: ${(error as Error).message}`,
      success: null,
      user: { email, name, surname, role },
    };
  }
}
