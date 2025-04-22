import React from "react";

import { getUsers } from "@/lib/users";
import UsersTable from "@/components/users/UsersTable";

const UsersPage = async () => {
  let users;

  try {
    users = await getUsers();
  } catch (error) {
    console.error("Failed to load users:", error);
    return (
      <p className="text-red-500">
        Failed to fetch users. Please try again later.
      </p>
    );
  }

  return <UsersTable users={users} />;
};

export default UsersPage;
