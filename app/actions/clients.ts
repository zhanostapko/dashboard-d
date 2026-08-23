"use server";

import { revalidatePath } from "next/cache";
import {
  clientCreateSchema,
  ClientDto,
  clientUpdateSchema,
} from "@/modules/clients/schema";
import { clientService } from "@/modules/clients/service";

type SaveClientState = {
  error: string | null;
  success: string | null;
  client: Partial<ClientDto> | null;
};

export async function saveClientAction(
  _prevState: SaveClientState,
  payload: FormData
): Promise<SaveClientState> {
  const id = payload.get("id") ? Number(payload.get("id")) : null;
  const name = payload.get("name") as string;
  const regNr = payload.get("regNr") as string;
  const address = payload.get("address") as string;
  const bank = payload.get("bank") as string;
  const bankCode = payload.get("bankCode") as string;
  const account = payload.get("account") as string;
  const phone = payload.get("phone") as string;
  const email = payload.get("email") as string;

  try {
    if (id) {
      const client = {
        id,
        name,
        regNr,
        address,
        bank,
        bankCode,
        account,
        phone,
        email,
      };
      const parsed = await clientUpdateSchema.safeParseAsync(client);
      if (parsed && !parsed.success) {
        return {
          error: parsed.error.issues.map((issue) => issue.message).join(", "),
          success: null,
          client: { name, regNr, address, bank, bankCode, account, phone, email },
        };
      }

      const updatedClient = await clientService.updateClient(id, client);
      if (!updatedClient) {
        return {
          error: "Can't find client",
          success: null,
          client: { name, regNr, address, bank, bankCode, account, phone, email },
        };
      }
    } else {
      const client = {
        name,
        regNr,
        address,
        bank,
        bankCode,
        account,
        phone,
        email,
      };
      const parsed = await clientCreateSchema.safeParseAsync(client);
      if (parsed && !parsed.success) {
        return {
          error: parsed.error.issues.map((issue) => issue.message).join(", "),
          success: null,
          client: { name, regNr, address, bank, bankCode, account, phone, email },
        };
      }

      await clientService.createClient(client);
    }

    revalidatePath("/auth/clients");
    return { error: null, success: "Client saved!", client: null };
  } catch (error) {
    return {
      error: `Database error: ${(error as Error).message}`,
      success: null,
      client: { name, regNr, address, bank, bankCode, account, phone, email },
    };
  }
}
