import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Navbar/Sidebar";
import { authConfig } from "@/lib/authConfig";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import React from "react";

type Props = {
  children: React.ReactNode;
};
const MainPage = async ({ children }: Props) => {
  const session = await getServerSession(authConfig);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }
  return (
    <div>
      <Navbar />
      <main className="flex">
        <div className="hidden md:block h-[100vh] w-[300px]">
          <Sidebar />
        </div>
        <div className="p-5 w-full md:max-w-[1140px]">{children}</div>
      </main>
    </div>
  );
};

export default MainPage;
