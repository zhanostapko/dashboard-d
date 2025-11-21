import React from "react";
import UsersTable from "@/components/Users/UsersTable";
import data from "@/data/labels.json";
import { userService } from "@/modules/users/service";

const UsersPage = async () => {
  let users;

  try {
    users = await userService.getAllUsers();
  } catch (error) {
    console.error("Failed to load users:", error);
    return <p className="text-red-500">{data.ru.user.error}</p>;
  }

  return <UsersTable users={users} />;
};

export default UsersPage;
