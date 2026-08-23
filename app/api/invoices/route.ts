import { requireAuthenticatedUser } from "@/lib/authz";
import { invoiceService } from "@/modules/invoices/service";
import { revalidatePath } from "next/cache";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
  const guard = await requireAuthenticatedUser();
  if (guard.response) {
    return guard.response;
  }

  const id = req.nextUrl.searchParams.get("invoiceId");
  const invoiceId = id ? parseInt(id) : NaN;

  if (isNaN(invoiceId)) {
    return NextResponse.json({ error: "Invalid invoice ID" }, { status: 400 });
  }

  try {
    const invoice = await invoiceService.getInvoice(invoiceId);

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    if (invoice.status === "Paid") {
      return NextResponse.json(
        { error: "Paid invoices cannot be deleted" },
        { status: 409 }
      );
    }

    await invoiceService.deleteInvoice(invoiceId);
    revalidatePath("/auth/invoices");
    revalidatePath(`/auth/invoices/${invoiceId}`);

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
  const guard = await requireAuthenticatedUser();
  if (guard.response) {
    return guard.response;
  }

  const body = await req.json();
  const invoiceId = body.invoiceId ? parseInt(body.invoiceId) : NaN;

  if (isNaN(invoiceId)) {
    return NextResponse.json({ error: "Invalid invoice ID" }, { status: 400 });
  }

  try {
    const invoice = await invoiceService.getInvoice(invoiceId);

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    if (invoice.status !== "Paid") {
      await invoiceService.updateInvoice(invoiceId, {
        id: invoiceId,
        status: "Paid",
      });
    }

    revalidatePath("/auth/invoices");
    revalidatePath(`/auth/invoices/${invoiceId}`);

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
