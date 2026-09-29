"use server";

import { revalidatePath } from "next/cache";
import { authMessages } from "@/lib/auth-messages";
import { getCurrentUser } from "@/lib/authz";
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

type DeleteClientState = {
  error: string | null;
  success: boolean;
};

const getFormValue = (payload: FormData, key: string) =>
  String(payload.get(key) ?? "");

export async function saveClientAction(
  _prevState: SaveClientState,
  payload: FormData
): Promise<SaveClientState> {
  const currentUser = await getCurrentUser();
  const id = payload.get("id") ? Number(payload.get("id")) : null;
  const name = getFormValue(payload, "name");
  const regNr = getFormValue(payload, "regNr");
  const address = getFormValue(payload, "address");
  const bank = getFormValue(payload, "bank");
  const bankCode = getFormValue(payload, "bankCode");
  const account = getFormValue(payload, "account");
  const phone = getFormValue(payload, "phone");
  const email = getFormValue(payload, "email");

  if (!currentUser) {
    return {
      error: authMessages.authenticationRequired,
      success: null,
      client: { name, regNr, address, bank, bankCode, account, phone, email },
    };
  }

  if (id !== null && !Number.isInteger(id)) {
    return {
      error: "Некорректный клиент.",
      success: null,
      client: { name, regNr, address, bank, bankCode, account, phone, email },
    };
  }

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
    if (id) {
      revalidatePath(`/auth/clients/${id}`);
    }
    return { error: null, success: "Client saved!", client: null };
  } catch (error) {
    return {
      error: `Database error: ${(error as Error).message}`,
      success: null,
      client: { name, regNr, address, bank, bankCode, account, phone, email },
    };
  }
}

export async function deleteClientAction(
  id: number
): Promise<DeleteClientState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      error: authMessages.authenticationRequired,
      success: false,
    };
  }

  if (!Number.isInteger(id)) {
    return {
      error: "Некорректный клиент.",
      success: false,
    };
  }

  try {
    const deletedClient = await clientService.deleteClient(id);

    if (!deletedClient) {
      return {
        error: "Клиент не найден.",
        success: false,
      };
    }

    revalidatePath("/auth/clients");
    revalidatePath(`/auth/clients/${id}`);
    return { error: null, success: true };
  } catch (error) {
    return {
      error: `Ошибка базы данных: ${(error as Error).message}`,
      success: false,
    };
  }
}
