"use client";

import React from "react";
import { Car, Newspaper, Users } from "lucide-react";
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
import { getAvailableSections, type AppSection } from "@/lib/app-sections";

type SidebarProps = {
  role: Role;
};

const sectionIcons: Record<AppSection["id"], React.ComponentType> = {
  invoices: Newspaper,
  repairs: Car,
  users: Users,
};

const Sidebar = ({ role }: SidebarProps) => {
  const sections = getAvailableSections(role);
  const pathname = usePathname();
  const isSectionActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Command className="bg-secondary rounded-none" data-role={role}>
      <CommandList>
        <CommandGroup heading="Menu">
          {sections.map((section) => {
            const Icon = sectionIcons[section.id];
            const label = data.ru.menu[section.labelKey];

            return (
              <CommandItem className="p-0" key={section.id}>
              <Link
                href={section.href}
                className={`flex w-full gap-2 px-3 py-2 rounded-md transition-colors  ${
                  isSectionActive(section.href)
                    ? "font-bold"
                    : "hover:bg-gray-200"
                }`}
              >
                <Icon />
                {label}
              </Link>
            </CommandItem>
            );
          })}
          {sections.length === 0 && (
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
