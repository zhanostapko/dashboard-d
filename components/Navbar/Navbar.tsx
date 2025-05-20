import React from "react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutButton from "@/components/Navbar/LogoutButton";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/authConfig";

const Navbar = async () => {
  const session = await getServerSession(authConfig);
  const name = session?.user?.name || "";
  const userArr = name.trim().split(" ");
  const initials = userArr.map((n) => n[0]?.toUpperCase()).join("");
  return (
    <div className="bg-primary text-white py-2 px-5 flex justify-between">
      <Link href={"/"}>
        {/* <Image
          src={"https://github.com/shadcn.png"}
          alt="Logo"
          width={40}
          height={40}
        /> */}
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
          <div className="flex items-center gap-2">
            <div>{name}</div>
            <Avatar>
              <AvatarImage src={session?.user?.image || ""} alt="Avatar" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Navbar;
