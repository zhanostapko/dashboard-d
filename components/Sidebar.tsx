"use client";

import React from "react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { UserRoundCog, Newspaper } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <Command className="bg-secondary rounded-none">
      <CommandList>
        <CommandGroup heading="Menu">
          <CommandItem className="p-0">
            <Link
              href="/auth/users"
              className={`flex w-full gap-2 px-3 py-2 rounded-md transition-colors  ${
                pathname === "/auth/users" ? "font-bold" : "hover:bg-gray-200"
              }`}
            >
              <UserRoundCog />
              Users
            </Link>
          </CommandItem>
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
              Invoices
            </Link>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
      </CommandList>
    </Command>
  );
};

export default Sidebar;
