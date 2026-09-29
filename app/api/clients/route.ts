import { authMessages } from "@/lib/auth-messages";
import { NextResponse } from "next/server";

const disabledResponse = () =>
  NextResponse.json({ error: authMessages.clientApiDisabled }, { status: 410 });

export const GET = disabledResponse;
export const POST = disabledResponse;
