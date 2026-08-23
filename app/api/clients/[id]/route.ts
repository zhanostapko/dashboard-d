import { clientUpdateSchema } from "@/modules/clients/schema";
import { clientService } from "@/modules/clients/service";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  if (isNaN(+id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const client = await clientService.getClientById(+id);
  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }
  return NextResponse.json(client);
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const client = await req.json();
  const parsed = clientUpdateSchema.safeParse(client);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const updatedClient = await clientService.updateClient(+id, parsed.data);
  if (!updatedClient) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }
  return NextResponse.json(updatedClient);
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  if (isNaN(+id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const clientToDelete = await clientService.deleteClient(+id);
  if (!clientToDelete) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }
  return NextResponse.json(clientToDelete);
};
