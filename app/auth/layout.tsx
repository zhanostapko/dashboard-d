import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Navbar/Sidebar";

import React from "react";

type Props = {
  children: React.ReactNode;
};
const MainPage = ({ children }: Props) => {
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
