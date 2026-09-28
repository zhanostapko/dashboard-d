import React from "react";
import UsersTable from "@/components/Users/UsersTable";
import data from "@/data/labels.json";
import { getCurrentUser } from "@/lib/authz";
import { userService } from "@/modules/users/service";
import { redirect } from "next/navigation";

const UsersPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role !== "ADMIN") {
    redirect("/auth");
  }

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
