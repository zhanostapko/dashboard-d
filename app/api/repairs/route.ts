import { repairCreateSchema } from "@/modules/repairs/schema";
import { repairService } from "@/modules/repairs/service";
import { requireAuthenticatedUser } from "@/lib/authz";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const GET = async () => {
  const guard = await requireAuthenticatedUser();
  if (guard.response) {
    return guard.response;
  }

  const repairs = await repairService.getAllRepairs();
  return NextResponse.json(repairs);
};

export const POST = async (req: NextRequest) => {
  const guard = await requireAuthenticatedUser();
  if (guard.response) {
    return guard.response;
  }

  const body = await req.json();
  const parsed = repairCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const repair = await repairService.createRepair(parsed.data);
  revalidatePath("/auth/repairs");
  return NextResponse.json(repair, { status: 201 });
};
