import { NextResponse } from "next/server";

const disabledResponse = () =>
  NextResponse.json(
    { error: "Invoices are temporarily disabled during refactor." },
    { status: 410 }
  );

export const DELETE = disabledResponse;
export const PUT = disabledResponse;
