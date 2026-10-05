"use client";

import { useEffect, useMemo } from "react";
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
import { useLocaleData } from "@/components/General/I18nProvider";
import { ClientDto } from "@/modules/clients/schema";
import { RepairFormValues } from "@/modules/repairs/schema";
import RepairFormSection from "./RepairFormSection";

type Props = {
  clients: ClientDto[];
};

const vehicleLabel = ({
  brand,
  model,
  plate,
}: {
  brand: string;
  model: string;
  plate?: string;
}) => [brand, model, plate].filter(Boolean).join(" · ");

export default function RepairVehicleSection({ clients }: Props) {
  const form = useFormContext<RepairFormValues>();
  const labelsData = useLocaleData();
  const selectedClientId = form.watch("clientId");
  const selectedVehicleId = form.watch("vehicleId");
  const selectedClient = clients.find((client) => client.id === selectedClientId);
  const clientVehicles = useMemo(
    () => selectedClient?.vehicles ?? [],
    [selectedClient]
  );
  const {
    brand,
    manualVehicle,
    mileage,
    model,
    plate,
    selectVehicle,
    title,
  } =
    labelsData.ru.repairs.repairForm.carInformation;

  useEffect(() => {
    if (!selectedVehicleId) return;

    const hasSelectedVehicle = clientVehicles.some(
      (vehicle) => vehicle.id === selectedVehicleId
    );

    if (!hasSelectedVehicle) {
      form.setValue("vehicleId", undefined, { shouldValidate: true });
    }
  }, [clientVehicles, form, selectedVehicleId]);

  const handleVehicleSelect = (value: string) => {
    if (value === "manual") {
      form.setValue("vehicleId", undefined, { shouldValidate: true });
      return;
    }

    const vehicle = clientVehicles.find((item) => String(item.id) === value);
    if (!vehicle) return;

    form.setValue("vehicleId", vehicle.id, { shouldValidate: true });
    form.setValue("carBrand", vehicle.brand, { shouldValidate: true });
    form.setValue("carModel", vehicle.model, { shouldValidate: true });
    form.setValue("carPlate", vehicle.plate ?? "", { shouldValidate: true });
  };

  return (
    <RepairFormSection title={title}>
      {selectedClientId && clientVehicles.length > 0 && (
        <FormField
          control={form.control}
          name="vehicleId"
          render={() => (
            <FormItem>
              <FormLabel>{selectVehicle}</FormLabel>
              <FormControl>
                <Select
                  value={selectedVehicleId ? String(selectedVehicleId) : "manual"}
                  onValueChange={handleVehicleSelect}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={selectVehicle} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">{manualVehicle}</SelectItem>
                    {clientVehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={String(vehicle.id)}>
                        {vehicleLabel(vehicle)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <FormField
          control={form.control}
          name="carBrand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{brand}*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="carModel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{model}*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="carPlate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{plate}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="carMileage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{mileage}</FormLabel>
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
