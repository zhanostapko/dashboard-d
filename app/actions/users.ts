"use server";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/authz";
import {
  userCreateSchema,
  UserDto,
  userUpdateSchema,
} from "@/modules/users/schema";
import {
  UserServiceConflictError,
  userService,
} from "@/modules/users/service";
import { authMessages } from "@/lib/auth-messages";
import { getServerLabels } from "@/lib/i18n";

type SaveUserState = {
  error: string | null;
  success: string | null;
  user: Partial<UserDto> | null;
};

type DeleteUserState = {
  error: string | null;
  success: boolean;
};

export async function saveUserAction(
  _prevState: SaveUserState,
  payload: FormData
): Promise<SaveUserState> {
  const labels = await getServerLabels();
  const currentUser = await getCurrentUser();
  const id = payload.get("id") ? Number(payload.get("id")) : null;
  const email = payload.get("email") as string;
  const name = payload.get("name") as string;
  const surname = payload.get("surname") as string;
  const role = (payload.get("role") as "USER" | "ADMIN") || "USER";

  if (!currentUser) {
    return {
      error: authMessages.authenticationRequired,
      success: null,
      user: { email, name, surname, role },
    };
  }

  if (currentUser.role !== "ADMIN") {
    return {
      error: authMessages.forbidden,
      success: null,
      user: { email, name, surname, role },
    };
  }

  try {
    if (id) {
      if (id === currentUser.id && role !== "ADMIN") {
        return {
          error: labels.errors.selfAdmin,
          success: null,
          user: { email, name, surname, role },
        };
      }

      const user = { id, name, surname, role };
      const parsed = await userUpdateSchema.safeParseAsync(user);
      if (parsed && !parsed.success) {
        return {
          error: parsed.error.issues.map((issue) => issue.message).join(", "),
          success: null,
          user: { email, name, surname, role },
        };
      }

      try {
        const updatedUser = await userService.updateUser(id, user);
        if (!updatedUser) {
          return {
            error: labels.errors.notFound,
            success: null,
            user: { email, name, surname, role },
          };
        }
      } catch (error) {
        return {
          error: (error as Error).message,
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
          error: labels.errors.duplicateEmail,
          success: null,
          user: { email, name, surname, role },
        };
      }
    }

    revalidatePath("/auth/users");
    return { error: null, success: labels.common.saved, user: null };
  } catch (error) {
    return {
      error: `Ошибка базы данных: ${(error as Error).message}`,
      success: null,
      user: { email, name, surname, role },
    };
  }
}

export async function deleteUserAction(id: number): Promise<DeleteUserState> {
  const labels = await getServerLabels();
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      error: authMessages.authenticationRequired,
      success: false,
    };
  }

  if (currentUser.role !== "ADMIN") {
    return {
      error: authMessages.forbidden,
      success: false,
    };
  }

  if (!Number.isInteger(id)) {
    return {
      error: labels.errors.invalid,
      success: false,
    };
  }

  if (currentUser.id === id) {
    return {
      error: labels.errors.selfDelete,
      success: false,
    };
  }

  try {
    const deletedUser = await userService.deleteUser(id);

    if (!deletedUser) {
      return {
        error: labels.errors.notFound,
        success: false,
      };
    }

    revalidatePath("/auth/users");
    return { error: null, success: true };
  } catch (error) {
    if (error instanceof UserServiceConflictError) {
      return {
        error: labels.errors.lastAdmin,
        success: false,
      };
    }

    return {
      error: `Ошибка базы данных: ${(error as Error).message}`,
      success: false,
    };
  }
}
