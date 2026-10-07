import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Navbar/Sidebar";
import { requirePageUser } from "@/lib/authz";
import { NavigationProgressProvider } from "@/components/General/NavigationProgress";

import React from "react";

type Props = {
  children: React.ReactNode;
};

export const dynamic = "force-dynamic";

const MainPage = async ({ children }: Props) => {
  const user = await requirePageUser();

  return (
    <NavigationProgressProvider>
      <div>
        <Navbar />
        <main className="flex">
          <div className="hidden md:block h-[100vh] w-[300px]">
            <Sidebar role={user.role} />
          </div>
          <div className="p-5 w-full md:max-w-[1140px]">{children}</div>
        </main>
      </div>
    </NavigationProgressProvider>
  );
};

export default MainPage;
