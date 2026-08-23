import { clientCreateSchema } from "@/modules/clients/schema";
import { clientService } from "@/modules/clients/service";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const GET = async () => {
  const clients = await clientService.getAllClients();
  return NextResponse.json(clients);
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const parsed = clientCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const client = await clientService.createClient(parsed.data);
  return NextResponse.json(client, { status: 201 });
};
