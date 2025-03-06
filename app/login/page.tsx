"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import React from "react";

const LoginPage = () => {
  return (
    <div>
      LoginPage
      <Button onClick={() => signIn("google")}>LogIn</Button>
    </div>
  );
};

export default LoginPage;
