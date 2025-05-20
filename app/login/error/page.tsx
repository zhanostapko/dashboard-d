"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import React from "react";

const AccessDeniedPage = () => {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
      <p className="text-muted-foreground mb-6">
        You do not have permission to access this page.
      </p>
      <Button onClick={() => router.push("/login")}>Go to Login</Button>
    </div>
  );
};

export default AccessDeniedPage;
