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
    // await prisma.invoiceItem.deleteMany({
    //   where: { invoiceId: invoiceId },
    // });
    await prisma.invoice.delete({
      where: { id: invoiceId },
    });
    revalidatePath("/users");
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
