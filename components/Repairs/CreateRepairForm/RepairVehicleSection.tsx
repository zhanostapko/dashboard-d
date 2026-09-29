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
import labelsData from "@/data/labels.json";
import { RepairFormValues } from "@/modules/repairs/schema";
import RepairFormSection from "./RepairFormSection";

export default function RepairVehicleSection() {
  const form = useFormContext<RepairFormValues>();
  const { brand, mileage, model, plate, title } =
    labelsData.ru.repairs.repairForm.carInformation;

  return (
    <RepairFormSection title={title}>
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
              <FormLabel>{plate}*</FormLabel>
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
