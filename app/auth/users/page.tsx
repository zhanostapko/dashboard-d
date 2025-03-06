import prisma from "@/lib/db";
import React from "react";

const UsersPage = async () => {
  const users = await prisma.user.findMany();

  console.log(users, "users");
  return <div>UsersPage</div>;
};

export default UsersPage;
