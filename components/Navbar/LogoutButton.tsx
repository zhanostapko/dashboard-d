"use client";

import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { useI18n } from "@/components/General/I18nProvider";

export default function LogoutButton() {
  const { labels } = useI18n();
  return (
    <Button
      onClick={() => signOut()}
      className="w-full text-left"
      variant="ghost"
    >
      {labels.common.logout}
    </Button>
  );
}
