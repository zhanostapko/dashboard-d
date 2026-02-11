import { repairCreateSchema } from "@/modules/repairs/schema";
import { repairService } from "@/modules/repairs/service";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const GET = async () => {
  const repairs = await repairService.getAllRepairs();
  return NextResponse.json(repairs);
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const parsed = repairCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const repair = await repairService.createRepair(parsed.data);
  return NextResponse.json(repair, { status: 201 });
};
