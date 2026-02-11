import { userUpdateSchema } from "@/modules/users/schema";
import { userService } from "@/modules/users/service";
import { requireRole } from "@/lib/authz";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const guard = await requireRole(Role.ADMIN);
  if (guard.response) {
    return guard.response;
  }

  const { id } = await params;
  if (isNaN(+id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const user = await userService.getUserById(+id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json(user);
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const guard = await requireRole(Role.ADMIN);
  if (guard.response) {
    return guard.response;
  }

  const { id } = await params;
  const user = await req.json();
  const parsed = userUpdateSchema.safeParse(user);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const updatedUser = await userService.updateUser(+id, parsed.data);

  if (!updatedUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json(updatedUser);
};
export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const guard = await requireRole(Role.ADMIN);
  if (guard.response) {
    return guard.response;
  }

  const { id } = await params;

  if (isNaN(+id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const userToDelete = await userService.deleteUser(+id);

  if (!userToDelete) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(userToDelete);
};
