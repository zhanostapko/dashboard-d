import { userCreateSchema } from "@/modules/users/schema";
import { userService } from "@/modules/users/service";
import { requireRole } from "@/lib/authz";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const GET = async () => {
  const guard = await requireRole(Role.ADMIN);
  if (guard.response) {
    return guard.response;
  }

  const users = await userService.getAllUsers();
  return NextResponse.json(users);
};

export const POST = async (req: NextRequest) => {
  const guard = await requireRole(Role.ADMIN);
  if (guard.response) {
    return guard.response;
  }

  const body = await req.json();
  const parsed = userCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const user = await userService.createUser(parsed.data);
  if (!user) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  return NextResponse.json(user, { status: 201 });
};
