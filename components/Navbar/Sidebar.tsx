"use client";

import React from "react";
import { Users } from "lucide-react";
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
  const { users } = data.ru.menu;
  const pathname = usePathname();
  const isSectionActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Command className="bg-secondary rounded-none" data-role={role}>
      <CommandList>
        <CommandGroup heading="Menu">
          {role === "ADMIN" && (
            <CommandItem className="p-0">
              <Link
                href="/auth/users"
                className={`flex w-full gap-2 px-3 py-2 rounded-md transition-colors  ${
                  isSectionActive("/auth/users")
                    ? "font-bold"
                    : "hover:bg-gray-200"
                }`}
              >
                <Users />
                {users}
              </Link>
            </CommandItem>
          )}
          {/* Invoices and repairs are temporarily disabled during the focused users/auth/shared refactor. */}
          {role !== "ADMIN" && (
            <CommandItem disabled className="px-3 py-2 text-muted-foreground">
              Разделы временно недоступны
            </CommandItem>
          )}
        </CommandGroup>
        <CommandSeparator />
      </CommandList>
    </Command>
  );
};

export default Sidebar;
