import { authConfig } from "@/lib/authConfig";
import prisma from "@/lib/db";
import { Role, User } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { authMessages } from "./auth-messages";

type UserGuardResult =
  | { user: User; response: null }
  | { user: null; response: NextResponse };

const unauthorizedResponse = () =>
  NextResponse.json(
    { error: authMessages.authenticationRequired },
    { status: 401 }
  );

const forbiddenResponse = () =>
  NextResponse.json({ error: authMessages.forbidden }, { status: 403 });

export const getCurrentUser = async (): Promise<User | null> => {
  const session = await getServerSession(authConfig);
  const email = session?.user?.email;

  if (!email) {
    return null;
  }

  return prisma.user.findUnique({ where: { email } });
};

export const requireAuthenticatedUser = async (): Promise<UserGuardResult> => {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      response: unauthorizedResponse(),
    };
  }

  return { user, response: null };
};

export const requireRole = async (role: Role): Promise<UserGuardResult> => {
  const guard = await requireAuthenticatedUser();

  if (guard.response) {
    return guard;
  }

  const { user } = guard;

  if (user.role !== role) {
    return {
      user: null,
      response: forbiddenResponse(),
    };
  }

  return { user, response: null };
};

export const requirePageUser = async (): Promise<User> => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
};

export const requirePageRole = async (role: Role): Promise<User> => {
  const user = await requirePageUser();

  if (user.role !== role) {
    redirect("/auth");
  }

  return user;
};
