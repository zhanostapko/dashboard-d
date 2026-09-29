"use client";

import { Button } from "@/components/ui/button";
import { getAuthErrorMessage } from "@/lib/auth-messages";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const AccessDeniedPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = getAuthErrorMessage(searchParams.get("error"));

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] px-4 py-8 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.32),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(127,29,29,0.26),_transparent_28%),linear-gradient(135deg,_#050505_0%,_#120707_48%,_#050505_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/70 to-transparent" />

      <div className="relative flex min-h-screen items-center justify-center">
        <section className="w-full max-w-sm rounded-[24px] border border-white/12 bg-white/6 p-8 text-white shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-md">
          <h1 className="text-3xl font-semibold tracking-tight">Доступ запрещен</h1>
          <p className="mt-3 text-sm leading-6 text-white/68">
            {message}
          </p>
          <Button
            onClick={() => router.push("/")}
            size="lg"
            className="mt-8 h-12 w-full rounded-xl bg-[#b91c1c] text-sm font-semibold text-white hover:bg-[#991b1b]"
          >
            Назад на главный экран
          </Button>
        </section>
      </div>
    </main>
  );
};

export default AccessDeniedPage;
