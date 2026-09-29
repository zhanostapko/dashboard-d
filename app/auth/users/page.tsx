import React from "react";
import UsersTable from "@/components/Users/UsersTable";
import data from "@/data/labels.json";
import { requirePageRole } from "@/lib/authz";
import { userService } from "@/modules/users/service";
import { Role } from "@prisma/client";

const UsersPage = async () => {
  const currentUser = await requirePageRole(Role.ADMIN);

  let users;

  try {
    users = await userService.getAllUsers();
  } catch (error) {
    console.error("Failed to load users:", error);
    return <p className="text-red-500">{data.ru.user.error}</p>;
  }

  return <UsersTable currentUserId={currentUser.id} users={users} />;
};

export default UsersPage;
