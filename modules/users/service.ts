import { toUserDto, toUserCreateEntity, toUserUpdateEntity } from "./mappers";
import { userRepository } from "./repository";
import { UserCreateDto, UserDto, UserUpdateDto } from "./schema";

const LAST_ADMIN_ERROR =
  "В системе должен оставаться хотя бы один администратор.";
const USER_ASSIGNED_TO_REPAIR_ERROR =
  "Нельзя удалить пользователя, назначенного на ремонт.";

export class UserServiceConflictError extends Error {}

export const userService = {
  getAllUsers: async (): Promise<UserDto[]> => {
    const users = await userRepository.getAllUsers();

    const mappedUsers: UserDto[] = users.map((user) => {
      return toUserDto(user);
    });
    return mappedUsers;
  },
  getUserById: async (id: number) => {
    const user = await userRepository.getUserById(id);
    if (!user) {
      return null;
    }

    return toUserDto(user);
  },
  updateUser: async (id: number, user: UserUpdateDto) => {
    const existingUser = await userRepository.getUserById(id);

    if (!existingUser) {
      return null;
    }

    if (existingUser.role === "ADMIN" && user.role === "USER") {
      const adminCount = await userRepository.countAdmins();

      if (adminCount <= 1) {
        throw new UserServiceConflictError(LAST_ADMIN_ERROR);
      }
    }

    const mappedUser = toUserUpdateEntity(user);
    const updatedUser = await userRepository.updateUser(id, mappedUser);

    return toUserDto(updatedUser);
  },
  createUser: async (user: UserCreateDto) => {
    const existingUser = await userRepository.getUserByEmail(user.email);

    if (existingUser) {
      return null;
    }

    const mappedUser = toUserCreateEntity(user);
    const newUser = await userRepository.createUser(mappedUser);

    return toUserDto(newUser);
  },
  deleteUser: async (id: number) => {
    const existingUser = await userRepository.getUserById(id);

    if (!existingUser) {
      return null;
    }

    if (existingUser.role === "ADMIN") {
      const adminCount = await userRepository.countAdmins();

      if (adminCount <= 1) {
        throw new UserServiceConflictError(LAST_ADMIN_ERROR);
      }
    }

    if (await userRepository.countRepairWorkerAssignments(id)) {
      throw new UserServiceConflictError(USER_ASSIGNED_TO_REPAIR_ERROR);
    }

    await userRepository.deleteUser(existingUser.id);

    return toUserDto(existingUser);
  },
};
