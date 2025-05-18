import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("invoiceId");
  const invoiceId = id ? parseInt(id) : NaN;

  if (isNaN(invoiceId)) {
    return NextResponse.json({ error: "Invalid invoice ID" }, { status: 400 });
  }

  try {
    await prisma.invoice.delete({
      where: { id: invoiceId },
    });
    revalidatePath("/invoices");

    return NextResponse.json(
      { message: "Invoice deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as Error).message || "Failed to delete invoice",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const invoiceId = body.invoiceId ? parseInt(body.invoiceId) : NaN;

  if (isNaN(invoiceId)) {
    return NextResponse.json({ error: "Invalid invoice ID" }, { status: 400 });
  }

  try {
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: "Paid" },
    });
    revalidatePath("/invoices");

    return NextResponse.json(
      { message: "Invoice updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as Error).message || "Failed to update invoice",
      },
      { status: 500 }
    );
  }
}
