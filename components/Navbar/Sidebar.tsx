"use client";

import React from "react";
import { Newspaper, Car } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@prisma/client";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import data from "@/data/labels.json";

type SidebarProps = {
  role: Role;
};

const Sidebar = ({ role }: SidebarProps) => {
  const { invoices, repairs } = data.ru.menu;
  const pathname = usePathname();

  return (
    <Command className="bg-secondary rounded-none" data-role={role}>
      <CommandList>
        <CommandGroup heading="Menu">
          <CommandItem className="p-0">
            <Link
              href="/auth/invoices"
              className={`flex w-full gap-2 px-3 py-2 rounded-md transition-colors  ${
                pathname === "/auth/invoices"
                  ? "font-bold"
                  : "hover:bg-gray-200"
              }`}
            >
              <Newspaper />
              {invoices}
            </Link>
          </CommandItem>
          <CommandItem className="p-0">
            <Link
              href="/auth/repairs"
              className={`flex w-full gap-2 px-3 py-2 rounded-md transition-colors  ${
                pathname === "/auth/repairs" ? "font-bold" : "hover:bg-gray-200"
              }`}
            >
              <Car />
              {repairs}
            </Link>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
      </CommandList>
    </Command>
  );
};

export default Sidebar;
