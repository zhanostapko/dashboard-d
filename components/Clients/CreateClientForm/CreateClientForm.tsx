"use client";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveClientAction } from "@/app/actions/clients";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useLocaleData } from "@/components/General/I18nProvider";
import { ClientDto } from "@/modules/clients/schema";

type Props = {
  selectedClient?: ClientDto | null;
  onClose?: () => void;
  onCancel?: () => void;
};

export default function CreateClientForm({
  selectedClient,
  onClose,
  onCancel,
}: Props) {
  const router = useRouter();
  const data = useLocaleData();
  const [state, formAction, isPending] = useActionState(saveClientAction, {
    error: null,
    success: null,
    client: selectedClient || null,
  });

  const {
    name,
    regNr,
    address,
    bank,
    bankCode,
    account,
    phone,
    email,
    editClient,
    createClient,
    requiredField,
    saveBtn,
    addClientBtn,
    loading,
  } = data.ru.clients;

  useEffect(() => {
    if (state.success) {
      router.refresh();
      onClose?.();
    }
  }, [state.success, onClose, router]);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">
        {selectedClient ? `${editClient}` : `${createClient}`}
      </h1>

      {state.error && <p className="text-red-500">{state.error}</p>}
      {state.success && <p className="text-green-500">{state.success}</p>}

      <form action={formAction} className="space-y-4">
        {selectedClient?.id && (
          <input type="hidden" name="id" value={selectedClient.id} />
        )}

        <div>
          <Label className="mb-2" htmlFor="name">
            {name}*
          </Label>
          <Input name="name" defaultValue={state?.client?.name || ""} required />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <Label className="mb-2" htmlFor="regNr">
              {regNr}
            </Label>
            <Input name="regNr" defaultValue={state?.client?.regNr || ""} />
          </div>
          <div className="flex-1">
            <Label className="mb-2" htmlFor="phone">
              {phone}
            </Label>
            <Input name="phone" defaultValue={state?.client?.phone || ""} />
          </div>
        </div>

        <div>
          <Label className="mb-2" htmlFor="email">
            {email}
          </Label>
          <Input name="email" defaultValue={state?.client?.email || ""} />
        </div>

        <div>
          <Label className="mb-2" htmlFor="address">
            {address}
          </Label>
          <Input name="address" defaultValue={state?.client?.address || ""} />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <Label className="mb-2" htmlFor="bank">
              {bank}
            </Label>
            <Input name="bank" defaultValue={state?.client?.bank || ""} />
          </div>
          <div className="flex-1">
            <Label className="mb-2" htmlFor="bankCode">
              {bankCode}
            </Label>
            <Input
              name="bankCode"
              defaultValue={state?.client?.bankCode || ""}
            />
          </div>
        </div>

        <div>
          <Label className="mb-2" htmlFor="account">
            {account}
          </Label>
          <Input name="account" defaultValue={state?.client?.account || ""} />
        </div>

        <p className="text-sm text-gray-400">* - {requiredField}</p>

        <div className={onCancel ? "flex justify-end gap-2" : undefined}>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {data.ru.invoices.invoiceForm.invoiceItems.cancelEdit}
            </Button>
          )}
          <Button
            disabled={isPending}
            type="submit"
            className={onCancel ? undefined : "w-full bg-green-500 text-white"}
          >
            {isPending ? loading : selectedClient ? `${saveBtn}` : `${addClientBtn}`}
          </Button>
        </div>
      </form>
    </>
  );
}
