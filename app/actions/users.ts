"use server";
import { revalidatePath } from "next/cache";
import {
  userCreateSchema,
  UserDto,
  userUpdateSchema,
} from "@/modules/users/schema";
import { userService } from "@/modules/users/service";

type SaveUserState = {
  error: string | null;
  success: string | null;
  user: Partial<UserDto> | null;
};

export async function saveUserAction(
  _prevState: SaveUserState,
  payload: FormData
): Promise<SaveUserState> {
  const id = payload.get("id") ? Number(payload.get("id")) : null;
  const email = payload.get("email") as string;
  const name = payload.get("name") as string;
  const surname = payload.get("surname") as string;
  const role = (payload.get("role") as "USER" | "ADMIN") || "USER";

  try {
    if (id) {
      const user = { id, name, surname, role };
      const parsed = await userUpdateSchema.safeParseAsync(user);
      if (parsed && !parsed.success) {
        return {
          error: parsed.error.issues.map((issue) => issue.message).join(", "),
          success: null,
          user: { email, name, surname, role },
        };
      }

      const updatedUser = await userService.updateUser(id, user);
      if (!updatedUser) {
        return {
          error: "Can't find user",
          success: null,
          user: { email, name, surname, role },
        };
      }
    } else {
      const user = { email, name, surname, role };
      const parsed = await userCreateSchema.safeParseAsync(user);
      if (parsed && !parsed.success) {
        return {
          error: parsed.error.issues.map((issue) => issue.message).join(", "),
          success: null,
          user: { email, name, surname, role },
        };
      }
      const createdUser = await userService.createUser(user);
      if (!createdUser) {
        return {
          error: "User with that email already exist",
          success: null,
          user: { email, name, surname, role },
        };
      }
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
