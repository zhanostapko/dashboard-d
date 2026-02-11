import React from "react";
import UsersTable from "@/components/Users/UsersTable";
import data from "@/data/labels.json";
import { authConfig } from "@/lib/authConfig";
import prisma from "@/lib/db";
import { userService } from "@/modules/users/service";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const UsersPage = async () => {
  const session = await getServerSession(authConfig);
  const email = session?.user?.email;

  if (!email) {
    redirect("/login");
  }

  const currentUser = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  });

  if (!currentUser || currentUser.role !== "ADMIN") {
    redirect("/auth");
  }

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
