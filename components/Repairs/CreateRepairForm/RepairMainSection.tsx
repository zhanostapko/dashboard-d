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
import { useLocaleData } from "@/components/General/I18nProvider";
import { RepairFormValues } from "@/modules/repairs/schema";
import RepairFormSection from "./RepairFormSection";

type Props = {
  dateLabel: string;
  repairId?: number;
};

export default function RepairMainSection({ dateLabel, repairId }: Props) {
  const form = useFormContext<RepairFormValues>();
  const labelsData = useLocaleData();

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
                <div
                  className="cursor-pointer"
                  onClick={(event) => {
                    const input = event.currentTarget.querySelector<HTMLInputElement>(
                      'input[type="date"]'
                    );
                    input?.showPicker?.();
                  }}
                >
                  <Input lang="ru-RU" type="date" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </RepairFormSection>
  );
}
