"use client";

import { getAuthErrorMessage } from "@/lib/auth-messages";
import { signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    void signOut({ callbackUrl: "/login" });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 text-center">
      <div className="max-w-md space-y-3">
        <h1 className="text-2xl font-semibold">Ошибка аутентификации</h1>
        <p>{getAuthErrorMessage(error)}</p>
      </div>
    </div>
  );
}
