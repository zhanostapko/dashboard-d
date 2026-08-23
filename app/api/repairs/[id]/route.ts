import { repairUpdateSchema } from "@/modules/repairs/schema";
import { repairService } from "@/modules/repairs/service";
import { requireAuthenticatedUser } from "@/lib/authz";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const guard = await requireAuthenticatedUser();
  if (guard.response) {
    return guard.response;
  }

  const { id } = await params;
  if (isNaN(+id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const repair = await repairService.getRepairById(+id);
  if (!repair) {
    return NextResponse.json({ error: "Repair not found" }, { status: 404 });
  }
  return NextResponse.json(repair);
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const guard = await requireAuthenticatedUser();
  if (guard.response) {
    return guard.response;
  }

  const { id } = await params;
  const repair = await req.json();
  const parsed = repairUpdateSchema.safeParse(repair);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const updatedRepair = await repairService.updateRepair(+id, parsed.data);
  if (!updatedRepair) {
    return NextResponse.json({ error: "Repair not found" }, { status: 404 });
  }
  revalidatePath("/auth/repairs");
  return NextResponse.json(updatedRepair);
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const guard = await requireAuthenticatedUser();
  if (guard.response) {
    return guard.response;
  }

  const { id } = await params;
  if (isNaN(+id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const repairToDelete = await repairService.deleteRepair(+id);
  if (!repairToDelete) {
    return NextResponse.json({ error: "Repair not found" }, { status: 404 });
  }
  revalidatePath("/auth/repairs");
  return NextResponse.json(repairToDelete);
};
