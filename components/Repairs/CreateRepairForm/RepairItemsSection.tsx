"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import labelsData from "@/data/labels.json";
import { RepairFormValues, RepairItemDto } from "@/modules/repairs/schema";
import RepairFormSection from "./RepairFormSection";
import RepairItemTable from "./RepairItemTable";

type Props = {
  items: RepairItemDto[];
  onAddItem: (item: RepairItemDto) => void;
  onRemoveItem: (id: number) => void;
  onUpdateItem: (item: RepairItemDto) => void;
};

export default function RepairItemsSection({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
}: Props) {
  const form = useFormContext<RepairFormValues>();
  const { title } = labelsData.ru.repairs.repairForm.repairItems;

  return (
    <RepairFormSection title={title}>
      <FormField
        control={form.control}
        name="items"
        render={() => (
          <FormItem>
            <FormLabel>{title}*</FormLabel>
            <FormControl>
              <RepairItemTable
                items={items}
                handleAdd={onAddItem}
                handleRemove={onRemoveItem}
                handleUpdate={onUpdateItem}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </RepairFormSection>
  );
}
