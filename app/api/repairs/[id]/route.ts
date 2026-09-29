import { authMessages } from "@/lib/auth-messages";
import { NextResponse } from "next/server";

const disabledResponse = async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  await params;

  return NextResponse.json(
    { error: authMessages.repairApiDisabled },
    { status: 410 }
  );
};

export const GET = disabledResponse;
export const PUT = disabledResponse;
export const DELETE = disabledResponse;
