import React from "react";

import { getUsers } from "@/lib/users";
import UsersTable from "@/components/users/UsersTable";
import data from "@/data/labels.json";

const UsersPage = async () => {
  let users;

  try {
    users = await getUsers();
  } catch (error) {
    console.error("Failed to load users:", error);
    return <p className="text-red-500">{data.ru.user.error}</p>;
  }

  return <UsersTable users={users} />;
};

export default UsersPage;
