import { authConfig } from "@/lib/authConfig";
import prisma from "@/lib/db";
import { Role, User } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type RoleGuardResult =
  | { user: User; response: null }
  | { user: null; response: NextResponse };

export const requireRole = async (role: Role): Promise<RoleGuardResult> => {
  const session = await getServerSession(authConfig);
  const email = session?.user?.email;

  if (!email) {
    return {
      user: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (user.role !== role) {
    return {
      user: null,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { user, response: null };
};
