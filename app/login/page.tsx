"use client";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { signIn } from "next-auth/react";
import React from "react";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="bg-white text-black rounded-2xl shadow-2xl p-10 max-w-sm w-full text-center">
        <h1 className="text-3xl font-bold mb-6">Welcome Back</h1>
        <p className="text-gray-600 mb-8">Log in to continue</p>
        <Button
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-2 text-white bg-black hover:bg-gray-800"
        >
          <User className="h-5 w-5" />
          Continue with Google
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
