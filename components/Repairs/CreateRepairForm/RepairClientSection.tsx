"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import labelsData from "@/data/labels.json";
import { ClientDto } from "@/modules/clients/schema";
import { RepairFormValues } from "@/modules/repairs/schema";
import RepairFormSection from "./RepairFormSection";

type Props = {
  clients: ClientDto[];
};

export default function RepairClientSection({ clients }: Props) {
  const form = useFormContext<RepairFormValues>();
  const selectedClientId = form.watch("clientId");
  const { clearClient, selectClient } = labelsData.ru.clients;
  const { clientName, phone, title } =
    labelsData.ru.repairs.repairForm.clientInformation;

  const handleClientSelect = (value: string) => {
    if (value === "manual") {
      form.setValue("clientId", undefined, { shouldValidate: true });
      form.setValue("vehicleId", undefined, { shouldValidate: true });
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
              <Select
                value={selectedClientId ? String(selectedClientId) : "manual"}
                onValueChange={handleClientSelect}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={selectClient} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">{clearClient}</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={String(client.id)}>
                      {client.name}
                      {client.phone ? ` · ${client.phone}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <FormControl>
                <Input {...field} />
              </FormControl>
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
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </RepairFormSection>
  );
}
