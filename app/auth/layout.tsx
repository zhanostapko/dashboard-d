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
      <div className="flex h-dvh flex-col overflow-hidden">
        <div className="shrink-0">
          <Navbar />
        </div>
        <main className="flex min-h-0 flex-1">
          <aside className="hidden h-full w-[300px] shrink-0 overflow-y-auto md:block">
            <Sidebar role={user.role} />
          </aside>
          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            <div className="w-full md:max-w-[1140px]">{children}</div>
          </div>
        </main>
      </div>
    </NavigationProgressProvider>
  );
};

export default MainPage;
