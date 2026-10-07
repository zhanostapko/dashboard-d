"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import Link from "next/link";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { useLocaleData } from "@/components/General/I18nProvider";
import { ClientDto } from "@/modules/clients/schema";
import { RepairFormValues } from "@/modules/repairs/schema";
import { ChevronDown } from "lucide-react";
import RepairFormSection from "./RepairFormSection";

type Props = {
  clients: ClientDto[];
};

const MAX_VISIBLE_CLIENTS = 50;

const getClientSearchText = (client: ClientDto) =>
  [client.name, client.regNr, client.address, client.phone, client.email]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase();

const getClientLabel = (client: ClientDto) =>
  [client.name, client.phone, client.regNr].filter(Boolean).join(" · ");

export default function RepairClientSection({ clients }: Props) {
  const form = useFormContext<RepairFormValues>();
  const labelsData = useLocaleData();
  const selectedClientId = form.watch("clientId");
  const { noClients, searchClient, selectClient } = labelsData.ru.clients;
  const { clientName, phone, title } =
    labelsData.ru.repairs.repairForm.clientInformation;
  const [isClientPickerOpen, setIsClientPickerOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const clientPickerRef = useRef<HTMLDivElement>(null);
  const selectedClient = useMemo(
    () => clients.find((client) => client.id === selectedClientId),
    [clients, selectedClientId]
  );
  const visibleClients = useMemo(() => {
    const searchTokens = clientSearch
      .trim()
      .toLocaleLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    return clients
      .filter((client) => {
        const searchableText = getClientSearchText(client);
        return searchTokens.every((token) => searchableText.includes(token));
      })
      .slice(0, MAX_VISIBLE_CLIENTS);
  }, [clients, clientSearch]);

  useEffect(() => {
    if (!isClientPickerOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!clientPickerRef.current?.contains(event.target as Node)) {
        setIsClientPickerOpen(false);
        setClientSearch("");
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsClientPickerOpen(false);
        setClientSearch("");
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isClientPickerOpen]);

  const handleClientSelect = (value: string) => {
    setIsClientPickerOpen(false);
    setClientSearch("");

    if (value === "manual") {
      form.setValue("clientId", undefined, { shouldValidate: true });
      form.setValue("vehicleId", undefined, { shouldValidate: true });
      if (selectedClientId) {
        form.setValue("clientName", "", { shouldValidate: true });
        form.setValue("clientPhone", "", { shouldValidate: true });
      }
      return;
    }

    const client = clients.find((item) => String(item.id) === value);

    if (!client) return;

    form.setValue("clientId", client.id, { shouldValidate: true });
    form.setValue("vehicleId", undefined, { shouldValidate: true });
    form.setValue("clientName", client.name ?? "", { shouldValidate: true });
    form.setValue("clientPhone", client.phone ?? "", { shouldValidate: true });
  };

  return (
    <RepairFormSection title={title}>
      <FormField
        control={form.control}
        name="clientId"
        render={() => (
          <FormItem>
            <FormLabel>{selectClient}</FormLabel>
            <FormControl>
              <div ref={clientPickerRef} className="relative">
                <button
                  type="button"
                  role="combobox"
                  aria-expanded={isClientPickerOpen}
                  aria-controls="repair-client-options"
                  onClick={() => setIsClientPickerOpen((open) => !open)}
                  className="border-input bg-background flex h-9 w-full items-center justify-between rounded-md border px-3 text-left text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                >
                  <span className={selectedClient ? undefined : "text-muted-foreground"}>
                    {selectedClient ? getClientLabel(selectedClient) : "-"}
                  </span>
                  <ChevronDown className="size-4 opacity-50" />
                </button>

                {isClientPickerOpen && (
                  <div className="bg-popover text-popover-foreground absolute left-0 top-full z-50 mt-1 w-full rounded-md border p-1 shadow-md">
                    <div className="border-b p-1">
                      <Input
                        autoFocus
                        value={clientSearch}
                        onChange={(event) => setClientSearch(event.target.value)}
                        placeholder={searchClient}
                        aria-label={searchClient}
                      />
                    </div>
                    <div
                      id="repair-client-options"
                      role="listbox"
                      className="max-h-64 overflow-y-auto pt-1"
                    >
                      <button
                        type="button"
                        role="option"
                        aria-selected={!selectedClientId}
                        onClick={() => handleClientSelect("manual")}
                        className={`flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent ${!selectedClientId ? "bg-accent" : ""}`}
                      >
                        -{!selectedClientId ? " ✓" : ""}
                      </button>

                      {visibleClients.map((client) => (
                        <button
                          key={client.id}
                          type="button"
                          role="option"
                          aria-selected={selectedClientId === client.id}
                          onClick={() => handleClientSelect(String(client.id))}
                          className={`flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent ${selectedClientId === client.id ? "bg-accent" : ""}`}
                        >
                          {getClientLabel(client)}
                          {selectedClientId === client.id ? " ✓" : ""}
                        </button>
                      ))}

                      {visibleClients.length === 0 && (
                        <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                          {noClients}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="clientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{clientName}*</FormLabel>
              {selectedClientId ? (
                <FormControl>
                  <div className="border-input bg-muted rounded-md border px-3 py-2 font-semibold">
                    {selectedClient ? (
                      <Link
                        href={`/auth/clients/${selectedClient.id}`}
                        className="hover:underline"
                      >
                        {field.value || selectedClient.name}
                      </Link>
                    ) : (
                      field.value || "-"
                    )}
                  </div>
                </FormControl>
              ) : (
                <FormControl>
                  <Input {...field} />
                </FormControl>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clientPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{phone}</FormLabel>
              {selectedClientId ? (
                <FormControl>
                  <div className="border-input bg-muted rounded-md border px-3 py-2 font-semibold">
                    {field.value || "-"}
                  </div>
                </FormControl>
              ) : (
                <FormControl>
                  <Input {...field} />
                </FormControl>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </RepairFormSection>
  );
}
