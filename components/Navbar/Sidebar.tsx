"use client";

import React from "react";
import { Car, HandCoins, Newspaper, Users, Wrench } from "lucide-react";
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
import { useLocaleData } from "@/components/General/I18nProvider";
import { getAvailableSections, type AppSection } from "@/lib/app-sections";

type SidebarProps = {
  role: Role;
};

const sectionIcons: Record<AppSection["id"], React.ComponentType> = {
  clients: Users,
  invoices: Newspaper,
  vehicles: Car,
  repairs: Wrench,
  users: Users,
  earnings: HandCoins,
};

const Sidebar = ({ role }: SidebarProps) => {
  const sections = getAvailableSections(role);
  const data = useLocaleData();
  const pathname = usePathname();
  const isSectionActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Command className="bg-secondary rounded-none" data-role={role}>
      <CommandList>
        <CommandGroup heading={data.ru.common.menu}>
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
              {data.ru.common.unavailable}
            </CommandItem>
          )}
        </CommandGroup>
        <CommandSeparator />
      </CommandList>
    </Command>
  );
};

export default Sidebar;
