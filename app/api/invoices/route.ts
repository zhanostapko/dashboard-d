import { NextResponse } from "next/server";

const disabledResponse = () =>
  NextResponse.json(
    { error: "Invoices API is disabled. Use server actions." },
    { status: 410 }
  );

export const DELETE = disabledResponse;
export const PUT = disabledResponse;
