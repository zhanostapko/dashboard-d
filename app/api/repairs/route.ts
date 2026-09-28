import { NextResponse } from "next/server";

const disabledResponse = () =>
  NextResponse.json(
    { error: "Repairs are temporarily disabled during refactor." },
    { status: 410 }
  );

export const GET = disabledResponse;
export const POST = disabledResponse;
