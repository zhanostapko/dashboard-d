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

type Props = {
  dateLabel: string;
  repairId?: number;
};

export default function RepairMainSection({ dateLabel, repairId }: Props) {
  const form = useFormContext<RepairFormValues>();

  return (
    <RepairFormSection title={labelsData.ru.repairs.repairNumber}>
      <input
        type="hidden"
        {...form.register("id", { valueAsNumber: true })}
        value={repairId ?? 0}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dateLabel}*</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </RepairFormSection>
  );
}
