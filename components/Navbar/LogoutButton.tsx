"use client";

import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

export default function LogoutButton() {
  return (
    <Button
      onClick={() => signOut()}
      className="w-full text-left"
      variant="ghost"
    >
      Logout
    </Button>
  );
}
