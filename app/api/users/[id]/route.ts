import { userUpdateSchema } from "@/modules/users/schema";
import {
  UserServiceConflictError,
  userService,
} from "@/modules/users/service";
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
  if (isNaN(+id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const parsed = userUpdateSchema.safeParse(user);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (guard.user.id === +id && parsed.data.role && parsed.data.role !== "ADMIN") {
    return NextResponse.json(
      { error: "You cannot remove your own admin role." },
      { status: 409 }
    );
  }

  try {
    const updatedUser = await userService.updateUser(+id, parsed.data);

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(updatedUser);
  } catch (error) {
    if (!(error instanceof UserServiceConflictError)) {
      throw error;
    }

    return NextResponse.json(
      { error: error.message },
      { status: 409 }
    );
  }
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

  if (guard.user.id === +id) {
    return NextResponse.json(
      { error: "You cannot delete your own user." },
      { status: 409 }
    );
  }

  try {
    const userToDelete = await userService.deleteUser(+id);

    if (!userToDelete) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userToDelete);
  } catch (error) {
    if (!(error instanceof UserServiceConflictError)) {
      throw error;
    }

    return NextResponse.json(
      { error: error.message },
      { status: 409 }
    );
  }
};
